import { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import Room from "./components/Room";

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

  return (
    <div>
      {isConnected ? (
        <Room token={token} room={roomName} livekitUrl={livekitUrl} />
      ) : (
        <JoinRoom onJoinSuccess={handleJoinSuccess} />
      )}
    </div>
  );
}

export default App;
