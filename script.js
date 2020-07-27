let origBoard; // The tic-tac-toe board
const humanPlayer = 'O';
const aiPlayer = 'X';
const difficulty = {
	// Difficulty levels
	easy   : true,
	medium : false,
	hard   : false
};
let isMedium = true; // One time use var
let gameAlreadyWon = false;
const winCombos = [
	// The list of winning combos
	[ 0, 1, 2 ],
	[ 3, 4, 5 ],
	[ 6, 7, 8 ],
	[ 0, 3, 6 ],
	[ 1, 4, 7 ],
	[ 2, 5, 8 ],
	[ 0, 4, 8 ],
	[ 2, 4, 6 ]
];

// Selects all the cell of the board
const cells = document.querySelectorAll('.cell');
// Initialise the game
startGame();

// Marks each cells value values from 0-9 and add an onClick eventListner to them
function startGame () {
	gameAlreadyWon = false;
	if (difficulty.medium) isMedium = true;
	document.querySelector('.endgame').style.display = 'none';
	origBoard = Array.from(Array(9).keys());
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerHTML = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick);
	}
}

// Changes the difficulty level of the game
function changeDifficulty (diff) {
	if (diff.classList[1] === 'easy') {
		difficulty.easy = true;
		difficulty.medium = false;
		difficulty.hard = false;
		if (!document.querySelector('.easyActive')) diff.classList.add('easyActive');
		if (document.querySelector('.mediumActive'))
			document.querySelector('.mediumActive').classList.remove('mediumActive');
		if (document.querySelector('.hardActive')) document.querySelector('.hardActive').classList.remove('hardActive');
		startGame();
	} else if (diff.classList[1] === 'medium') {
		difficulty.medium = true;
		difficulty.easy = false;
		difficulty.hard = false;
		if (!document.querySelector('.mediumActive')) diff.classList.add('mediumActive');
		if (document.querySelector('.easyActive')) document.querySelector('.easyActive').classList.remove('easyActive');
		if (document.querySelector('.hardActive')) document.querySelector('.hardActive').classList.remove('hardActive');
		startGame();
	} else if (diff.classList[1] === 'hard') {
		difficulty.hard = true;
		difficulty.medium = false;
		difficulty.easy = false;
		if (!document.querySelector('.hardActive')) diff.classList.add('hardActive');
		if (document.querySelector('.easyActive')) document.querySelector('.easyActive').classList.remove('easyActive');
		if (document.querySelector('.mediumActive'))
			document.querySelector('.mediumActive').classList.remove('mediumActive');
		startGame();
	}
}

// Executes the turns of humanPlayer and aiPlayer
function turnClick (e) {
	if (typeof origBoard[e.target.id] === 'number') {
		turn(e.target.id, humanPlayer);
		if (difficulty.easy && !checkTie()) turn(randomSpot(), aiPlayer);
		else if (difficulty.medium && isMedium && !checkTie()) turn(randomSpot(), aiPlayer);
		else if (difficulty.medium && !isMedium && !checkTie()) turn(bestSpot(), aiPlayer);
		else if (difficulty.hard && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

// Plays the turn of each player and check if the game is won
function turn (squareId, player) {
	if (!gameAlreadyWon) {
		origBoard[squareId] = player;
		document.getElementById(squareId).innerText = player;
		let gameWon = checkWin(origBoard, player);
		if (gameWon) gameOver(gameWon);
	}
}

// Checks if the game is won by the player
function checkWin (board, player) {
	let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
	let gameWon = null;
	for (let [ index, win ] of winCombos.entries()) {
		if (win.every((elem) => plays.indexOf(elem) > -1)) {
			gameWon = { index, player };
			break;
		}
	}
	return gameWon;
}

// End game function
function gameOver (gameWon) {
	gameAlreadyWon = true;
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player === humanPlayer ? 'rgb(110, 250, 255)' : 'rgb(255, 109, 109)';
	}
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick);
	}
	declareWinner(gameWon.player === humanPlayer ? 'You Won!' : 'You Lost!');
}

// Just declares the result to the screen
function declareWinner (winner) {
	document.querySelector('.endgame').style.display = 'block';
	document.querySelector('.text').innerText = winner;
}

// Get the empty squares on the board
function emptySquares () {
	return origBoard.filter((s) => typeof s === 'number');
}

// Gets the best spot based on the min-max function for the ai player
function bestSpot () {
	return minimax(origBoard, aiPlayer).index; // Function in AI.js file
}

// For choosing the random index based on the difficulty settings
function randomSpot () {
	if (difficulty.easy) return randomIndex();
	else if (difficulty.medium) {
		isMedium = false;
		return randomIndex();
	}
}

// For generating a random index based on the qmpty squares
function randomIndex () {
	return emptySquares()[Math.floor(Math.random() * emptySquares().length)];
}

// Check for tie
function checkTie () {
	if (emptySquares().length === 0 && !gameAlreadyWon) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = 'rgb(100, 255, 100)';
			cells[i].removeEventListener('click', turnClick);
		}
		declareWinner('Tie Game!');
		return true;
	}
	return false;
}
