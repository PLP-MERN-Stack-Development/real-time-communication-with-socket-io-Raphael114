import React, { useEffect, useState, useRef } from 'react'
import { useSocket, socket } from './socket/socket'

export default function App() {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    setTyping,
  } = useSocket()

  const [username, setUsername] = useState('')
  const [input, setInput] = useState('')
  const [joined, setJoined] = useState(false)
  const typingTimeout = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleJoin = () => {
    if (!username) return
    connect(username)
    setJoined(true)
  }

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage({ message: input.trim() })
    setInput('')
    setTyping(false)
  }

  const handleTyping = (value) => {
    setInput(value)
    setTyping(true)

    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => setTyping(false), 800)
  }

  // browser notification example
  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') Notification.requestPermission()
  }, [])

  // show a notification for incoming messages from others
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last) return
    // ignore system messages
    if (last.system) return
    // if last message sender is not current username, show notification
    if (joined && last.sender && last.sender !== username && Notification.permission === 'granted') {
      new Notification(`${last.sender}`, { body: last.message })
    }
  }, [messages])

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Socket Chat</h2>
        <div className="status">Status: {isConnected ? 'Connected' : 'Disconnected'}</div>

        {!joined ? (
          <div className="join">
            <input placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <button onClick={handleJoin}>Join</button>
          </div>
        ) : (
          <div className="online">
            <h3>Online Users</h3>
            <ul>
              {users.map((u) => (
                <li key={u.id}>{u.username}{u.id === socket.id ? ' (you)' : ''}</li>
              ))}
            </ul>
            <button onClick={() => { disconnect(); setJoined(false); }}>Leave</button>
          </div>
        )}
      </div>

      <div className="chat">
        <div className="messages">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.system ? 'system' : m.sender === username ? 'me' : 'other'}`}>
              {m.system ? (
                <em>{m.message}</em>
              ) : (
                <>
                  <div className="meta">
                    <strong>{m.sender}</strong>
                    <span className="time">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="body">{m.message}</div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="typing">
          {typingUsers.length > 0 && <div>{typingUsers.join(', ')} typing...</div>}
        </div>

        <div className="composer">
          <input
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            placeholder="Type a message..."
            disabled={!joined}
          />
          <button onClick={handleSend} disabled={!joined}>Send</button>
        </div>
      </div>
    </div>
  )
}
