export interface QueueUser {
    socketId: string;
    identity: string;
    room: string;
    joined_at: number;
    userScore: number;
}
export declare const roomQueues: Map<string, QueueUser[]>;
export declare function getOrCreateRoomQueue(room: string): QueueUser[];
export declare function addToQueue(newUser: QueueUser): number;
export declare function removeFromQueue(socketId: string, room: string): QueueUser | undefined;
export declare function getNextInQueue(room: string): QueueUser | undefined;
export declare function popFromQueue(room: string): QueueUser | undefined;
//# sourceMappingURL=queueService.d.ts.map