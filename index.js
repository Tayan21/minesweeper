{/* <html>
<head>
  <title>Minesweeper</title>
  <style>
    table {
      border-collapse: collapse;
    }
    td {
      width: 20px;
      height: 20px;
      border: 1px solid black;
      text-align: center;
      font-size: 12px;
      cursor: pointer;
    }
    td.revealed {
      background-color: lightgray;
    }
    td.mine {
      background-color: red;
    }
  </style>
</head>
<body>
  <h1>Minesweeper</h1>
  <table id="board"></table>
  <script>
    const numRows = 10;
    const numCols = 10;
    const numMines = 10;

    let board = [];
    let numRevealed = 0;
    let gameOver = false;

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
              if (r >= 0 && r < numRows && c >= 0 && c < numCols && board[r][c].mine) {
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

      board[row][col].revealed = true;
      numRevealed++;

      if (board[row][col].mine) {
        // Game over
        gameOver = true;
        alert('Game over!');
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
      }
    }

    function renderBoard() {
      const table = document.getElementById('board');
      table.innerHTML = '';
      for (let row = 0; row < numRows; row++) */}
