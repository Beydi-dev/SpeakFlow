import { useParticipants, useLocalParticipant } from "@livekit/components-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

function ParticipantsList() {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  return (
    <div>
      <h1>Participants ({participants.length})</h1>
      <ul>
        {participants.map((p) => (
          <li key={p.sid}>
            <strong>{p.identity}</strong>
              {p.isSpeaking && <FontAwesomeIcon icon={faMicrophone} />}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParticipantsList;
