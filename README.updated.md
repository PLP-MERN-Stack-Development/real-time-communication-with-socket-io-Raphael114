# Real-Time Chat with Socket.io

A simple real-time chat application built with Express + Socket.io (server) and React + Vite (client). This project demonstrates bidirectional real-time communication, with features such as a global chat room, online users list, typing indicators, private messaging, browser notifications, and basic reconnection behavior.

## Features (implemented)
- Global chat: broadcast messages to all connected users
- Online users list: see who is currently connected
- Typing indicator: shows who is typing
- Private messaging: send a private message to another user by socket id
- Browser notifications: notify when new messages arrive (uses the Web Notifications API)
- Reconnection behavior: socket.io client auto-reconnect options enabled
- Simple REST endpoints: `/api/messages` and `/api/users` to fetch current state

## Tech stack
- Server: Node.js, Express, Socket.io
- Client: React (functional components), Vite, socket.io-client

## Project structure

- server/
	- `server.js` - Express app + Socket.io server and socket event handlers
	- `package.json` - server dependencies and scripts
- client/
	- `index.html` - Vite entry
	- `src/App.jsx` - Minimal chat UI (join, messages, composer)
	- `src/socket/socket.js` - Socket.io client wrapper and hook
	- `package.json` - client dependencies and scripts

## Socket events (contract)

Client -> Server
- `user_join` : string username
- `send_message` : { message: string }
- `typing` : boolean (true = typing, false = stopped)
- `private_message` : { to: string (socket id), message: string }

Server -> Client
- `user_list` : Array<{ id: string, username: string }>
- `user_joined` : { username, id }
- `user_left` : { username, id }
- `receive_message` : { id, sender, senderId, message, timestamp }
- `private_message` : same shape as `receive_message` but flagged as private
- `typing_users` : Array<string> (usernames currently typing)

HTTP API
- `GET /api/messages` - returns an array of last messages stored in memory
- `GET /api/users` - returns an array of current connected users

Notes: messages are kept in server memory (capped to recent 100 messages). This is intended for demo and should be replaced with persistent storage for production.

## Setup (development)

Prerequisites: Node.js 18+ recommended, npm.

Install dependencies (from project root) and optionally create .env files from examples:

```powershell
# Install dev helper (concurrently) and server/client deps
npm install
npm run install:all

# Create .env files from the provided examples (will NOT overwrite existing .env files)
npm run env:setup
```

Start both servers:

```powershell
# Start server and client together (no browser auto-open)
npm run dev

# Start and open the client in your browser (Vite's --open)
npm run dev:open
```

Default ports used by the project:
- Client (Vite): 5173
- Server (Express): 5000

If you need custom addresses, the server reads `CLIENT_URL` from environment variables to configure socket CORS. The client can use `VITE_SOCKET_URL` to point to a different server.

Example .env (server) — copy to `server/.env` or use `npm run env:setup` to create it:

```
PORT=5000
CLIENT_URL=http://localhost:5173
```

Example .env for client (Vite) — copy to `client/.env` or use `npm run env:setup`:

```
VITE_SOCKET_URL=http://localhost:5000
```

## How to use

1. Open the client app in the browser (Vite will give you the local URL, usually `http://localhost:5173`).
2. Enter a username and click Join.
3. Type messages and press Enter or click Send. Messages go to the global room by default.
4. The sidebar shows online users. Private messaging can be performed from client code by calling the `private_message` socket event with the `to` socket id.

Notes on browser notifications: the client requests notification permission when it first loads. If granted, incoming messages from other users will produce a desktop notification.

## Troubleshooting
- If the client can’t connect to the server, check console logs on both server and browser. Ensure ports match and CORS origin is configured (`CLIENT_URL`).
- If notifications don’t appear, ensure you allowed notifications for the page in the browser and that `Notification.permission` is `granted`.
- If you see memory growth in server, remember messages are stored in-memory and capped to 100 recent messages; restart server clears them.

## Next steps / Improvements
- Add authentication (JWT) and persistent storage for users/messages (database).
- Implement message read receipts and delivery acknowledgment.
- Add file/image upload and delivery via socket or pre-signed cloud URLs.
- Add message pagination and search.
- Improve UI/UX and mobile responsiveness.

## License
MIT

---

If you want, I can replace the original `README.md` with this updated version or keep both files. Tell me which you'd prefer.
