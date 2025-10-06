import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import { Room, RoomServiceClient, AccessToken } from 'livekit-server-sdk';
import { databaseService } from '../services/databaseService'

dotenv.config();

const roomService = new RoomServiceClient(
	process.env.LIVEKIT_URL!,
	process.env.LIVEKIT_API_KEY!,
	process.env.LIVEKIT_API_SECRET!,
);

async function createToken (roomName: string, participantName:string) : Promise<string> {
	const at = new AccessToken(
		process.env.LIVEKIT_API_KEY,
		process.env.LIVEKIT_API_SECRET,
		{
			identity: participantName,
			ttl: '10m' // Time To Leave security
		}
	);
	at.addGrant({
		roomJoin:true,
		room:roomName,
		canPublish: true,
		canSubscribe:true,
	});
	
	return await at.toJwt();
}
export const setupSocketHandlers = (io: Server, socket: Socket) => {
    console.log('🔌 Client connecté:', socket.id)
    
    // HANDLERS

	socket.on('join_room', async (data: {room: string, identity: string}) => {
    try {
        console.log('📨 join_room received:', data)
        
        // Étape 1 : Validation des données
        if (!data.room || !data.identity) {
			console.log("Données invalides", data) // pour le backend
			socket.emit('error', {message: 'Room et identité requis'}) // pour le frontend
			return
		}
        // Étape 2 : Générer le token LiveKit
		const token = await createToken(data.room, data.identity)
		console.log('Token généré:',token)
        
		// Étape 3 : Joindre la room Socket.IO
        socket.join(data.room)
        
        // Étape 4 : Répondre à Alice avec le token
        socket.emit('room_joined', {
			token: token,
			room: data.room,
			livekitUrl: process.env.LIVEKIT_URL
	})
        
        // Étape 5 : Informer les autres participants
        socket.to(data.room).emit('participant_joined', {
			identity: data.identity
		})
        console.log(`📢 Informer les autres participants de ${data.room}`)

    } catch (error) {
        console.error('❌ Error:', error)
        socket.emit('error', { message: 'Erreur lors de la connexion' })
    }
})
}