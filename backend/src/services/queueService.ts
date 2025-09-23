// import { ParticipantInfo } from "livekit-server-sdk";
// import * as e from "express";
// import { get } from "http";

/* Fonctions à coder : 
- addToQueue(entry) -> retourne position
- removeFromQueue(sid) -> enlever l'utilisateur de la queue
- getNextInQueue(roomId) -> retourne le prochain utilisateur dans la queue

getQueueForRoom(roomId) -> retourne la queue pour une salle spécifique */
export interface QueueUser {
    sid: string;
    identity: string; // user-specified unique identifier for the participant
    room: string;
    joined_at: number; // timestamp int64
    userScore: number; // Score d'intervention de l'utilisateur
}

// Map pour stocker une queue par room (roomId -> QueueUser[])
export const roomQueues: Map<string, QueueUser[]> = new Map();

// Fonction pour obtenir ou créer une queue pour une room
export function getOrCreateRoomQueue(room: string): QueueUser[] {
    if (!roomQueues.has(room)) {
        roomQueues.set(room, []);
    }
    return roomQueues.get(room)!;
}

// Ajout d'un user dans la queue
export function addToQueue(newUser: QueueUser): number {
    const roomQueue = getOrCreateRoomQueue(newUser.room);
    const exists = roomQueue.find(q => q.sid === newUser.sid); // Check si user est déja dans la queue
    if (exists) {
        console.log('Utilisateur déjà dans la file');
        return roomQueue.indexOf(exists) + 1; // Position dans la queue
    }
    roomQueue.push(newUser);
    return roomQueue.length; // Retourne la position dans la queue
}

// Suppression d'un user dans la queue
export function removeFromQueue(sid: string, room: string): QueueUser | undefined {
    const roomQueue = roomQueues.get(room);
    if (!roomQueue || roomQueue.length === 0) {
        return undefined; // Queue vide ou room inexistante
    }
    const index = roomQueue.findIndex(q => q.sid === sid);
    if (index === -1) {
        return undefined; // User non trouvé
    }
    const removedUser = roomQueue.splice(index, 1)[0];
    return removedUser; // Retourne l'utilisateur supprimé ou undefined si non trouvé
}

// Connaître le prochain à parler
export function getNextInQueue(room: string): QueueUser | undefined {
    const roomQueue = roomQueues.get(room);
    if (!roomQueue || roomQueue.length === 0) {
        return undefined; // Queue vide ou room inexistante
    }
    return roomQueue[0];
}

// retire l'utilisateur qui a fini puis appelle le suivant
export function popFromQueue(room: string): QueueUser | undefined {
    const roomQueue = roomQueues.get(room);
    if (!roomQueue || roomQueue.length === 0) {
        return undefined; // Room inexistante
    }
    return roomQueue.shift(); // Retire et retourne le premier élément ou undefined si vide
}