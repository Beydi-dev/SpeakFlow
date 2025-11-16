"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const handlers_1 = require("./socket/handlers");
const rooms_1 = __importDefault(require("./routes/rooms"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Middleware global CORS — toujours avant les routes
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // seule l'origine autorisée peut accéder
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // limite les methodes HTTP acceptées
    credentials: true, // permet l'envoi des cookies ou headers d'authentification
}));
app.use(express_1.default.json()); // important si tu utilises req.body
// Routes après le CORS
app.use('/api/rooms', rooms_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    (0, handlers_1.setupSocketHandlers)(io, socket);
});
httpServer.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
//# sourceMappingURL=server.js.map