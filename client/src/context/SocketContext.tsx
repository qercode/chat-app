import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { AuthContext } from "./AuthContext";

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketContextProvider");
  }
  return context;
};

export const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const context= useContext(AuthContext);

  console.log(context?.authUser);
  

  useEffect(() => {
    if (context?.authUser) {
      const socketInstance = io("http://localhost:5000", {
        query: { userId: context?.authUser._id },
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      return () => {
        socketInstance.close();
        setSocket(null);
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [context?.authUser]);

  const contextValue = useMemo(() => ({ socket, onlineUsers }), [socket, onlineUsers]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
