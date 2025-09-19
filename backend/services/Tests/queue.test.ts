import { addToQueue, queue } from '../queueService';
 import type {QueueUser} from '../queueService';

// Test d'ajout dans la queue
const user1: QueueUser = {
  sid: 'u1',
  identity: 'Alice',
  room: 'room1',
  joined_at: Date.now(),
  userScore: 10
};

const user2: QueueUser = {
  sid: 'u2',
  identity: 'Bob',
  room: 'room1',
  joined_at: Date.now(),
  userScore: 5
};

const user3: QueueUser = {
  sid: 'u3',
  identity: 'Charlie',
  room: 'room2',
  joined_at: Date.now(),
  userScore: 8
};

// Ajout des utilisateurs
console.log('Position Alice:', addToQueue(user1)); // 1
console.log('Position Bob:', addToQueue(user2));   // 2
console.log('Position Alice (re-add):', addToQueue(user1)); // 1, déjà dans la queue
console.log('Position Charlie:', addToQueue(user3)); // 3

console.log('Queue actuelle:', queue);
