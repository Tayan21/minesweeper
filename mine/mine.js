const numRows = 10;
const numCols = 10;
const numMines = 10;

let board = [];
let numRevealed = 0;
let gameOver = false;
let countOfMoves = 0;

function createBoard() {
  // Initialize board with all cells as unrevealed
  for (let row = 0; row < numRows; row++) {
    board[row] = [];
    for (let col = 0; col < numCols; col++) {
      board[row][col] = {
        mine: false,
        revealed: false,
        numNeighborMines: 0,
      };
    }
  }

  // Add mines randomly to the board
  let numMinesPlaced = 0;
  while (numMinesPlaced < numMines) {
    const row = Math.floor(Math.random() * numRows);
    const col = Math.floor(Math.random() * numCols);
    if (!board[row][col].mine) {
      board[row][col].mine = true;
      numMinesPlaced++;
    }
  }

  // Calculate number of neighboring mines for each cell
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (board[row][col].mine) {
        continue;
      }
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (
            r >= 0 &&
            r < numRows &&
            c >= 0 &&
            c < numCols &&
            board[r][c].mine
          ) {
            board[row][col].numNeighborMines++;
          }
        }
      }
    }
  }
}

function revealCell(row, col) {
  if (board[row][col].revealed || gameOver) {
    return;
  }

  if(!board[row][col].revealed) {
    board[row][col].revealed = true;
    numRevealed++;
  }
  if(numRows*numCols == numRevealed + numMines) {
    alert('you win')
  }
  

  if (board[row][col].mine) {
    // Game over
    gameOver = true;
    alert("Game over!");
    return;
  }
  

  if (board[row][col].numNeighborMines === 0) {
    // Recursively reveal neighboring cells
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
          revealCell(r, c);
        }
      }
    }
  } else if(board[row][col].numNeighborMines) {
    board[row][col].revealed = true;
  }
}

function revealOtherCells() {
  let boardRow = document.querySelectorAll(".row");
  for (let i = 0; i < boardRow.length; i++) {
    let boardCell = boardRow[i].querySelectorAll(".cell");
    for (let j = 0; j < boardCell.length; j++) {
      if(board[i][j].revealed) {
        boardCell[j].classList.add("revealed")
        if (board[i][j].numNeighborMines > 0) {
          boardCell[j].textContent = board[i][j].numNeighborMines
        }
      }
    }
  }
}

function renderBoard() {
  const boardElement = document.createElement("div");
  boardElement.innerHTML = "";

  for (let row = 0; row < numRows; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    for (let col = 0; col < numCols; col++) {
      const cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.addEventListener("click", () => revealCell(row, col));
      cellElement.addEventListener("click", () => {
        countOfMoves++;
        console.log(count)
        if (board[row][col].revealed) {
          cellElement.classList.add("revealed");
          revealOtherCells();
          if (board[row][col].mine) {
            cellElement.classList.add("mine");
            cellElement.textContent = "X";
          } else if (board[row][col].numNeighborMines > 0) {
            cellElement.textContent = board[row][col].numNeighborMines;
          }
        }
      });
      rowElement.append(cellElement);
    }
    boardElement.append(rowElement);
  }
  document.body.append(boardElement);
}

createBoard();
renderBoard();
