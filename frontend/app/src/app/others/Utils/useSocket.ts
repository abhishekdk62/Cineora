// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL_SOCKET || 'http://localhost:5000';
      console.log('🔗 Creating socket connection to:', serverUrl);
      
      socket = io(serverUrl, {
        withCredentials: true,
        transports: ['polling', 'websocket'],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10
      });

      socket.on('connect', () => {
        console.log('✅ Socket connected! ID:', socket?.id);
        setIsConnected(true);
      });

      socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected. Reason:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        setIsConnected(false);
      });

      // ✅ ADD GLOBAL EVENT LISTENER FOR DEBUGGING
      socket.onAny((eventName, ...args) => {
      });

      // ✅ SPECIFIC LISTENER FOR participant_left EVENTS
      socket.on('participant_left', (data) => {
      });

      // ✅ SPECIFIC LISTENER FOR participant_joined EVENTS
      socket.on('participant_joined', (data) => {
      });

      // ✅ TEST CONNECTION BY SENDING PING
      socket.on('connect', () => {
        socket?.emit('test-ping', { message: 'Frontend connected' });
      });

      // ✅ LISTEN FOR PONG RESPONSE
      socket.on('test-pong', (data) => {
      });
    }
    
    if (socket && socket.connected && !isConnected) {
      setIsConnected(true);
    }

    return () => {
      // Keep connection alive - don't disconnect
    };
  }, []); // ✅ Remove isConnected from dependencies to prevent infinite re-renders

  // ✅ ADD PERIODIC CONNECTION STATUS CHECK
  useEffect(() => {
    const checkConnection = () => {
      if (socket) {
        const actuallyConnected = socket.connected;
        if (actuallyConnected !== isConnected) {
          setIsConnected(actuallyConnected);
        }
      }
    };

    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);



  return { socket, isConnected };
};
