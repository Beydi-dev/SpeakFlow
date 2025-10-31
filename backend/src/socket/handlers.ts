import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import { Room, RoomServiceClient, AccessToken } from "livekit-server-sdk";
import { databaseService } from "../services/databaseService";
import {
  QueueUser,
  addToQueue,
  getOrCreateRoomQueue,
  removeFromQueue,
  popFromQueue,
  getNextInQueue,
} from "../services/queueService";

dotenv.config();

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

async function createToken(
  roomName: string,
  participantName: string,
): Promise<string> {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      ttl: "10m", // Time To Leave security
    },
  );
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt();
}
export const setupSocketHandlers = (io: Server, socket: Socket) => {
  console.log("🔌 Client connecté:", socket.id);

  // HANDLERS
  socket.on("join_room", async (data: { room: string; identity: string }) => {
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
    } catch (error) {
      console.error("❌ Error:", error);
      socket.emit("error", { message: "Erreur lors de la connexion" });
    }
  });

  // Demande de parole
  socket.on("request_speak", (data: { room: string; identity: string }) => {
    console.log("📢 request_speak reçu:", data);
    if (!data.room || !data.identity) {
      console.log("error");
      socket.emit("error", { message: "Room et identité requis" });
      return;
    }
    const newUser: QueueUser = {
      socketId: socket.id,
      identity: data.identity,
      room: data.room,
      joined_at: Date.now(),
      userScore: 0,
    };
    addToQueue(newUser);

    // Récupérer le tableau complet
    const roomQueue = getOrCreateRoomQueue(data.room);
    // Transformer ce tableau
    const identities = roomQueue.map((user) => user.identity);

    const nextSpeaker = getNextInQueue(data.room);

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
  socket.on("cancel_request", (data: { room: string }) => {
    console.log("📢 cancel_request reçu:", data);
    if (!data.room) {
      console.log("error");
      return;
    }
    removeFromQueue(socket.id, data.room);

    const roomQueue = getOrCreateRoomQueue(data.room);
    const identities = roomQueue.map((user) => user.identity);

    if (identities.length === 1)
      io.to(data.room).emit("queue_update", { queue: identities });
    console.log("📋 File mise à jour:", identities);
  });

  // fin de parole utilisateur
  socket.on("end_speak", (data: { room: string }) => {
    console.log("📢 end_speak reçu:", data);
    if (!data.room) {
      console.log("error");
      return;
    }
    // Retirer le premier élément
    popFromQueue(data.room);

    // Récupérer le suivant
    const nextSpeaker = getNextInQueue(data.room);

    if (nextSpeaker) {
      io.to(data.room).emit("grant_speak", {
        identity: nextSpeaker.identity,
      });
    }

    // Mettre à jour la file pour tout le monde
    const roomQueue = getOrCreateRoomQueue(data.room);
    const identities = roomQueue.map((user) => user.identity);

    io.to(data.room).emit("queue_update", { queue: identities });
    console.log("📋 File mise à jour:", identities);
  });


  // Quitter la salle
  socket.on("leave_room", (data: { room: string }) => {
	console.log("📢 cancel_request reçu:", data);
    if (!data.room) {
      console.log("error");
      return;
    }
    removeFromQueue(socket.id, data.room);

    const roomQueue = getOrCreateRoomQueue(data.room);
    const identities = roomQueue.map((user) => user.identity);

    if (identities.length === 1)
      io.to(data.room).emit("queue_update", { queue: identities });
    console.log("📋 File mise à jour:", identities);
  });
};
