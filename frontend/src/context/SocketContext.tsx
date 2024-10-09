import { createContext, ReactNode, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { environment } from "../environments/environment";

interface SocketContextType {
  socket: any;
}

const socket = io(environment.api, { autoConnect: false }); // Cria a instância do socket

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket deve ser usado dentro de um SocketProvider");
  }
  return context;
};
