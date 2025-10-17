import { useState, useEffect } from "react";
import socket from '../services/socket';
import { useLocalParticipant } from "@livekit/components-react";

type QueueDisplayProps = {
	room: string;
};

function QueueDisplay({ room }: QueueDisplayProps) {
	const { localParticipant } = useLocalParticipant();
	const [queue, setQueue] = useState<string[]>([]); // tableau vide de strings au départ

	function handleRequestSpeak() {
		socket.emit('request_speak', {
			room: room,
			identity: localParticipant.identity
		});
	}
	
	function handleCancelSpeak() {
		socket.emit('cancel_request', {
			room: room
		});
	}

	useEffect(() => {
			socket.on('queue_update', (data) => {
				setQueue(data.queue); // Met à jour le state queue
				console.log(data); // Pour voir ce qui arrive
			});

			return () => {
				socket.off('queue_update'); // Arrête d'écouter
			}
		}, []);

	return (
    <div className="max-w-2xl mx-auto space-y-4">
      
      {/* Carte 1 : Header avec titre et compteur */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            👥 File d'attente de parole
          </h2>
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            {queue.length} en attente
          </span>
        </div>
      </div>
      
      {/* Carte 2 : Bouton Demander OU Votre position */}
      {!queue.includes(localParticipant.identity) ? (
        // Si PAS dans la file → Bouton Demander
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <button 
            onClick={handleRequestSpeak}
            className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            ✋ Demander la parole
          </button>
        </div>
      ) : (
        // Si dans la file → Bouton Annuler (ROUGE)
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <button 
        onClick={handleCancelSpeak}  // ← Ta fonction
        className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"  // ← Rouge !
      >
        ❌ Annuler ma demande
      </button>
    </div>
)}
      
      {/* Carte 3 : Ordre de passage */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="font-semibold text-gray-700 mb-4">
          Ordre de passage (FIFO)
        </h3>
        
        {queue.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Aucune demande en attente
          </p>
        ) : (
          <div className="space-y-3">
            {queue.map((identity, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  identity === localParticipant.identity 
                    ? 'bg-blue-50 border-2 border-blue-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-300 font-bold text-gray-700">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-gray-900">
                    {identity}
                    {identity === localParticipant.identity && (
                      <span className="ml-2 text-blue-600 text-sm font-semibold">(Vous)</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}

export default QueueDisplay;
