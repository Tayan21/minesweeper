let numRows = 10;
let numCols = 10;
let numMines = 10;
const container = document.createElement('div');
container.classList.add('container')
document.body.append(container)

const boardElement = document.createElement("div");

let levels = ["Easy", "Medium", "Hard"];

let time = document.createElement('div');
time.classList.add('time')


let moves = document.createElement('div');
moves.innerHTML = `Moves:`;
moves.classList.add('moves');


let button = document.createElement('button');
button.classList.add('button');
button.innerHTML = 'New Game';

container.append(moves);
container.append(time);
container.append(boardElement);
container.append(button);

let nightMode = document.createElement('div');
nightMode.classList.add('night-mode');
let toggleCircle = document.createElement('div');
toggleCircle.classList.add('toggle-circle');
nightMode.append(toggleCircle);
document.body.prepend(nightMode)




let board = [];
let numRevealed = 0;
let gameOver = false;
let countOfMoves = 0;
let isMines = true;
let time1;
let seconds = 0;

nightMode.addEventListener("click", function () {
  toggleCircle.classList.toggle("active");
  nightMode.classList.toggle("active");
  document.body.classList.toggle("active");
});

button.addEventListener("click", () => {
  let overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.addEventListener("click", closeModal);
  let modal = document.createElement("div");
  modal.classList.add("modal");
  let modalContent = document.createElement("div");
  modalContent.classList.add("modal__content");
  let list = document.createElement("ul");
  list.classList.add("levels");
  for (let i = 0; i < levels.length; i++) {
    let level = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add("level");
    button.innerHTML = levels[i];
    button.addEventListener("click", () => {
      playStart();
      newGame(levels[i]);
    });
    level.append(button);
    list.append(level);
  }
  modalContent.append(list);
  modal.append(modalContent);
  overlay.append(modal);
  document.body.append(overlay);
});

function newGame(level) {
  if (level === "Easy") {
    numRows = 10;
    numCols = 10;
    numMines = 10;
  } else if (level === "Medium") {
    numRows = 15;
    numCols = 15;
    numMines = 40;
  } else {
    numRows = 25;
    numCols = 25;
    numMines = 99;
  }

  moves.innerHTML = "Moves:";
  isMines = true;
  seconds = 0;
  countOfMoves = 0;
  numRevealed = 0;
  renderBoard();
  gameOver = false;
  clearInterval(time1);
  setTime();
}

function closeModal(e) {
  let target = e.target;

  if (
    target.classList.contains("overlay") ||
    target.classList.contains("level")
  ) {
    let overlay = document.querySelector(".overlay");
    if (overlay) {
      overlay.remove();
    }
  }
}

function createBoard(...d) {
  if (isMines) {
    // Initialize board with all cells as unrevealed
    for (let row = 0; row < numRows; row++) {
      board[row] = [];
      for (let col = 0; col < numCols; col++) {
        board[row][col] = {
          mine: false,
          revealed: false,
          flaged: false,
          numNeighborMines: 0,
        };
      }
    }
    let [r, c] = d;
    if (r && c) {
      board[r][c].revealed = true;
    }

    let numMinesPlaced = 0;
    while (numMinesPlaced < numMines) {
      const row = Math.floor(Math.random() * numRows);
      const col = Math.floor(Math.random() * numCols);
      if (!board[row][col].mine && !board[row][col].revealed) {
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
  isMines = false;
}

function revealCell(row, col) {
  if (
    (board[row][col].revealed && numRevealed !== 1) ||
    board[row][col].flaged ||
    gameOver
  ) {
    return;
  }

  if (!board[row][col].revealed) {
    board[row][col].revealed = true;
    numRevealed++;
  }

  if (board[row][col].mine) {
    // Game over
    gameOver = true;
    if (gameOver) {
      clearInterval(time1);
    }
    playLose();
    setTimeout(() => {
      alert("Игра окончена. Попробуйте еще раз");
    }, 200);

    return;
  }

  if (numRows * numCols == numRevealed + numMines) {
    clearInterval(time1);
    playWin();
    setTimeout(() => {
      alert(
        `Ура! Вы нашли все мины за ${seconds} секунд и ${
          countOfMoves + 1
        } ходов!`
      );
    }, 200);
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
  } else if (board[row][col].numNeighborMines) {
    board[row][col].revealed = true;
  }
}

// Function to flag a cell
function flagCell(row, col) {
  if (board.length) {
    if (board[row][col].revealed) {
      return;
    }
    board[row][col].flaged = !board[row][col].flaged;
  }
}

function setTime() {

  time1 = setInterval(() => {
    time.innerHTML = `Time: 0${++seconds}`;
    if (seconds > 9) {
      time.innerHTML = `Time: ${seconds}`;
    }
  }, 1000);
}

function revealOtherCells() {
  let boardRow = document.querySelectorAll(".row");
  for (let i = 0; i < boardRow.length; i++) {
    let boardCell = boardRow[i].querySelectorAll(".cell");
    for (let j = 0; j < boardCell.length; j++) {
      if (board[i][j].revealed) {
        boardCell[j].classList.add("revealed");
        if (board[i][j].numNeighborMines > 0) {
          boardCell[j].textContent = board[i][j].numNeighborMines;
          boardCell[j].classList.add(addNumColor(board[i][j].numNeighborMines));
        }
      }
    }
  }
}

function playWin() {
  let audio = document.createElement("audio");
  audio.src = "./audio/win.mp3";
  audio.play();
}

function playStart() {
  let audio = document.createElement("audio");
  audio.src = "./audio/start.mp3";
  audio.play();
}

function playTick() {
  let audio = document.createElement("audio");
  audio.src = "./audio/tick.mp3";
  audio.play();
}

function playClick() {
  let audio = document.createElement("audio");
  audio.src = "./audio/click.mp3";
  audio.play();
}

function playLose() {
  let audio = document.createElement("audio");
  audio.src = "./audio/lose.mp3";
  audio.play();
}

function renderBoard() {
  boardElement.innerHTML = "";
  boardElement.className = "board";

  for (let row = 0; row < numRows; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    for (let col = 0; col < numCols; col++) {
      const cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        playTick();
        flagCell(row, col);
        if (board.length) {
          if (!board[row][col].revealed) {
            board[row][col].flaged
              ? (cellElement.textContent = "🚩")
              : (cellElement.textContent = "");
          }
        }
      });
      cellElement.addEventListener("click", () => {
        if (isMines) {
          createBoard(row, col);
          revealCell(row, col);
          numRevealed++;
        }
      });
      cellElement.addEventListener("click", () => revealCell(row, col));
      cellElement.addEventListener("click", () => {
        playClick();
        if (!cellElement.classList.contains("revealed")) {
          ++countOfMoves;
          moves.textContent = `Moves: ${countOfMoves}`;
        }
        if (board[row][col].flagged) {
          cellElement.classList.add("flagged");
          cellElement.textContent = "🚩";
        }
        if (board[row][col].revealed) {
          cellElement.classList.add("revealed");
          revealOtherCells();
          if (board[row][col].mine) {
            cellElement.classList.add("mine");
            cellElement.textContent = "💣";
          } else if (board[row][col].numNeighborMines > 0) {
            cellElement.textContent = board[row][col].numNeighborMines;
            cellElement.classList.add(
              addNumColor(board[row][col].numNeighborMines)
            );
          }
        }
      });
      rowElement.append(cellElement);
    }
    boardElement.append(rowElement);
  }
}

function addNumColor(num) {
  const classColors = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
  ];
  return classColors[num - 1];
}

renderBoard();
setTime();
