import { LiveKitRoom } from "@livekit/components-react";
//import { RoomAudioRenderer } from "@livekit/components-react";
//import ParticipantsList from "./ParticipantsList";
import { AudioConference } from "@livekit/components-react";
import "@livekit/components-styles";
import QueueDisplay from "./QueueDisplay";

type RoomProps = {
  token: string;
  room: string;
  livekitUrl: string;
};

function Room({ token, room, livekitUrl }: RoomProps) {
  return (
    <LiveKitRoom
      serverUrl={livekitUrl}
      token={token}
      audio={true}
      connect={true}
      connectOptions={{
        autoSubscribe: true,
      }}
    >
      <h1>Salle : {room}</h1>
      <QueueDisplay room={room} />
      <AudioConference />
    </LiveKitRoom>
  );
}

export default Room;
