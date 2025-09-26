import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5174", // Autoriser le frontend
		methods: ["GET", "POST"]
	}
});

io.on("connection", (socket) => {
	console.log('🔌 Client connecté:', socket.id)

	// ÉCOUTER l'event ping du frontend
	socket.on('ping', (data) => {
		console.log('📨 Reçu ping:', data)

		// RÉPONDRE au frontend
		socket.emit('pong', { 
			message: `Pong ! Tu as dit: "${data.message}"`,
			timestamp: new Date().toLocaleTimeString(),
			socketId: socket.id
		})
	})

	// Quand le client se déconnecte
	socket.on('disconnect', () => {
		console.log('❌ Client déconnecté:', socket.id)
	})
})

httpServer.listen(3000, () => {
	console.log('🚀 Server running on http://localhost:3000');
});