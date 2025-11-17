// src/tests/queue.test.ts
import {
  QueueUser,
  roomQueues,
  getOrCreateRoomQueue,
  addToQueue,
  removeFromQueue,
  getNextInQueue,
  popFromQueue
} from '../services/queueService'; // Adapte le chemin selon ta structure

describe('SpeakFlow Queue Management', () => {
  // Nettoyer les queues avant chaque test
  beforeEach(() => {
    roomQueues.clear();
  });

  // Helper pour créer un utilisateur de test
  const createMockUser = (socketId: string, identity: string, room: string, userScore: number = 0): QueueUser => ({
    socketId,
    identity,
    room,
    joined_at: Date.now(),
    userScore
  });

  describe('getOrCreateRoomQueue', () => {
    test('should create new queue for new room', () => {
      const queue = getOrCreateRoomQueue('room123');
      
      expect(queue).toEqual([]);
      expect(roomQueues.has('room123')).toBe(true);
    });

    test('should return existing queue for existing room', () => {
      const firstCall = getOrCreateRoomQueue('room123');
      const secondCall = getOrCreateRoomQueue('room123');
      
      expect(firstCall).toBe(secondCall); // Même référence
      expect(roomQueues.size).toBe(1);
    });
  });

  describe('addToQueue', () => {
    test('should add user to empty queue and return position 1', () => {
      const user = createMockUser('socket1', 'alice', 'room123');
      
      const position = addToQueue(user);
      
      expect(position).toBe(1);
      expect(roomQueues.get('room123')).toHaveLength(1);
      expect(roomQueues.get('room123')![0]).toEqual(user);
    });

    test('should add multiple users in FIFO order', () => {
      const user1 = createMockUser('socket1', 'alice', 'room123');
      const user2 = createMockUser('socket2', 'bob', 'room123');
      const user3 = createMockUser('socket3', 'charlie', 'room123');
      
      const pos1 = addToQueue(user1);
      const pos2 = addToQueue(user2);
      const pos3 = addToQueue(user3);
      
      expect(pos1).toBe(1);
      expect(pos2).toBe(2);
      expect(pos3).toBe(3);
      
      const queue = roomQueues.get('room123')!;
      expect(queue[0].identity).toBe('alice');
      expect(queue[1].identity).toBe('bob');
      expect(queue[2].identity).toBe('charlie');
    });

    test('should not add duplicate user and return existing position', () => {
      const user = createMockUser('socket1', 'alice', 'room123');
      
      const firstAdd = addToQueue(user);
      const secondAdd = addToQueue(user);
      
      expect(firstAdd).toBe(1);
      expect(secondAdd).toBe(1); // Même position
      expect(roomQueues.get('room123')).toHaveLength(1);
    });

    test('should handle different rooms independently', () => {
      const userRoom1 = createMockUser('socket1', 'alice', 'room123');
      const userRoom2 = createMockUser('socket2', 'bob', 'room456');
      
      addToQueue(userRoom1);
      addToQueue(userRoom2);
      
      expect(roomQueues.get('room123')).toHaveLength(1);
      expect(roomQueues.get('room456')).toHaveLength(1);
      expect(roomQueues.size).toBe(2);
    });
  });

  describe('removeFromQueue', () => {
    test('should remove user from queue and return removed user', () => {
      const user1 = createMockUser('socket1', 'alice', 'room123');
      const user2 = createMockUser('socket2', 'bob', 'room123');
      
      addToQueue(user1);
      addToQueue(user2);
      
      const removed = removeFromQueue('socket1', 'room123');
      
      expect(removed).toEqual(user1);
      expect(roomQueues.get('room123')).toHaveLength(1);
      expect(roomQueues.get('room123')![0]).toEqual(user2);
    });

    test('should return undefined for non-existent user', () => {
      const user = createMockUser('socket1', 'alice', 'room123');
      addToQueue(user);
      
      const removed = removeFromQueue('socket999', 'room123');
      
      expect(removed).toBeUndefined();
      expect(roomQueues.get('room123')).toHaveLength(1);
    });

    test('should return undefined for non-existent room', () => {
      const removed = removeFromQueue('socket1', 'room999');
      
      expect(removed).toBeUndefined();
    });

    test('should return undefined for empty queue', () => {
      getOrCreateRoomQueue('room123'); // Crée une queue vide
      
      const removed = removeFromQueue('socket1', 'room123');
      
      expect(removed).toBeUndefined();
    });

    test('should maintain queue order after removal from middle', () => {
      const user1 = createMockUser('socket1', 'alice', 'room123');
      const user2 = createMockUser('socket2', 'bob', 'room123');
      const user3 = createMockUser('socket3', 'charlie', 'room123');
      
      addToQueue(user1);
      addToQueue(user2);
      addToQueue(user3);
      
      removeFromQueue('socket2', 'room123'); // Enlever bob du milieu
      
      const queue = roomQueues.get('room123')!;
      expect(queue).toHaveLength(2);
      expect(queue[0].identity).toBe('alice');
      expect(queue[1].identity).toBe('charlie');
    });
  });

  describe('getNextInQueue', () => {
    test('should return first user in queue', () => {
      const user1 = createMockUser('socket1', 'alice', 'room123');
      const user2 = createMockUser('socket2', 'bob', 'room123');
      
      addToQueue(user1);
      addToQueue(user2);
      
      const next = getNextInQueue('room123');
      
      expect(next).toEqual(user1);
    });

    test('should return undefined for empty queue', () => {
      const next = getNextInQueue('room123');
      
      expect(next).toBeUndefined();
    });

    test('should return undefined for non-existent room', () => {
      const next = getNextInQueue('room999');
      
      expect(next).toBeUndefined();
    });

    test('should not modify the queue when getting next user', () => {
      const user1 = createMockUser('socket1', 'alice', 'room123');
      const user2 = createMockUser('socket2', 'bob', 'room123');
      
      addToQueue(user1);
      addToQueue(user2);
      
      getNextInQueue('room123');
      
      expect(roomQueues.get('room123')).toHaveLength(2); // Queue inchangée
    });
  });

  describe('popFromQueue', () => {
    test('should remove and return first user from queue', () => {
      const user1 = createMockUser('socket1', 'alice', 'room123');
      const user2 = createMockUser('socket2', 'bob', 'room123');
      
      addToQueue(user1);
      addToQueue(user2);
      
      const popped = popFromQueue('room123');
      
      expect(popped).toEqual(user1);
      expect(roomQueues.get('room123')).toHaveLength(1);
      expect(roomQueues.get('room123')![0]).toEqual(user2);
    });

    test('should return undefined for empty queue', () => {
      const popped = popFromQueue('room123');
      
      expect(popped).toBeUndefined();
    });

    test('should return undefined for non-existent room', () => {
      const popped = popFromQueue('room999');
      
      expect(popped).toBeUndefined();
    });

    test('should handle sequential pops correctly', () => {
      const user1 = createMockUser('socket1', 'alice', 'room123');
      const user2 = createMockUser('socket2', 'bob', 'room123');
      const user3 = createMockUser('socket3', 'charlie', 'room123');
      
      addToQueue(user1);
      addToQueue(user2);
      addToQueue(user3);
      
      const first = popFromQueue('room123');
      const second = popFromQueue('room123');
      const third = popFromQueue('room123');
      const fourth = popFromQueue('room123');
      
      expect(first?.identity).toBe('alice');
      expect(second?.identity).toBe('bob');
      expect(third?.identity).toBe('charlie');
      expect(fourth).toBeUndefined();
      expect(roomQueues.get('room123')).toHaveLength(0);
    });
  });

  describe('Integration scenarios', () => {
    test('complete workflow: add users, grant speak, finish speak', () => {
      const alice = createMockUser('socket1', 'alice', 'room123');
      const bob = createMockUser('socket2', 'bob', 'room123');
      const charlie = createMockUser('socket3', 'charlie', 'room123');
      
      // Tous demandent la parole
      addToQueue(alice);
      addToQueue(bob);
      addToQueue(charlie);
      
      // Alice parle en premier
      let currentSpeaker = getNextInQueue('room123');
      expect(currentSpeaker?.identity).toBe('alice');
      
      // Alice termine, on passe à Bob
      let finished = popFromQueue('room123');
      expect(finished?.identity).toBe('alice');
      
      currentSpeaker = getNextInQueue('room123');
      expect(currentSpeaker?.identity).toBe('bob');
      
      // Bob termine, on passe à Charlie
      finished = popFromQueue('room123');
      expect(finished?.identity).toBe('bob');
      
      currentSpeaker = getNextInQueue('room123');
      expect(currentSpeaker?.identity).toBe('charlie');
      
      // Charlie termine, queue vide
      finished = popFromQueue('room123');
      expect(finished?.identity).toBe('charlie');
      
      currentSpeaker = getNextInQueue('room123');
      expect(currentSpeaker).toBeUndefined();
    });

    test('user leaves room while in queue', () => {
      const alice = createMockUser('socket1', 'alice', 'room123');
      const bob = createMockUser('socket2', 'bob', 'room123');
      const charlie = createMockUser('socket3', 'charlie', 'room123');
      
      addToQueue(alice);
      addToQueue(bob);
      addToQueue(charlie);
      
      // Bob quitte la salle
      removeFromQueue('socket2', 'room123');
      
      // Alice parle puis termine
      popFromQueue('room123');
      
      // Le suivant devrait être Charlie (Bob a été retiré)
      const nextSpeaker = getNextInQueue('room123');
      expect(nextSpeaker?.identity).toBe('charlie');
    });

    test('multiple rooms operate independently', () => {
      const aliceRoom1 = createMockUser('socket1', 'alice', 'room123');
      const bobRoom2 = createMockUser('socket2', 'bob', 'room456');
      
      addToQueue(aliceRoom1);
      addToQueue(bobRoom2);
      
      expect(getNextInQueue('room123')?.identity).toBe('alice');
      expect(getNextInQueue('room456')?.identity).toBe('bob');
      
      // Supprimer alice ne devrait pas affecter room456
      popFromQueue('room123');
      expect(getNextInQueue('room456')?.identity).toBe('bob');
    });
  });
});