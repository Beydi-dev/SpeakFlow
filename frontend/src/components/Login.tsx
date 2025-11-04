import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from './AuthLayout';

export default function Login() {  // ← Corrigé : "Login" au lieu de "SignUp"
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage("");
		setLoading(true);

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			setMessage(error.message);
			setLoading(false);
			return;
		}

		if (data) {
			navigate("/accueil");
			return;
		}

		setLoading(false);
		setEmail("");
		setPassword("");
	};

	return (
		<AuthLayout subtitle="Connectez-vous pour accéder à vos salles de discussion">
			{/* Message d'erreur */}
			{message && (
				<div className="mb-4 p-3 rounded-md text-sm bg-red-100 text-red-700">
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
					type="password"
					placeholder="Votre mot de passe"
					required
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
							Connexion...
						</>
					) : (
						<>
							Se connecter
						</>
					)}
				</button>
			</form>

			{/* Lien vers inscription */}
			<div className="text-center mt-6 text-sm text-gray-600">
				<span>Pas encore de compte ? </span>
				<Link 
					to="/inscription" 
					className="text-gray-800 font-medium hover:underline"
				>
					S'inscrire
				</Link>
			</div>
		</AuthLayout>
	);
}