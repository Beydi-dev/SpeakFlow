import { useLocalParticipant } from "@livekit/components-react";
import { RoomAudioRenderer } from "@livekit/components-react";
import QueueDisplay from "./QueueDisplay";

type RoomContentProps = {
  room: string;
};

function RoomContent({ room }: RoomContentProps) {
  const { localParticipant } = useLocalParticipant();

  return (
    <>
      {/* Header bannière */}
      <header className="bg-gray-200 border-b border-gray-300 px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Gauche : Nom de la salle */}
          <h1 className="text-xl font-semibold text-gray-900">
            Salle : {room}
          </h1>
          
          {/* Centre : Nom d'utilisateur */}
          <p className="text-sm text-gray-700">
            Connecté en tant que <span className="font-medium">{localParticipant?.identity || "..."}</span>
          </p>
          
          {/* Droite : Bouton (vide pour l'instant) */}
          <div className="w-32">
            {/* Bouton "Quitter" ici plus tard */}
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
          <p className="text-gray-500">Liste à venir...</p>
        </div>
      </div>

      <RoomAudioRenderer />
    </>
  );
}

export default RoomContent;