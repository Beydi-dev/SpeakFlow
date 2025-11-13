import { useLocalParticipant, useParticipants, RoomAudioRenderer, useRoomContext } from "@livekit/components-react";
import {  useEffect } from "react";
import QueueDisplay from "./QueueDisplay";
import socket from '../services/socket';


type RoomContentProps = {
  room: string;
  onLeave?: () => void
};


function RoomContent({ room, onLeave }: RoomContentProps) {
  const { localParticipant } = useLocalParticipant();
  const livekitRoom = useRoomContext();
  const participants = useParticipants();

function handleLeave() {
	socket.emit("leave_room", { room: room });
	livekitRoom.disconnect();
	onLeave?.();
}


  return (
    <>
      {/* Header bannière */}
      <header className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Gauche : Nom de la salle */}
          <h1 className="text-xl font-semibold text-gray-900">
            Salle : {room}
          </h1>
          
          {/* Centre : Nom d'utilisateur */}
          <p className="text-sm text-gray-400">
            Connecté en tant que <span className="font-medium">{localParticipant?.identity || "..."}</span>
          </p>
          
          {/* Droite : Bouton (vide pour l'instant) */}
          <div className="w-32">
            <button
				onClick={handleLeave}
				className="bg-white border-2 border-gray-400 text-black px-2 py-2 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors"
				>
					Quitter la salle 
			</button>
          </div>
        </div>
      </header>

      {/* Le reste (colonnes) */}
      <div className="flex gap-6 p-6">
        <div className="flex-1">
          <QueueDisplay room={room} />
        </div>
        
        <div className="w-96 bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">👥 Participants</h2>
		  <div>
		  {participants.map((participant) => (
			<div key={participant.identity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
				{participant.identity}
			
			{participant.identity === localParticipant.identity ?
			<span className="text-blue-600 ml-2 justify-items-end">(Vous)</span> 
			: null
			}
			{participant.isMicrophoneEnabled ? "🎤" : "🔇"}

			</div>
		  ))}
		  </div>
        </div>
      </div>

      <RoomAudioRenderer />
    </>
  );
}

export default RoomContent;