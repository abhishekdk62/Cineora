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
        console.log(' Socket disconnected. Reason:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        setIsConnected(false);
      });

      socket.on('new-message', (messageData) => {
        console.log('📨 New message received:', messageData);
        window.dispatchEvent(new CustomEvent('newMessage', { detail: messageData }));
      });

      socket.on('message-edited', (data) => {
        console.log('✏️ Message edited:', data);
        window.dispatchEvent(new CustomEvent('messageEdited', { detail: data }));
      });

      socket.on('message-deleted', (data) => {
        console.log('🗑️ Message deleted:', data);
        window.dispatchEvent(new CustomEvent('messageDeleted', { detail: data }));
      });

      socket.onAny((eventName, ...args) => {
      });

      socket.on('participant_left', (data) => {
      });

      socket.on('participant_joined', (data) => {
      });

      socket.on('connect', () => {
        socket?.emit('test-ping', { message: 'Frontend connected' });
      });

      socket.on('test-pong', (data) => {
      });
    }
    
    if (socket && socket.connected && !isConnected) {
      setIsConnected(true);
    }

    return () => {
    };
  }, []);

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

  const joinChatRoom = (chatRoomId: string) => {
    console.log('🔗 Joining chat room:', chatRoomId);
    socket?.emit('join-showtime', `chat-${chatRoomId}`);
  };

  const leaveChatRoom = (chatRoomId: string) => {
    console.log('👋 Leaving chat room:', chatRoomId);
    socket?.emit('leave-showtime', `chat-${chatRoomId}`);
  };

  return { 
    socket, 
    isConnected, 
    joinChatRoom, 
    leaveChatRoom 
  };
};
