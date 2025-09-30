import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { setupSocketHandlers } from './socket/handlers';  // ← AJOUTER

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"]
	}
});

io.on("connection", (socket) => {
	setupSocketHandlers(io, socket);
});

httpServer.listen(3000, () => {
	console.log('🚀 Server running on http://localhost:3000');
});