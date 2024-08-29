import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the type for the context value
type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

// Custom hook to use the SocketContext
export const useSocket = () => useContext(SocketContext);
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      auth: { token: sessionStorage.getItem('accessToken') },
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
