import express from 'express';
import { createServer } from 'http';
import {Server} from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173", // Autoriser le frontend
		methods: ["GET", "POST"]
	}
});

io.on("connection", (socket) => {

});

httpServer.listen(3000, () => {
	console.log('🚀 Server running on http://localhost:3000');
});
