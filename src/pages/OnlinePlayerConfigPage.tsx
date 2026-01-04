import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useGameModeStore } from "../store/GameMode";

export default function OnlinePlayerConfigPage() {
  const [name, setName] = useState("");
  const [connected, setConnected] = useState({
    buttonClicked: false,
    connected: false
  });
  const [roomId, setRoomId] = useState("");

  const {
    setCurrentPlayer,
    setOnlinePlayer,
    userCurrentPlayer,
    onlinePlayerName,
    setCurrentPlayerSymbol,
    currentPlayerSymbol,

    setIsConnected
  } = useGameModeStore();

  const connectToServer = () => {

    if (!name.trim()) return;
    setConnected(prev => ({
      ...prev,
      buttonClicked: true
    }));
    socket.connect();
  };

  useEffect(() => {
  const onConnect = () => {
    socket.emit("join", { name });
    setCurrentPlayer(name);
    setConnected(prev => ({
      ...prev,
      connected: true
    }));
  };

  const onJoinedRoom = (data:any) => {
    setRoomId(data.roomId);
  };

  const onUserJoined = (e:any) => {
    if (currentPlayerSymbol === "") {
      console.log(e);
      
      setCurrentPlayerSymbol(e.playerSymbol);
    }
  };

  const onRoomReady = (data:any) => {
    const opponent = data.room.users.find(
      (u:any) => u.userId !== socket.id
    );
    if (opponent) setOnlinePlayer(opponent.name);
    setIsConnected();
  };

  socket.on("connect", onConnect);
  socket.on("joined-room", onJoinedRoom);
  socket.on("user-joined", onUserJoined);
  socket.on("room-ready", onRoomReady);

  return () => {
    socket.off("connect", onConnect);
    socket.off("joined-room", onJoinedRoom);
    socket.off("user-joined", onUserJoined);
    socket.off("room-ready", onRoomReady);
  };
}, [name, currentPlayerSymbol]);



  return (
    <div
      style={{
        height: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          border: "1px solid white",
          padding: "32px",
          width: "320px",
          textAlign: "center",
        }}
      >
        {!connected.connected ? (
          <>
            <h2>Online Game</h2>
            {connected.buttonClicked && !connected.connected && (
              <p style={{ color: "white" }}>
                Connecting to the server, please wait...
              </p>
            )}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                background: "black",
                color: "white",
                border: "1px solid white",
                outline: "none",
              }}
            />
            <button
              onClick={connectToServer}
              style={{
                width: "100%",
                padding: "10px",
                background: "white",
                color: "black",
                border: "none",
                cursor: "pointer",
              }}
            >
              Connect
            </button>
          </>
        ) : (
          <>
            <h3>Room</h3>
            <p>{roomId ? roomId.slice(0, 8) : "-"}</p>

            <div style={{ marginTop: "20px" }}>
              <p>
                <strong>You:</strong> {userCurrentPlayer}
              </p>

              <p>
                <strong>Opponent:</strong>{" "}
                {onlinePlayerName || "Waiting..."}
              </p>
            </div>

            {onlinePlayerName && (
              <button
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "10px",
                  background: "white",
                  color: "black",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => {

                }}
              >
                Start Game
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
