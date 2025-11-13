import 'dotenv/config'
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./socket/handlers";
import roomsRouter from './routes/rooms';

const app = express();
const httpServer = createServer(app);

// Middleware global CORS — toujours avant les routes
app.use(cors({
  origin: "http://localhost:5173", // seule l'origine autorisée peut accéder
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // limite les methodes HTTP acceptées
  credentials: true, // permet l'envoi des cookies ou headers d'authentification
}));

app.use(express.json()); // important si tu utilises req.body

// Routes après le CORS
app.use('/api/rooms', roomsRouter);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  setupSocketHandlers(io, socket);
});

httpServer.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
