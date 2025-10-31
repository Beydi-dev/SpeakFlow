import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage("");

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			setMessage(error.message);
			return;
		}

		if (data) {
			setMessage("compte crée!")
		}

		setEmail("");
		setPassword("");
	};

	return (
		<div>
			<h2>Inscription</h2>
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
				<button type="submit">Créer un compte</button>
			</form>
			<span>Vous avez déja un compte ? </span>
			<Link to="/connexion">Connexion</Link>
		</div>
	);
}

