import dotenv from 'dotenv';
import { RoomServiceClient } from 'livekit-server-sdk';
import { databaseService } from '../services/databaseService'

dotenv.config();

const roomService = new RoomServiceClient(
	process.env.LIVEKIT_URL!,
	process.env.LIVEKIT_API_KEY!,
	process.env.LIVEKIT_API_SECRET!,
);
