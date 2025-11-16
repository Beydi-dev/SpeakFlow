import { useState, useEffect } from "react";
import JoinRoom from "./components/JoinRoom";
import Room from "./components/Room";
import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import Wrapper from "./components/Wrapper";


function App() {
	// On créé d'abord les états
	const [isConnected, setIsConnected] = useState(false);
	const [token, setToken] = useState("");
	const [roomName, setRoomName] = useState("");
	const [livekitUrl, setLiveKitUrl] = useState("");

	function handleJoinSuccess(token: string, room: string, livekitUrl: string) {
		setIsConnected(true);
		setToken(token);
		setRoomName(room);
		setLiveKitUrl(livekitUrl);
	}

	function handleLeaveRoom(): void {
		setIsConnected(false);
		setToken("");
		setRoomName("");
		setLiveKitUrl("");
	}

	return (
		<BrowserRouter>
			<Routes>

				<Route path="/" element={<Navigate to="/connexion" />} />


				{/* login */}
				<Route path="/connexion" element={<Login />} />

				{/* signup */}
				<Route path="/inscription" element={<SignUp />} />

				<Route
					path="/accueil"
					element={
						<Wrapper>
							{roomName ? (
								<Room
									token={token}
									room={roomName}
									livekitUrl={livekitUrl}
									onLeave={handleLeaveRoom}
								/>
							) : (
								<JoinRoom
									onJoinSuccess={handleJoinSuccess}
								/>
							)}
						</Wrapper>
					}
				/>

		</Routes>

		</BrowserRouter >
	)
}

export default App;


/*

<div>
	  {isConnected ? (
		<Room
		token={token}
		room={roomName}
		livekitUrl={livekitUrl}
		onLeave={handleLeaveRoom}
		/>
	  ) : (
		<JoinRoom 
		onJoinSuccess={handleJoinSuccess}
		/>
	  )}
	</div>

*/