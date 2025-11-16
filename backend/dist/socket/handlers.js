"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const livekit_server_sdk_1 = require("livekit-server-sdk");
const queueService_1 = require("../services/queueService");
dotenv_1.default.config();
const roomService = new livekit_server_sdk_1.RoomServiceClient(process.env.LIVEKIT_URL, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);
async function createToken(roomName, participantName) {
    const at = new livekit_server_sdk_1.AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity: participantName,
        ttl: "10m", // Time To Leave security
    });
    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
    });
    return await at.toJwt();
}
const setupSocketHandlers = (io, socket) => {
    console.log("🔌 Client connecté:", socket.id);
    // HANDLERS
    socket.on("join_room", async (data) => {
        try {
            console.log("📨 join_room received:", data);
            // Étape 1 : Validation des données
            if (!data.room || !data.identity) {
                console.log("Données invalides", data); // pour le backend
                socket.emit("error", { message: "Room et identité requis" }); // pour le frontend
                return;
            }
            // Étape 2 : Générer le token LiveKit
            const token = await createToken(data.room, data.identity);
            console.log("Token généré:", token);
            // Étape 3 : Joindre la room Socket.IO
            socket.join(data.room);
            // Étape 4 : Répondre à Alice avec le token
            socket.emit("room_joined", {
                token: token,
                room: data.room,
                livekitUrl: process.env.LIVEKIT_URL,
            });
            // Étape 5 : Informer les autres participants
            socket.to(data.room).emit("participant_joined", {
                identity: data.identity,
            });
            console.log(`📢 Informer les autres participants de ${data.room}`);
        }
        catch (error) {
            console.error("❌ Error:", error);
            socket.emit("error", { message: "Erreur lors de la connexion" });
        }
    });
    // Demande de parole
    socket.on("request_speak", (data) => {
        console.log("📢 request_speak reçu:", data);
        if (!data.room || !data.identity) {
            console.log("error");
            socket.emit("error", { message: "Room et identité requis" });
            return;
        }
        const newUser = {
            socketId: socket.id,
            identity: data.identity,
            room: data.room,
            joined_at: Date.now(),
            userScore: 0,
        };
        (0, queueService_1.addToQueue)(newUser);
        // Récupérer le tableau complet
        const roomQueue = (0, queueService_1.getOrCreateRoomQueue)(data.room);
        // Transformer ce tableau
        const identities = roomQueue.map((user) => user.identity);
        const nextSpeaker = (0, queueService_1.getNextInQueue)(data.room);
        if (nextSpeaker) {
            io.to(nextSpeaker.socketId).emit("grant_speak", {
                identity: nextSpeaker.identity,
            });
            console.log("✅ grant_speak émis vers:", nextSpeaker.identity);
        }
        io.to(data.room).emit("queue_update", { queue: identities });
        console.log("📋 File mise à jour:", identities);
    });
    // Annulation demande de parole
    socket.on("cancel_request", (data) => {
        console.log("📢 cancel_request reçu:", data);
        if (!data.room) {
            console.log("error");
            return;
        }
        (0, queueService_1.removeFromQueue)(socket.id, data.room);
        const roomQueue = (0, queueService_1.getOrCreateRoomQueue)(data.room);
        const identities = roomQueue.map((user) => user.identity);
        if (identities.length === 1)
            io.to(data.room).emit("queue_update", { queue: identities });
        console.log("📋 File mise à jour:", identities);
    });
    // fin de parole utilisateur
    socket.on("end_speak", (data) => {
        console.log("📢 end_speak reçu:", data);
        if (!data.room) {
            console.log("error");
            return;
        }
        // Retirer le premier élément
        (0, queueService_1.popFromQueue)(data.room);
        // Récupérer le suivant
        const nextSpeaker = (0, queueService_1.getNextInQueue)(data.room);
        if (nextSpeaker) {
            io.to(data.room).emit("grant_speak", {
                identity: nextSpeaker.identity,
            });
        }
        // Mettre à jour la file pour tout le monde
        const roomQueue = (0, queueService_1.getOrCreateRoomQueue)(data.room);
        const identities = roomQueue.map((user) => user.identity);
        io.to(data.room).emit("queue_update", { queue: identities });
        console.log("📋 File mise à jour:", identities);
    });
    // Quitter la salle
    socket.on("leave_room", (data) => {
        console.log("📢 cancel_request reçu:", data);
        if (!data.room) {
            console.log("error");
            return;
        }
        (0, queueService_1.removeFromQueue)(socket.id, data.room);
        const roomQueue = (0, queueService_1.getOrCreateRoomQueue)(data.room);
        const identities = roomQueue.map((user) => user.identity);
        if (identities.length === 1)
            io.to(data.room).emit("queue_update", { queue: identities });
        console.log("📋 File mise à jour:", identities);
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
//# sourceMappingURL=handlers.js.map