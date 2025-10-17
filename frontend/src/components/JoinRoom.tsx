import { useState, useEffect } from 'react';
import socket from '../services/socket';

type JoinRoomProps = {
	onJoinSuccess: (token: string, room: string, livekitUrl: string) => void;
};

function JoinRoom({ onJoinSuccess }: JoinRoomProps) {
	// On créé d'abord les états
	const [roomName, setRoomName] = useState('');
	const [identity, setIdentity] = useState('');

	useEffect(() => {
		socket.on('room_joined', (data) => {
			onJoinSuccess(data.token, data.room, data.livekitUrl)
		});

		 // Fonction de nettoyage
    return () => {
        socket.off('room_joined');  // ← Retire le listener
	};
}, [onJoinSuccess]); /* Dépendance : se relance si onJoinSuccess change
                        Toute variable/prop utilisée dans useEffect doit être ici
					 */

	function handleSubmit(e: React.FormEvent) { // Prendre en charge comportement par défaut du formulaire
		e.preventDefault(); // Empêche rechargement de page
		socket.emit('join_room', {
			room: roomName,
			identity: identity
		});
		// Amélioration : gérer roomName et identity vides
	}


		// Code html ici
	return (
		<form onSubmit={handleSubmit}>
			<h1>Rejoindre une salle</h1>
			<input
			type="text"
			id='roomName'
			placeholder='Nom de la salle'
			value={roomName}
			onChange={(e) => setRoomName(e.target.value)}
			required
			minLength={1}/>

			<input
			type="text"
			id='userId'
			placeholder='identité'
			value={identity}
			onChange={(e) => setIdentity(e.target.value)}
			required
			minLength={1}/>

			<button>
				Rejoindre
			</button>
		</form>
	);
}

export default JoinRoom;