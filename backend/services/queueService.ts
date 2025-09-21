// import { ParticipantInfo } from "livekit-server-sdk";


/* Fonctions à coder : 
- addToQueue(entry) -> retourne position

getNextInQueue(roomId) -> retourne le prochain utilisateur dans la queue
*/

export interface QueueUser {
	sid: string;
	identity: string; // user-specified unique identifier for the participant
	room: string;
	joined_at: number; // timestamp int64
	userScore: number; // Score d'intervention de l'utilisateur
}

export let queue: QueueUser[] = []; // FIFO Queue

// Ajout d'un user dans la queue

export function addToQueue(item: QueueUser): number {
	const exists = queue.find(
		(q) => q.sid === item.sid && q.room === item.room
	);
	if (exists) {
		console.log('Utilisateur déja dans la file');
		return queue.indexOf(exists) + 1; // Position dans la queue
	}

	queue.push(item);
	return queue.length; // Position dans la queue
}

// Suppression d'un user dans la queue