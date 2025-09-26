import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [response, setResponse] = useState<string>('')

  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    newSocket.on('pong', (data) => { // On se prépare à ecouter le back
      setResponse(`${data.message} (à ${data.timestamp})`) // Ce qu'on envoie au back pour la réponse
    })

    return () => {
      newSocket.close();
    }
  }, [])

  const handlePing = () => {
    if (socket) {
      socket.emit('ping', { message: 'Hello depuis React!' })
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Socket.IO</h1>
      <button onClick={handlePing}>🏓 Envoyer Ping</button>
      {response && <div style={{ marginTop: '10px', background: '#f0f0f0', padding: '10px' }}>
        <strong>Réponse:</strong> {response}
      </div>}
    </div>
  )
}

export default App