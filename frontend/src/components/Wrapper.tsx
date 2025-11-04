import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";

export default function Wrapper({ children }: { children: React.ReactNode }) {
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setloading] = useState(true);

	useEffect(() => {
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setAuthenticated(!!session);
			setloading(false);
		};

		getSession();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	} else {
		if (authenticated) {
			return <>{children}</>;
		}
		return <Navigate to="/connexion" />;
	}
}
