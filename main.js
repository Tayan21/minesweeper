// Define game variables
const boardSize = 10;
const numMines = 10;
let numFlags = 0;
let numUnrevealedCells = boardSize ** 2 - numMines;
let gameBoard = [];
let gameEnded = false;

// Generate the game board with mines and numbers
function generateBoard() {
  // Generate a blank game board
  for (let i = 0; i < boardSize; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < boardSize; j++) {
      gameBoard[i][j] = {
        isMine: false,
        isFlagged: false,
        isRevealed: false,
        neighborMines: 0,
        x: i,
        y: j
      };
    }
  }

  // Add mines to the game board randomly
  let minesAdded = 0;
  while (minesAdded < numMines) {
    const randomX = Math.floor(Math.random() * boardSize);
    const randomY = Math.floor(Math.random() * boardSize);

    if (!gameBoard[randomX][randomY].isMine) {
      gameBoard[randomX][randomY].isMine = true;
      minesAdded++;
    }
  }

  // Add numbers to the game board based on neighbor mines
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (!gameBoard[i][j].isMine) {
        const neighbors = getNeighbors(i, j);
        const numNeighborMines = neighbors.filter(cell => cell.isMine).length;
        gameBoard[i][j].neighborMines = numNeighborMines;
      }
    }
  }
}

// Get all the neighbors of a given cell
function getNeighbors(x, y) {
  const neighbors = [];

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const neighborX = x + i;
      const neighborY = y + j;
      if (neighborX >= 0 && neighborX < boardSize && neighborY >= 0 && neighborY < boardSize) {
        neighbors.push(gameBoard[neighborX][neighborY]);
      }
    }
  }

  return neighbors;
}

// Handle left-clicking a cell
function handleLeftClick(cell) {
  if (gameEnded) {
    return;
  }

  if (cell.isMine) {
    revealAllMines();
    alert('Game Over!');
    gameEnded = true;
    return;
  }

  if (!cell.isRevealed) {
    cell.isRevealed = true;
    numUnrevealedCells--;

    if (cell.neighborMines === 0) {
      const neighbors = getNeighbors(cell.x, cell.y);
      neighbors.forEach(neighbor => {
        handleLeftClick(neighbor);
      });
    }

    if (numUnrevealedCells === 0) {
      alert('You Win!');
      gameEnded = true;
    }
  }
}

// Handle right-clicking a cell
function handleRightClick(cell) {
  if (gameEnded) {
    return;
  }

  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged;
    numFlags += cell.isFlagged ? 1 : -1;
  }
}

