const board = document.getElementById("board");
const cells = Array.from(document.querySelectorAll(".cell"));
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const scorePlayerEl = document.getElementById("score-player");
const scoreDrawEl = document.getElementById("score-draw");
const scoreAiEl = document.getElementById("score-ai");

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const PLAYER = "X";
const AI = "O";

let state = Array(9).fill("");
let finished = false;
let busy = false;
let score = { player: 0, draw: 0, ai: 0 };

function render() {
  cells.forEach((cell, index) => {
    const value = state[index];
    cell.textContent = value;
    cell.classList.toggle("x", value === PLAYER);
    cell.classList.toggle("o", value === AI);
    cell.disabled = Boolean(value) || finished || busy;
  });
}

function findWinner(boardState) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return { mark: boardState[a], line };
    }
  }
  return null;
}

function highlight(line) {
  line.forEach((index) => cells[index].classList.add("win"));
}

function updateScore() {
  scorePlayerEl.textContent = score.player;
  scoreDrawEl.textContent = score.draw;
  scoreAiEl.textContent = score.ai;
}

function endGame(result) {
  finished = true;
  if (result === "player") {
    score.player += 1;
    statusEl.textContent = "Победа! 🎉";
  } else if (result === "ai") {
    score.ai += 1;
    statusEl.textContent = "Компьютер выиграл 🤖";
  } else {
    score.draw += 1;
    statusEl.textContent = "Ничья 🤝";
  }
  updateScore();
  render();
}

function checkState() {
  const winner = findWinner(state);
  if (winner) {
    highlight(winner.line);
    endGame(winner.mark === PLAYER ? "player" : "ai");
    return true;
  }
  if (state.every(Boolean)) {
    endGame("draw");
    return true;
  }
  return false;
}

function emptyCells() {
  return state.map((value, index) => (value ? null : index)).filter((index) => index !== null);
}

function pickBestMove(mark) {
  const opponent = mark === AI ? PLAYER : AI;

  for (const line of WIN_LINES) {
    const values = line.map((index) => state[index]);
    if (values.filter((value) => value === mark).length === 2 && values.includes("")) {
      return line[values.indexOf("")];
    }
  }

  for (const line of WIN_LINES) {
    const values = line.map((index) => state[index]);
    if (values.filter((value) => value === opponent).length === 2 && values.includes("")) {
      return line[values.indexOf("")];
    }
  }

  if (!state[4]) {
    return 4;
  }

  const corners = [0, 2, 6, 8].filter((index) => !state[index]);
  if (corners.length) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  const free = emptyCells();
  return free[Math.floor(Math.random() * free.length)];
}

function aiMove() {
  busy = true;
  render();
  statusEl.textContent = "Компьютер думает…";

  setTimeout(() => {
    const index = pickBestMove(AI);
    if (index === undefined) {
      busy = false;
      return;
    }
    state[index] = AI;
    busy = false;
    render();
    if (!checkState()) {
      statusEl.textContent = "Твой ход";
      render();
    }
  }, 380);
}

function playerMove(index) {
  if (finished || busy || state[index]) {
    return;
  }
  state[index] = PLAYER;
  render();
  if (checkState()) {
    return;
  }
  aiMove();
}

function startNewGame() {
  state = Array(9).fill("");
  finished = false;
  busy = false;
  cells.forEach((cell) => cell.classList.remove("win", "x", "o"));
  statusEl.textContent = "Твой ход";
  render();
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => playerMove(Number(cell.dataset.index)));
});

resetBtn.addEventListener("click", startNewGame);

render();

// Переключение между играми
const gameTabs = Array.from(document.querySelectorAll(".tab"));
gameTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    gameTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll(".game-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === "panel-" + tab.dataset.game);
    });
  });
});
