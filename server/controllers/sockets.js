import geolib from "geolib";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Ride from "../models/Ride.js";

const onDutyRiders = new Map();

const handleSocketConnection = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.access_token;
      if (!token) return next(new Error("Authentication invalid: No token"));

      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(payload.id);
      if (!user) return next(new Error("Authentication invalid: User not found"));

      socket.user = { id: payload.id, role: user.role };
      next();
    } catch (error) {
      console.error("Socket Auth Error:", error);
      next(new Error("Authentication invalid: Token verification failed"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(`User Joined: ${user.id} (${user.role})`);

    if (user.role === "rider") {
      socket.on("goOnDuty", (coords) => {
        onDutyRiders.set(user.id, { socketId: socket.id, coords });
        socket.join("onDuty");
        console.log(`✅ Rider ${user.id} is now ON DUTY at coords:`, coords);
        console.log(`📊 Total on-duty riders: ${onDutyRiders.size}`);
        updateNearbyriders();
      });

      socket.on("goOffDuty", () => {
        onDutyRiders.delete(user.id);
        socket.leave("onDuty");
        console.log(`❌ Rider ${user.id} is now OFF DUTY`);
        console.log(`📊 Total on-duty riders: ${onDutyRiders.size}`);
        updateNearbyriders();
      });

      socket.on("updateLocation", (coords) => {
        if (onDutyRiders.has(user.id)) {
          onDutyRiders.get(user.id).coords = coords;
          console.log(`📍 Rider ${user.id} updated location:`, coords);
          updateNearbyriders();
          socket.to(`rider_${user.id}`).emit("riderLocationUpdate", {
            riderId: user.id,
            coords,
          });
        }
      });
    }

    if (user.role === "customer") {
      socket.on("subscribeToZone", (customerCoords) => {
        socket.user.coords = customerCoords;
        sendNearbyRiders(socket, customerCoords);
      });

      socket.on("searchrider", async (rideId) => {
        try {
          const ride = await Ride.findById(rideId).populate("customer rider");
          if (!ride) {
            console.log(`❌ Ride ${rideId} not found`);
            return socket.emit("error", { message: "Ride not found" });
          }

          const { latitude: pickupLat, longitude: pickupLon } = ride.pickup;
          console.log(`🔍 Searching for riders near: ${pickupLat}, ${pickupLon}`);
          console.log(`📊 Currently ${onDutyRiders.size} riders on duty`);

          let retries = 0;
          let rideAccepted = false;
          let canceled = false;
          const MAX_RETRIES = 20;
          let retryInterval;

          const retrySearch = async () => {
            if (canceled) return;
            retries++;
            
            console.log(`🔄 Retry ${retries}/${MAX_RETRIES} for ride ${rideId}`);

            const riders = sendNearbyRiders(socket, { latitude: pickupLat, longitude: pickupLon }, ride);
            console.log(`✅ Found ${riders.length} nearby riders within 60km`);
            
            if (riders.length > 0 || retries >= MAX_RETRIES) {
              if (retryInterval) clearInterval(retryInterval);
              if (!rideAccepted && retries >= MAX_RETRIES) {
                console.log(`⏰ Max retries reached for ride ${rideId}, deleting...`);
                await Ride.findByIdAndDelete(rideId);
                socket.emit("error", { message: "No riders found within 5 minutes." });
              }
            }
          };

          retrySearch();
          retryInterval = setInterval(retrySearch, 10000);

          socket.on("rideAccepted", () => {
            rideAccepted = true;
            if (retryInterval) clearInterval(retryInterval);
          });

          socket.on("cancelRide", async () => {
            canceled = true;
            if (retryInterval) clearInterval(retryInterval);
            await Ride.findByIdAndDelete(rideId);
            socket.emit("rideCanceled", { message: "Ride canceled" });

            if (ride.rider) {
              const riderSocket = getRiderSocket(ride.rider._id);
              riderSocket?.emit("rideCanceled", { message: `Customer ${user.id} canceled the ride.` });
            }
            console.log(`Customer ${user.id} canceled ride ${rideId}`);
          });
        } catch (error) {
          console.error("Error searching for rider:", error);
          socket.emit("error", { message: "Error searching for rider" });
        }
      });
    }

    socket.on("subscribeToriderLocation", (riderId) => {
      const rider = onDutyRiders.get(riderId);
      if (rider) {
        socket.join(`rider_${riderId}`);
        socket.emit("riderLocationUpdate", { riderId, coords: rider.coords });
        console.log(`User ${user.id} subscribed to rider ${riderId}'s location.`);
      }
    });

    socket.on("subscribeRide", async (rideId) => {
      socket.join(`ride_${rideId}`);
      try {
        const rideData = await Ride.findById(rideId).populate("customer rider");
        socket.emit("rideData", rideData);
      } catch (error) {
        socket.emit("error", { message: "Failed to receive ride data" });
      }
    });

    socket.on("sendChatMessage", async ({ rideId, message, recipientRole }) => {
      try {
        const ride = await Ride.findById(rideId);
        if (!ride) {
          console.log("Ride not found for chat:", rideId);
          return;
        }

        const chatData = {
          rideId,
          message,
          senderId: user.id,
          senderRole: user.role,
          timestamp: new Date(),
        };

        io.to(`ride_${rideId}`).emit("chatMessage", chatData);
        console.log(`Chat message sent in ride ${rideId} from ${user.role}`);
      } catch (error) {
        console.error("Error sending chat message:", error);
      }
    });

    socket.on("getChatHistory", async (rideId) => {
      socket.emit("chatHistory", { rideId, messages: [] });
    });

    socket.on("disconnect", () => {
      if (user.role === "rider") onDutyRiders.delete(user.id);
      console.log(`${user.role} ${user.id} disconnected.`);
    });

    function updateNearbyriders() {
      io.sockets.sockets.forEach((socket) => {
        if (socket.user?.role === "customer") {
          const customerCoords = socket.user.coords;
          if (customerCoords) sendNearbyRiders(socket, customerCoords);
        }
      });
    }

    function sendNearbyRiders(socket, location, ride = null) {
      const nearbyriders = Array.from(onDutyRiders.values())
        .map((rider) => ({
          ...rider,
          distance: geolib.getDistance(rider.coords, location),
        }))
        .filter((rider) => rider.distance <= 60000)
        .sort((a, b) => a.distance - b.distance);

      socket.emit("nearbyriders", nearbyriders);

      if (ride) {
        const topRiders = nearbyriders.slice(0, Math.min(10, nearbyriders.length));
        
        console.log(`Broadcasting ride ${ride._id} to ${topRiders.length} nearby riders`);
        
        const rideData = ride.toObject ? ride.toObject() : ride;
        
        topRiders.forEach((rider, index) => {
          setTimeout(() => {
            const rideOffer = {
              ...rideData,
              pickupDistance: (rider.distance / 1000).toFixed(2),
              estimatedPickupTime: Math.ceil(rider.distance / 500),
            };
            
            io.to(rider.socketId).emit("rideOffer", rideOffer);
            console.log(`Sent rideOffer to rider socket ${rider.socketId} for ride ${ride._id}`);
          }, index * 500);
        });
      }

      return nearbyriders;
    }

    function getRiderSocket(riderId) {
      const rider = onDutyRiders.get(riderId);
      return rider ? io.sockets.sockets.get(rider.socketId) : null;
    }
  });
};

export default handleSocketConnection;
