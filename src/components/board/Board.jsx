import React, { useEffect, useState } from "react";
import "./board.css";
import { CheckWinner } from "../../helper/CheckWinner";
import { findBestMove } from "../../helper/minimax";
import { useGameModeStore } from "../../store/GameMode";
import { socket } from "../../socket";

export default function Board() {
  const [boardState, setBoardState] = useState([
    "", "", "",
    "", "", "",
    "", "", ""
  ]);

  const [foundWinner, setFoundWinner] = useState(false);
  const [winnerCells, setWinnerCells] = useState([]);
  const [playerWins, setPlayerWins] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [disableInput,setDisableInput]=useState(false)
  const applyMove = (index, symbol) => {
  setBoardState(prev => {
    if (prev[index] !== "" || foundWinner) return prev;

    const newBoard = [...prev];
    newBoard[index] = symbol;

    const result = CheckWinner(newBoard);

    if (result === "tie") {
      setFoundWinner(true);
      setPlayerWins("It's a tie");
    }

    if (result?.winner) {
      setFoundWinner(true);
      setWinnerCells(result.index);
      setPlayerWins(`${symbol} Won`);
    }

    return newBoard;
  });
};
  

  const { mode ,currentPlayerSymbol,userCurrentPlayer,onlinePlayerName} = useGameModeStore();

 
// for ai 
  const Player1 = "O";
  const Player2 = "X";


 
  useEffect(() => {


    socket.on('receive',(m)=>{
 
    const {index}=m.message;
    const OpponentSymbol=currentPlayerSymbol==="X"?"O":"X"
   applyMove(index,OpponentSymbol)
   setDisableInput(false)

    
      

    })
    socket.on("reset",()=>{

          setBoardState(["","","","","","","","",""]);
    setFoundWinner(false);
    setWinnerCells([]);
    setPlayerWins("");

   
     
      
    })
    return ()=>{
      socket.disconnect();
    }
  
    


  
 
  }, []);

 //ai mode
  const handleCellClickAI = (index) => {
    if (foundWinner) return;
    if (boardState[index] !== "") return;

    let newBoard = [...boardState];
    newBoard[index] = Player1;
    setBoardState(newBoard);

    const humanResult = CheckWinner(newBoard);
    if (humanResult === "tie") {
      setFoundWinner(true);
      setPlayerWins("It's a tie");
      return;
    }
    if (humanResult?.winner) {
      setFoundWinner(true);
      setWinnerCells(humanResult.index);
      setPlayerWins("You Won");
      return;
    }

    setTimeout(() => {
      const aiMove = findBestMove(newBoard, Player2, Player1);
      if (aiMove !== -1) {
        newBoard[aiMove] = Player2;
        setBoardState([...newBoard]);
      }

      const aiResult = CheckWinner(newBoard);
      if (aiResult === "tie") {
        setFoundWinner(true);
        setPlayerWins("It's a tie");
      }
      if (aiResult?.winner) {
        setFoundWinner(true);
        setWinnerCells(aiResult.index);
        setPlayerWins("AI Won");
      }
    }, 250);
  };

// offline friend mode 
  const handleCellClickOffline = (index) => {
    if (foundWinner) return;
    if (boardState[index] !== "") return;

    const newBoard = [...boardState];
    newBoard[index] = currentPlayer;
    setBoardState(newBoard);

    const result = CheckWinner(newBoard);

    if (result === "tie") {
      setFoundWinner(true);
      setPlayerWins("It's a tie");
    }

    if (result?.winner) {
      setFoundWinner(true);
      setWinnerCells(result.index);
      setPlayerWins(`${currentPlayer} Won`);
      return;
    }

    setCurrentPlayer(prev => (prev === "X" ? "O" : "X"));
  };

// online mode send event to server
  const handleOnlineClick = (index) => {

    if(disableInput)return;
    if (foundWinner) return;
    if (boardState[index] !== "") return;
    

   applyMove(index,currentPlayerSymbol)
    socket.emit("send", {
      message: {
        index,
       
      }
    });
    setDisableInput(true)
  };

 
  const handleClick = (index) => {
    if (mode === "AI") handleCellClickAI(index);
    else if (mode === "OFFLINE") handleCellClickOffline(index);
    else handleOnlineClick(index);
  };


  const resetLocalGame = () => {
    setBoardState(["","","","","","","","",""]);
    setFoundWinner(false);
    setWinnerCells([]);
    setPlayerWins("");
    setCurrentPlayer("X");
  };

  const resetGame = () => {
    if (mode === "ONLINE") socket.emit("reset");
    else resetLocalGame();
  };


  return (
    <div className="wrapper">
     {
    mode === "ONLINE"
    &&
   
  <div
  style={{
    width: "100%",
    display: "flex",
    gap: "20px",
    padding: "24px",
  }}
>
  <div
    style={{
      flex: 1,
      background: "white",
      color: "#2e7d32",
      padding: "16px 20px",
      borderRadius: "16px",
      fontWeight: 600,
      textAlign: "center",
      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    }}
  >
    You: {userCurrentPlayer +" as " + currentPlayerSymbol || "—"}
  </div>

  <div
    style={{
      flex: 1,
      background: "white",
      color: "#c62828",
      padding: "16px 20px",
      borderRadius: "16px",
      fontWeight: 600,
      textAlign: "center",
      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    }}
  >
    Opponent: {onlinePlayerName || "Waiting…"}
  </div>
</div>



     }
      <h1 className={`title ${playerWins ? "winningText" : ""}`}>
        {playerWins || "Tic Tac Toe"}

      </h1>

      <div className="boardContainer">
        {boardState.map((item, index) => (
          <div
            key={index}
            className={`cell ${
              winnerCells.includes(index) ? "winnerCell" : ""
            } ${disableInput && "disabled"} `}
            onClick={() => handleClick(index)}
            style={{ color: item === "O" ? "#4CAF50" : "#e63946" }}
          >
            {item}
          </div>
        ))}
      </div>

      <button className="resetBtn" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}
