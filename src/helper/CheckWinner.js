export function CheckWinner(board) {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6],

    ];

    for (let [a, b, c] of winningConditions) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {

            return {
                winner: board[a],
                index: [a, b, c]

            }
        }



    }
    if (!board.includes("")) {
        return "tie";
    }

    return null;

}