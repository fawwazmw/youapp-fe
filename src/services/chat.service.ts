import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const ChatService = {
  connect: (token: string) => {
    if (!socket) {
      // The socket server usually runs on the root domain without /api suffix, 
      // but we fallback to the same URL base if no specific socket URL is provided.
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.wardaya.my.id';
      socket = io(socketUrl.replace('/api', ''), {
        auth: {
          token
        }
      });
    }
    return socket;
  },
  
  disconnect: () => {
    if (socket) {
      socket.disconnect();
    }
  },
  
  sendMessage: (message: string, recipientId: string) => {
    if (socket) {
      socket.emit('sendMessage', { message, recipientId });
    }
  },
  
  onNewMessage: (callback: (data: unknown) => void) => {
    if (socket) {
      socket.on('newMessage', callback);
    }
  }
};
