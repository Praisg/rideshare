import dotenv from 'dotenv';

dotenv.config();

import 'express-async-errors';
import EventEmitter from 'events';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as socketIo } from 'socket.io'; 
import connectDB from './config/connect.js';
import initializeFirebase from './config/firebase.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authMiddleware from './middleware/authentication.js';

// Routers
import authRouter from './routes/auth.js';
import rideRouter from './routes/ride.js';
import mapsRouter from './routes/maps.js';
import kycRouter from './routes/kyc.js';
import adminRouter from './routes/admin.js';
import agentRouter from './routes/agent.js';
import restaurantRouter from './routes/restaurant.js';
import foodOrderRouter from './routes/foodOrder.js';

// Import socket handler
import handleSocketConnection from './controllers/sockets.js';

EventEmitter.defaultMaxListeners = 20;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);

const io = new socketIo(server, { cors: { origin: "*" } });

// Attach the WebSocket instance to the request object
app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Initialize the WebSocket handling logic
handleSocketConnection(io);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running!" });
});

// Routes
app.use("/auth", authRouter);
app.use("/maps", mapsRouter);
app.use("/ride", authMiddleware, rideRouter);
app.use("/kyc", kycRouter);
app.use("/admin", adminRouter);
app.use("/agent", agentRouter);
app.use("/restaurants", restaurantRouter);
app.use("/food-orders", authMiddleware, foodOrderRouter);

// Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    initializeFirebase();
    server.listen(process.env.PORT || 3000, "0.0.0.0", () =>
      console.log(
        `HTTP server is running on port http://localhost:${process.env.PORT || 3000}`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

start();
