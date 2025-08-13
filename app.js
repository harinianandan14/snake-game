// Simple, working Snake Game
let canvas, ctx;
let startScreen, gameOverScreen, scoreValue, highScoreValue, finalScore;
let startButton, restartButton;

// Game state
let gameRunning = false;
let gameStarted = false;
let score = 0;
let highScore = 0;

// Game settings
const TILE_SIZE = 20;
const TILE_COUNT = 30; // 600/20

// Snake and apple
let snake = [];
let direction = { x: 0, y: 0 };
let apple = { x: 0, y: 0 };
let gameLoop = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    startScreen = document.getElementById('startScreen');
    gameOverScreen = document.getElementById('gameOverScreen');
    scoreValue = document.getElementById('scoreValue');
    highScoreValue = document.getElementById('highScoreValue');
    finalScore = document.getElementById('finalScore');
    startButton = document.getElementById('startButton');
    restartButton = document.getElementById('restartButton');

    // Setup events
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    
    document.addEventListener('keydown', handleKeyPress);

    // Show start screen and draw demo
    showStartScreen();
    drawDemo();
});

function handleKeyPress(event) {
    const key = event.key;

    // Prevent scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
        event.preventDefault();
    }

    // Space bar for start/restart
    if (key === ' ') {
        if (!gameStarted) {
            startGame();
        } else if (!gameRunning) {
            restartGame();
        }
        return;
    }

    // Movement controls (only when game is running)
    if (gameRunning) {
        switch (key) {
            case 'ArrowUp':
                if (direction.y !== 1) {
                    direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (direction.y !== -1) {
                    direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (direction.x !== 1) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (direction.x !== -1) {
                    direction = { x: 1, y: 0 };
                }
                break;
        }
    }
}

function startGame() {
    // Hide start screen
    startScreen.classList.add('screen-hidden');
    gameOverScreen.classList.add('screen-hidden');

    // Reset game state
    gameRunning = true;
    gameStarted = true;
    score = 0;
    updateScore();

    // Initialize snake (center of screen, moving right)
    snake = [
        { x: 15, y: 15 },
        { x: 14, y: 15 },
        { x: 13, y: 15 }
    ];
    direction = { x: 1, y: 0 };

    // Create first apple
    createApple();

    // Start game loop
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    gameLoop = setInterval(updateGame, 120);
}

function restartGame() {
    // Hide game over screen
    gameOverScreen.classList.add('screen-hidden');
    
    // Start new game
    startGame();
}

function updateGame() {
    if (!gameRunning) {
        return;
    }

    // Move snake
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        endGame();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Check apple collision
    if (head.x === apple.x && head.y === apple.y) {
        score += 10;
        updateScore();
        createApple();
    } else {
        // Remove tail if no apple eaten
        snake.pop();
    }

    // Draw game
    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#00ff00';
    for (let segment of snake) {
        ctx.fillRect(
            segment.x * TILE_SIZE + 2,
            segment.y * TILE_SIZE + 2,
            TILE_SIZE - 4,
            TILE_SIZE - 4
        );
    }

    // Draw apple
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
        apple.x * TILE_SIZE + TILE_SIZE / 2,
        apple.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2 - 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

function createApple() {
    let attempts = 0;
    do {
        apple = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        attempts++;
    } while (
        snake.some(segment => segment.x === apple.x && segment.y === apple.y) &&
        attempts < 100
    );
}

function endGame() {
    gameRunning = false;
    
    // Stop game loop
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }

    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreValue.textContent = highScore;
    }

    // Show game over screen
    finalScore.textContent = score;
    gameOverScreen.classList.remove('screen-hidden');
}

function updateScore() {
    scoreValue.textContent = score;
}

function showStartScreen() {
    startScreen.classList.remove('screen-hidden');
    gameOverScreen.classList.add('screen-hidden');
    gameStarted = false;
    gameRunning = false;
}

function drawDemo() {
    // Clear canvas
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw demo snake
    ctx.fillStyle = '#00ff00';
    const demoSnake = [
        { x: 12, y: 15 },
        { x: 11, y: 15 },
        { x: 10, y: 15 }
    ];

    for (let segment of demoSnake) {
        ctx.fillRect(
            segment.x * TILE_SIZE + 2,
            segment.y * TILE_SIZE + 2,
            TILE_SIZE - 4,
            TILE_SIZE - 4
        );
    }

    // Draw demo apple
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
        17 * TILE_SIZE + TILE_SIZE / 2,
        15 * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2 - 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
}