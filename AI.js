// This function basically playes the whole game from the current condition and returns the optimal index for the AI to not loose
function minimax (newBoard, player) {
	const availSpots = emptySquares(); // Gets all the empty squares

	// Checks the current board for the win. If human wins then its bad for the AI so a low score is returned and vice-versa; In case of a tie 0 is send
	if (checkWin(newBoard, humanPlayer)) {
		return { score: -10 };
	} else if (checkWin(newBoard, aiPlayer)) {
		return { score: 10 };
	} else if (availSpots.length === 0) {
		return { score: 0 };
	}
	let moves = []; // List of moves for the current player
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]]; // Save the index
		newBoard[availSpots[i]] = player; // Put the player on the current available index
		if (player === aiPlayer) {
			const result = minimax(newBoard, humanPlayer); // Recursively call the minmax function to find all the idexes
			move.score = result.score;
		} else {
			const result = minimax(newBoard, aiPlayer); // Recursively call the minmax function to find all the idexes
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index; // Move to the next itteration
		moves.push(move);
	}
	let bestMove; // Best move for ai would have the highest score and for human would have the lowest score
	if (player === aiPlayer) {
		let bestScore = -10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove]; // Returns the best move possible
}
