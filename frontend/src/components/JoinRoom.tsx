import { useState, useEffect } from "react";
import React from "react";
import socket from "../services/socket";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

type JoinRoomProps = {
  onJoinSuccess: (token: string, room: string, livekitUrl: string) => void;
};

function JoinRoom({ onJoinSuccess }: JoinRoomProps) {
  
	const navigate = useNavigate();

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		navigate("/connexion");
	};
	
	// On créé d'abord les états
  const [roomName, setRoomName] = useState("");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    socket.on("room_joined", (data) => {
      onJoinSuccess(data.token, data.room, data.livekitUrl);
    });

    // Fonction de nettoyage
    return () => {
      socket.off("room_joined"); // ← Retire le listener
    };
  }, [onJoinSuccess]); /* Dépendance : se relance si onJoinSuccess change
                        Toute variable/prop utilisée dans useEffect doit être ici
					 */

  function handleSubmit(e: React.FormEvent) {
    // Prendre en charge comportement par défaut du formulaire
    e.preventDefault(); // Empêche rechargement de page
    socket.emit("join_room", {
      room: roomName,
      identity: identity,
    });
    // Amélioration : gérer roomName et identity vides
  }

  // Code html ici
  return (
    <form onSubmit={handleSubmit}>
		<header className="bg-white border-b border-gray-300 px-6 py-4">
			<div className="flex justify-between items-center">
				<h1 className="text-xl font-semibold text-gray-900">Rejoindre une salle</h1>
				
				<div className="w-32 flex">
					<button
					onClick={signOut}
					className="whitespace-nowrap bg-white border-2 border-gray-400 text-black px-2 py-2 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors"
					>
						Se déconnecter 
						</button>
				</div>
			</div>
		</header>
      <input
        type="text"
        id="roomName"
        placeholder="nom de la salle"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        required
        minLength={1}
      />

      <input
        type="text"
        id="userId"
        placeholder="identité"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
        required
        minLength={1}
      />
	  
	  <input
        type="roomPin"
        id="rommPassword"
        placeholder="mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={4}
      />

      <button>Rejoindre</button>
    </form>
  );
}

export default JoinRoom;
