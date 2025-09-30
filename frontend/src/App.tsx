import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [response, setResponse] = useState<string>('')

  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    // Listener pong (ancien test)
    newSocket.on('pong', (data) => {
      setResponse(`${data.message} (à ${data.timestamp})`)
    })

    // ✅ AJOUTER : Listener room_joined
    newSocket.on('room_joined', (data) => {
      console.log('✅ Room joined! Token:', data.token)
      console.log('Room:', data.room)
      console.log('LiveKit URL:', data.livekitUrl)
      setResponse(`Connecté à ${data.room} !`)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleTestJoinRoom = () => {
    if (socket) {
      socket.emit('join_room', {
        room: 'test-room',
        identity: 'TestUser'
      })
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Socket.IO</h1>
      
      <button onClick={handleTestJoinRoom}>
        🚪 Test Join Room
      </button>
      
      {response && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0' }}>
          <strong>Réponse :</strong> {response}
        </div>
      )}
    </div>
  )
}

export default App