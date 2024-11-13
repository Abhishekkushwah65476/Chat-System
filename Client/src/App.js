import { react, useEffect } from "react";
import "./App.css";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Components/Chat";

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showmessagebox, setShowmessagebox] = useState(false);

  const socket = io.connect("http://localhost:3001", {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  useEffect(() => {
    socket.on("connect_error", (error) => {
      console.log("Connection Error:", error);
    });

    socket.on("connect", () => {
      console.log("Successfully connected to server");
    });

    return () => {
      socket.off("connect_error");
      socket.off("connect");
    };
  }, [socket]);




  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowmessagebox(true);
    }
  };
  return (
    <div className="App">
      {!showmessagebox && (
        <div className="login-container">
          <h2>Chat</h2>
          <div>
            <input
              type="text"
              placeholder="john..."
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Room Id..."
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button onClick={joinRoom}>Submit</button>
        </div>
      )}

      {showmessagebox && (
        <Chat socket={socket} room={room} username={username} />
      )}
    </div>
  );
}

export default App;
