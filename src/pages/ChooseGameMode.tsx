import React from "react";
import { useGameModeStore } from "../store/GameMode";

const containerStyle = {
  background: "linear-gradient(135deg, #0f0f0f, #000000)",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Inter, system-ui, sans-serif",
};


const titleStyle = {
  color: "white",
  marginBottom: "28px",
  fontSize: "28px",
  fontWeight: 600,
  letterSpacing: "0.5px",
};

const buttonBaseStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "none",
  fontSize: "16px",
  fontWeight: 500,
  cursor: "pointer",
};

export default function ChooseGameMode() {
    const {setMode} =useGameModeStore();
  return (
    <div style={containerStyle}>
      <div style={{textAlign:'center'}}>
        <h1 style={titleStyle}>Choose Game Mode</h1>

        <button
          style={{ ...buttonBaseStyle, background: "#4CAF50", color: "black" }}
          onClick={()=>{
            setMode("AI");
          }}
        >
          Play vs AI
        </button>

        <button
          style={{ ...buttonBaseStyle, background: "#2196F3", color: "white" }}
          onClick={()=>{
            setMode("OFFLINE")
          }}
        >
          Play with Friend
        </button>

        <button
          style={{
            ...buttonBaseStyle,
            background: "#e63946",
            color: "white",
            marginBottom: 0,
          }}
        onClick={()=>setMode("ONLINE")}
        >
          Online Multiplayer
        </button>
      </div>
    </div>
  );
}
