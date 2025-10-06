import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";

type RoomProps = {
	token: string,
	room: string,
	livekitUrl: string
};

function Room({ token, room, livekitUrl }: RoomProps) {
	return (
		<LiveKitRoom
			serverUrl={livekitUrl}
			token={token}
			audio={true}
			connect={true}
		>
		<h1>Salle : {room}</h1>
		<RoomAudioRenderer/>
		</LiveKitRoom>
	);
}

export default Room;