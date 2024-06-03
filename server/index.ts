import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';  // Import the http module
import { Server } from 'socket.io';  // Import socket.io
import authRoutes from './routes/auth.routes';
import connectToMongoDb from './db/connect';
import messageRoutes from './routes/message.routes';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';
import { app, server } from "./socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Create an HTTP server
const httpServer = createServer(app);

// Initialize socket.io with the HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

interface UserSocketMap {
    [key: string]: string;
}

const userSockedMap: UserSocketMap = {}

// Socket.io connection setup
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.query.userId as string;
    if (userId !== 'undefined') userSockedMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSockedMap));

    socket.on('disconnect', () => {
        delete userSockedMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSockedMap));
        console.log(`User disconnected: ${socket.id}`);
    });

    // Listen for messages and emit to all connected clients
    socket.on('message', (message) => {
        io.emit('message', message);
    });
});

server.listen(PORT, () => {
    connectToMongoDb();
    console.log(`Server is running on PORT: ${PORT}`);
});
