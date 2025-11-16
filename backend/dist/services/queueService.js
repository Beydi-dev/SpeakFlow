"use strict";
// import { ParticipantInfo } from "livekit-server-sdk";
// import * as e from "express";
// import { get } from "http";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomQueues = void 0;
exports.getOrCreateRoomQueue = getOrCreateRoomQueue;
exports.addToQueue = addToQueue;
exports.removeFromQueue = removeFromQueue;
exports.getNextInQueue = getNextInQueue;
exports.popFromQueue = popFromQueue;
// Map pour stocker une queue par room (roomId -> QueueUser[])
exports.roomQueues = new Map();
// Fonction pour obtenir ou créer une queue pour une room
function getOrCreateRoomQueue(room) {
    if (!exports.roomQueues.has(room)) {
        exports.roomQueues.set(room, []);
    }
    return exports.roomQueues.get(room);
}
// Ajout d'un user dans la queue
function addToQueue(newUser) {
    const roomQueue = getOrCreateRoomQueue(newUser.room);
    const exists = roomQueue.find((q) => q.socketId === newUser.socketId); // Check si user est déja dans la queue
    if (exists) {
        console.log("Utilisateur déjà dans la file");
        return roomQueue.indexOf(exists) + 1; // Position réelle dans la queue
    }
    roomQueue.push(newUser);
    return roomQueue.length; // Retourne la position dans la queue
}
// Suppression d'un user dans la queue
function removeFromQueue(socketId, room) {
    const roomQueue = exports.roomQueues.get(room);
    if (!roomQueue || roomQueue.length === 0) {
        return undefined; // Queue vide ou room inexistante
    }
    const index = roomQueue.findIndex((q) => q.socketId === socketId);
    if (index === -1) {
        return undefined; // User non trouvé
    }
    const removedUser = roomQueue.splice(index, 1)[0];
    return removedUser; // Retourne l'utilisateur supprimé ou undefined si non trouvé
}
// Connaître le prochain à parler
function getNextInQueue(room) {
    const roomQueue = exports.roomQueues.get(room);
    if (!roomQueue || roomQueue.length === 0) {
        return undefined; // Queue vide ou room inexistante
    }
    return roomQueue[0];
}
// retire l'utilisateur qui a fini puis appelle le suivant
function popFromQueue(room) {
    const roomQueue = exports.roomQueues.get(room);
    if (!roomQueue || roomQueue.length === 0) {
        return undefined; // Room inexistante
    }
    return roomQueue.shift(); // Retire et retourne le premier élément ou undefined si vide
}
//# sourceMappingURL=queueService.js.map