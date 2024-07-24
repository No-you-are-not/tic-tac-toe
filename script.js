// script.js

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const instruction = document.getElementById("instruction");
const modal = document.getElementById("modal");
const result = document.getElementById("result");

let board = Array(9).fill(null);
let currentPlayer = null;
let gameActive = false;
let currentCell = null;

const cellSize = 100;
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

canvas.addEventListener("click", handleCanvasClick);
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeydown);

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#DB7093FF";

    for (let i = 1; i < 3; i++) {
        context.beginPath();
        context.moveTo(i * cellSize, 0);
        context.lineTo(i * cellSize, canvas.height);
        context.moveTo(0, i * cellSize);
        context.lineTo(canvas.width, i * cellSize);
        context.stroke();
    }

    board.forEach((cell, index) => {
        const x = (index % 3) * cellSize;
        const y = Math.floor(index / 3) * cellSize;
        if (cell) {
            context.font = "48px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "#DB7093FF";
            context.fillText(cell, x + cellSize / 2, y + cellSize / 2);
        }

        if (index === currentCell) {
            context.strokeStyle = "blue";
            context.lineWidth = 3;
            context.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
            context.lineWidth = 1;
        }
    });
}

function handleCanvasClick(event) {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedIndex = Math.floor(x / cellSize) + Math.floor(y / cellSize) * 3;
    if (board[clickedIndex]) return;

    board[clickedIndex] = currentPlayer;
    drawBoard();
    checkResult();

    if (gameActive) {
        switchPlayer();
    }
}

function switchPlayer() {
    if (!gameActive) return;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    if (!gameActive) return;
    const availableCells = board
        .map((cell, index) => (cell === null ? index : null))
        .filter(index => index !== null);

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[randomIndex] = currentPlayer;
    drawBoard();
    checkResult();

    if (gameActive) {
        switchPlayer();
    }
}

function checkResult() {
    let roundWon = false;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        result.innerText = `Player ${currentPlayer} wins!`;
        showModal();
        return;
    }

    if (!board.includes(null)) {
        gameActive = false;
        result.innerText = "It's a draw!";
        showModal();
        return;
    }
}

function startGame() {
    board = Array(9).fill(null);
    currentPlayer = Math.random() < 0.5 ? "X" : "O";
    gameActive = true;
    currentCell = 0;
    drawBoard();
    startButton.style.display = "none";
    instruction.innerText = currentPlayer === "O" ? "Your opponent is playing first" : "You are playing first, click on the field to start";
    if (currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function resetGame() {
    modal.style.display = "none";
    startGame();
}

function handleKeydown(event) {
    if (!gameActive) return;

    switch (event.key) {
        case "ArrowUp":
            currentCell = (currentCell - 3 + 9) % 9;
            break;
        case "ArrowDown":
            currentCell = (currentCell + 3) % 9;
            break;
        case "ArrowLeft":
            currentCell = (currentCell - 1 + 9) % 9;
            break;
        case "ArrowRight":
            currentCell = (currentCell + 1) % 9;
            break;
        case "Enter":
            if (!board[currentCell]) {
                board[currentCell] = currentPlayer;
                drawBoard();
                checkResult();
                if (gameActive) {
                    switchPlayer();
                }
            }
            break;
    }

    drawBoard();
}

function showModal() {
    modal.style.display = "block";
}

drawBoard();
