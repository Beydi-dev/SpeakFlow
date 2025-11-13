import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage("");
		setLoading(true);

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});


		if (error) {
			setMessage(error.message);
			setLoading(false);
			return;
		}

		if (data) {
			setMessage("Compte créé ! Vous pouvez maintenant vous connecter.");
		}

		setLoading(false);
		setEmail("");
		setPassword("");
	};

	return (
		<AuthLayout subtitle="Créez un compte pour accéder aux salles de discussion">
			{/* Message de succès/erreur */}
			{message && (
				<div className={`mb-4 p-3 rounded-md text-sm ${
					message.includes("Compte créé") 
						? "bg-green-100 text-green-700" 
						: "bg-red-100 text-red-700"
				}`}>
					{message}
				</div>
			)}

			{/* Formulaire */}
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					type="email"
					placeholder="Votre email"
					required
					className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
				/>
				<input
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					type="pin"
					placeholder="Votre mot de passe"
					required
					minLength={6}
					className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
				/>
				<button 
					type="submit"
					disabled={loading}
					className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white p-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
				>
					{loading ? (
						<>
							<span className="animate-spin">⏳</span>
							Création...
						</>
					) : (
						<>
							Créer le compte
						</>
					)}
				</button>
			</form>

			{/* Lien vers connexion */}
			<div className="text-center mt-6 text-sm text-gray-600">
				<span>Déjà un compte ? </span>
				<Link 
					to="/connexion" 
					className="text-gray-800 font-medium hover:underline"
				>
					Se connecter
				</Link>
			</div>
		</AuthLayout>
	);
}