import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:5055';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            autoConnect: true,
            transports: ['websocket']
        });

        newSocket.on("connect", () => {
            console.log("Connected to Global Matrix:", newSocket.id);
            if (user) {
                newSocket.emit("authenticate", { userId: user.id, name: user.fullName });
            }
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
