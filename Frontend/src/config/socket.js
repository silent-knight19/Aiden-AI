import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

export const initializeSocket = (projectId) => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit('join-project', { projectId });
};

export const receiveMessage = (event, callback) => {
  socket.on(event, callback);
};

export const sendMessage = (event, data) => {
  socket.emit(event, data);
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
