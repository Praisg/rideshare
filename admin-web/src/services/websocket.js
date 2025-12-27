import { io } from 'socket.io-client';
import { WS_URL } from '../config';
import { useDataStore } from '../store/dataStore';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Admin WebSocket connected');
      this.connected = true;
      this.subscribeToAdminEvents();
    });

    this.socket.on('disconnect', () => {
      console.log('Admin WebSocket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  subscribeToAdminEvents() {
    this.socket.emit('subscribeAdmin', { adminId: 'admin' });

    this.socket.on('newRide', (ride) => {
      console.log('New ride created:', ride);
      const { rides, setRides } = useDataStore.getState();
      setRides([ride, ...rides]);
    });

    this.socket.on('rideUpdate', (ride) => {
      console.log('Ride updated:', ride);
      const { updateRide } = useDataStore.getState();
      updateRide(ride._id, ride);
    });

    this.socket.on('newKycSubmission', (user) => {
      console.log('New KYC submission:', user);
      const { kycSubmissions, setKycSubmissions } = useDataStore.getState();
      setKycSubmissions([user, ...kycSubmissions]);
    });

    this.socket.on('kycStatusUpdate', (data) => {
      console.log('KYC status updated:', data);
      const { updateUser } = useDataStore.getState();
      updateUser(data.userId, { kyc: data.kyc });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const wsService = new WebSocketService();

