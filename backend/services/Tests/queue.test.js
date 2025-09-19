"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queueService_1 = require("../queueService");
// Test d'ajout dans la queue
var user1 = {
    sid: 'u1',
    identity: 'Alice',
    room: 'room1',
    joined_at: Date.now(),
    userScore: 10
};
var user2 = {
    sid: 'u2',
    identity: 'Bob',
    room: 'room1',
    joined_at: Date.now(),
    userScore: 5
};
var user3 = {
    sid: 'u3',
    identity: 'Charlie',
    room: 'room2',
    joined_at: Date.now(),
    userScore: 8
};
// Ajout des utilisateurs
console.log('Position Alice:', (0, queueService_1.addToQueue)(user1)); // 1
console.log('Position Bob:', (0, queueService_1.addToQueue)(user2)); // 2
console.log('Position Alice (re-add):', (0, queueService_1.addToQueue)(user1)); // 1, déjà dans la queue
console.log('Position Charlie:', (0, queueService_1.addToQueue)(user3)); // 3
console.log('Queue actuelle:', queueService_1.queue);
