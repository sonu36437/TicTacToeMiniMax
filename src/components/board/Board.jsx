import React, { useState } from "react";
import "./board.css";
import { CheckWinner } from "../../helper/CheckWinner";
import { findBestMove } from "../../helper/minimax";

export default function Board() {
  const [boardState, setBoardState] = useState([
    "", "", "",
    "", "", "",
    "", "", ""
  ]);

  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [foundWinner,setFoundWinner]=useState(false);
const [winnerCells, setWinnerCells] = useState([]);
const [playerWins,setPlayerWins]=useState("");



  const Player1 = "O";
  const Player2 = "X";

 const handleCellClick = (index) => {
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
  if (humanResult && humanResult.winner) {
    setFoundWinner(true);
    setWinnerCells(humanResult.index);
    setPlayerWins("You won");
    return;
  }


  setTimeout(() => {
    const aiMove = findBestMove(newBoard, Player2, Player1);

    if (aiMove !== -1 && !newBoard[aiMove]) {
      newBoard[aiMove] = Player2;
      setBoardState([...newBoard]);
    }

    const aiResult = CheckWinner(newBoard);

    if (aiResult === "tie") {
      setFoundWinner(true);
      setPlayerWins("It's a tie");
      return;
    }

    if (aiResult && aiResult.winner) {
      setFoundWinner(true);
      setWinnerCells(aiResult.index);
      setPlayerWins("Ai Won");
      return;
    }

  }, 250);
};


  const resetGame = () => {
    setBoardState(["","","","","","","","",""]);
    setIsHumanTurn(true);
    setFoundWinner(false);
    setPlayerWins("");
    setWinnerCells([]);
  };

  return (
    <div className="wrapper">
      <h1 className={`title ${playerWins?"winningText":''}`}>{playerWins?`${playerWins}`:"Tic Tac Toe"}</h1>

      <div className="boardContainer">
        {boardState.map((item, index) => (
          <div
            key={index}
            className={`cell ${winnerCells.includes(index) ? "winnerCell" : ""}`}
            style={{ color: item === "O" ? "#4CAF50" : "#e63946" }}
            onClick={() => handleCellClick(index)}
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
