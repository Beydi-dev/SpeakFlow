import { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import Room from "./components/Room";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import Test from "./components/Test"
import Wrapper from "./components/Wrapper";
import Landing from "./components/Landing";


function App() {
	// On créé d'abord les états
	const [token, setToken] = useState("");
	const [roomName, setRoomName] = useState("");
	const [livekitUrl, setLiveKitUrl] = useState("");

	function handleJoinSuccess(token: string, room: string, livekitUrl: string) {
		setToken(token);
		setRoomName(room);
		setLiveKitUrl(livekitUrl);
	}

	function handleLeaveRoom(): void {
		setToken("");
		setRoomName("");
		setLiveKitUrl("");
	}

	return (
		<BrowserRouter>
			<Routes>

				<Route path="/" element={<Landing />} />


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
			<Route path="/test" element={<Test />} />

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