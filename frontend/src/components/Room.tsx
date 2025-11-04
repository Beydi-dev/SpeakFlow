import { LiveKitRoom } from "@livekit/components-react";
//import { AudioConference } from "@livekit/components-react";
import "@livekit/components-styles";
//import QueueDisplay from "./QueueDisplay";
import RoomContent from "./RoomContent";

type RoomProps = {
  token: string;
  room: string;
  livekitUrl: string;
  onLeave?: () => void
};

function Room({ token, room, livekitUrl, onLeave }: RoomProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LiveKitRoom
        serverUrl={livekitUrl}
        token={token}
        audio={true}
        connect={true}
        connectOptions={{
          autoSubscribe: true,
        }}
      >
        <RoomContent
		room={room}
		onLeave={onLeave}
		/>
		
      </LiveKitRoom>
    </div>
  );
}

export default Room;
