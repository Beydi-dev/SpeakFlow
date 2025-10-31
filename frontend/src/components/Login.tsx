import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage("");

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			setMessage(error.message);
			return;
		}

		if (data) {
			navigate("/accueil");
			return;
		}

		setEmail("");
		setPassword("");
	};

	return (
		<div>
			<h2>Connexion</h2>
			<br></br>
			{message && <span>{message}</span>}
			<form onSubmit={handleSubmit}>
				<input
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					type="email"
					placeholder="Email"
					required
				/>
				<input
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					type="password"
					placeholder="password"
					required
				/>
				<button type="submit">Se connecter</button>
			</form>
			<span>Vous n'avez pas compte ? </span>
			<Link to="/inscription">Créer un compte</Link>
		</div>
	);
}