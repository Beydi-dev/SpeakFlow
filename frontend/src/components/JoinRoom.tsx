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

	// États
	const [roomName, setRoomName] = useState("");
	const [identity, setIdentity] = useState("");
	const [password, setPassword] = useState("");
	const [salles, setSalles] = useState<{ nom: any }[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State pour ouvrir/fermer le popup
	const [showModal, setShowModal] = useState(false);

	//
	useEffect(() => {
		const fetchSalles = async () => {
			const { data, error } = await supabase.from('salle').select('*');

			if (error) {
				setError('Could not fetch the salles');
				setSalles(null);
				console.log(error);
			}
			if (data) {
				setSalles(data);
				setError(null);
			}
			setLoading(false);
		};

		fetchSalles();
	}, []);

	//
	useEffect(() => {
		socket.on("room_joined", (data) => {
			onJoinSuccess(data.token, data.room, data.livekitUrl);
		});

		return () => {
			socket.off("room_joined");
		};
	}, [onJoinSuccess]);

	// 
	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		socket.emit("join_room", {
			room: roomName,
			identity: identity,
		});

		setShowModal(false);
	}

	return (
		<div>
			{/* Header */}
			<header className="bg-slate-200 border-b border-gray-300 px-6 py-4">
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-semibold text-gray-900">SpeakFlow</h1>
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

			{/* Bouton pour ouvrir le popup */}
			<button 
				onClick={() => setShowModal(true)}
				className="m-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
			>
				Créer / Rejoindre une salle
			</button>

			{/* POPUP avec le CSS */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full relative">
						{/* Bouton fermer (X) */}
						<button
							onClick={() => setShowModal(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
						>
							×
						</button>

						{/* Titre */}
						<h2 className="text-xl font-semibold mb-2">Rejoindre une salle</h2>
						<p className="text-sm text-gray-600 mb-6">
							Donnez un nom à votre salle et définissez un mot de passe pour sécuriser l'accès.
						</p>

						{/* Formulaire */}
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Nom de la salle
								</label>
								<input
									type="text"
									placeholder="ex: Réunion équipe"
									value={roomName}
									onChange={(e) => setRoomName(e.target.value)}
									required
									minLength={1}
									autoComplete="off"
									className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Votre identité
								</label>
								<input
									type="text"
									placeholder="nom"
									value={identity}
									onChange={(e) => setIdentity(e.target.value)}
									required
									minLength={1}
									autoComplete="off"
									className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Mot de passe
								</label>
								<input
									type="pin"
									placeholder="mot de passe de la salle"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									minLength={4}
									autoComplete="off"
									className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
								/>
							</div>

							<button
								type="submit"
								className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
							>
								Rejoindre
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default JoinRoom;