import { CheckWinner } from "./CheckWinner";

export function minimax(board, isMaximising, aiPlayer, humanPlayer) {
  const winner = CheckWinner(board);
if (winner && winner.winner === aiPlayer) return 1;
if (winner && winner.winner === humanPlayer) return -1;
if (winner === "tie") return 0;
    if (isMaximising) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {

            if (board[i] === "") {
                board[i] = aiPlayer;
                let score = minimax(board, false, aiPlayer, humanPlayer);
                board[i] = ""
               bestScore = Math.max(score, bestScore); 
            }
        }
        return bestScore;
    }
    else {
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = humanPlayer;
                let score = minimax(board, true, aiPlayer, humanPlayer);
                board[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }

}
export function findBestMove(board ,aiPlayer,humanPlayer){
    let bestScore = -Infinity;
    let bestMove=-1;
    for(let i=0;i<9;i++){
        if(board[i]===""){
            board[i]=aiPlayer;
            let score=minimax(board,false,aiPlayer,humanPlayer);
            board[i]="";
            if(score>bestScore){
                bestScore=score;
                bestMove=i;

            }

        }
    }
    return bestMove;

}