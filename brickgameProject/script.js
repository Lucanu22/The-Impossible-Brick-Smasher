const canvas = document.getElementById('playGround');
const context = canvas.getContext('2d');
const ballSize = 10;
const pongH = 15;
const pongW = 150;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 5;
let dy = -5;
let pongX = (canvas.width - pongW) / 2;
let rightKey = false;
let leftKey = false;
const brickRows = 9;
const brickCol = 12;
const brickWidth = 45;
const brickHeight = 10;
const brickPadding = 20;
const brickOffsetTop = 40;
const brickOffsetLeft = 20;
let playerName = ''; // Variable to store the player's name
let score = 0; // Player's score
let bricks = []; // Array to store bricks
let gameInterval; // Variable to hold the game interval ID

function handleNameInput() {
    const nameInput = document.getElementById('name-input');
    const startButton = document.querySelector('.button-82-pushable'); // Use querySelector to select the button by class

    startButton.addEventListener('click', function () {
        playerName = nameInput.value;
        if (playerName.trim() !== '') {
            nameInput.disabled = true;
            startButton.disabled = true;
            startGame();
        } else {
            alert('Please enter a valid name.');
        }
    });
}

// Function to update the scoreboard
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.textContent = `Player: ${playerName}`;
}

// Function to draw the scoreboard
function drawScoreboard() {
    const scoreboard = document.createElement('div');
    scoreboard.id = 'scoreboard';
 document.body.appendChild(scoreboard);
}

// Function to reset the game
function resetGame() {
    score = 0;
    updateScoreboard();
    // Reset ball position and velocity
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 3;
    dy = -3;
    // Reset paddle position
    pongX = (canvas.width - pongW) / 2;
    // Reset bricks
    createBricks();
     window.location.reload();
}

// Function to create bricks
function createBricks() {
    bricks = [];
    for (let row = 0; row < brickRows; row++) {
        for (let col = 0; col < brickCol; col++) {
            bricks.push({
                x: col * (brickWidth + brickPadding) + brickOffsetLeft,
                y: row * (brickHeight + brickPadding) + brickOffsetTop,
                status: 1, // 1 indicates the brick is active
            });
        }
    }
}
const backgroundImage = new Image();
backgroundImage.src = 'images/blueSpace.jpeg';
function drawBackground() {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Function to draw the ball

function drawBall() {
    const ballImage = new Image();
    ballImage.src = 'images/redFireBall.png';
    context.beginPath();
    context.drawImage(ballImage, x - ballSize, y - ballSize, ballSize * 2.5, ballSize * 2.5);
    context.closePath();
}

// Function to draw the paddle
function drawPong() {
    const pongImage = new Image();
    pongImage.src = 'images/yellowKey.png';
        context.drawImage(pongImage, pongX, canvas.height - pongH, pongW, pongH);
    }



// Function to draw the bricks
function drawBricks() {
    bricks.forEach(function (brick) {
        if (!brick.status) return;
        context.beginPath();
        context.rect(brick.x, brick.y, brickWidth, brickHeight);
        context.fillStyle = '#00FFCA';
        context.fill();
        context.closePath();
    });
}

function collisionDetection() {
    let brickCount = 0;

    bricks.forEach(function (brick) {
        if (brick.status) {
            if (
                x - ballSize < brick.x + brickWidth &&
                x + ballSize > brick.x &&
                y - ballSize < brick.y + brickHeight &&
                y + ballSize > brick.y
            ) {
                dy = -dy;
                brick.status = 0;
                score++;

            } else {
                brickCount++;
            }
        }
    });

    if (y + dy < ballSize) {
        dy = -dy; // Reverse the vertical velocity when hitting the top wall
    }

    if (
        y + ballSize > canvas.height - pongH &&
        x + ballSize > pongX &&
        x - ballSize < pongX + pongW
    ) {
        dy = -dy;
    }

    if (x + dx > canvas.width - ballSize || x + dx < ballSize) {
        dx = -dx; // Reverse the horizontal velocity when hitting a side wall
    }

   

    if (brickCount === 0) {
        context.font = '50px Lobster';
        context.fillStyle = 'yellow';
        const textWidth = context.measureText('You Win!').width;
        const textX = (canvas.width - textWidth) / 2;
        const textY = canvas.height / 2;
        context.fillText('You Win!', textX, textY);
        resetGame();
        clearInterval(gameInterval);
        reloadPageAfterDelay();
        return;
    }
}



// Function to draw the score
function drawScore() {
    context.font = '18px Lobster';
    context.fillStyle = '#0095DD';
    context.fillText(`Score: ${score}`, 8, 20);
}

// Function to check if the ball hits the paddle
function hitPong() {
    return hitBottom() && ballOverPong();
}

// Function to check if the ball is over the paddle
function ballOverPong() {
    return x > pongX && x < pongX + pongW;
}

// Function to check if the ball hits the bottom edge
function hitBottom() {
    return y + dy > canvas.height - ballSize;
}

// Function to check if the game is over
function gameOver() {
    if (hitBottom() && !ballOverPong()) {
        // Game over, display a message indicating the player has lost
        context.font = '50px Lobster';
        context.fillStyle = 'yellow';
        const textWidth = context.measureText('Game Over').width;
        const textX = (canvas.width - textWidth) / 2; // Calculate the X position to center the text horizontally
        const textY = canvas.height / 2; // Calculate the Y position to center the text vertically
        context.fillText('You Lose!', textX, textY);
        resetGame(); // Reset the game
        clearInterval(gameInterval); // Clear the interval to stop the game
        setTimeout(() => {
            window.location.reload();
        }, 5000);
        return true; // Return true to indicate game over
    }
    return false; // Return false if the game is not over
}


// Function to check if the ball hits a side wall
function hitSideWall() {
    return x + dx > canvas.width - ballSize || x + dx < ballSize;
}

// Function to check if the ball hits the top edge
function hitTop() {
    return y + dy < ballSize;
}

// Function to check if the ball is out of bounds
function xOutOfBounds() {
    return x + dx > canvas.width - ballSize || x + dx < ballSize;
}

// Function to handle key down events
function keyDown(e) {
    if (e.keyCode === 39) {
        rightKey = true;
    } else if (e.keyCode === 37) {
        leftKey = true;
    }
}

// Function to handle key up events
function keyUp(e) {
    if (e.keyCode === 39) {
        rightKey = false;
    } else if (e.keyCode === 37) {
        leftKey = false;
    }
}

document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

// Function to move the paddle
function movePong() {
    if (rightKey && pongX < canvas.width - pongW) {
        pongX += 7;
    } else if (leftKey && pongX > 0) {
        pongX -= 7;
    }
}



// Function to update the canvas
function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBricks();
    drawBall();
    drawPong();
    drawScore();
    

    collisionDetection();

    if (hitPong() || gameOver()) {
        // Game over, display a message indicating the player has lost
        context.font = '50px Lobster';
        context.fillStyle = 'yellow';
        const textWidth = context.measureText('Game Over').width;
        const textX = (canvas.width - textWidth) / 2; // Calculate the X position to center the text horizontally
        const textY = canvas.height / 2; // Calculate the Y position to center the text vertically
        context.fillText('You Lose!', textX, textY);
        reloadPageAfterDelay();
        resetGame(); // Call the resetGame() function to reset the game
        clearInterval(gameInterval); // Clear the interval to stop the game
        return; // Stop the update function
    } else if (score === brickRows * brickCol) {
        // All bricks cleared, display a message indicating the player has won
        context.font = '50px Lobster';
        context.fillStyle = 'yellow';
        const textWidth = context.measureText('You Win!').width;
        const textX = (canvas.width - textWidth) / 2; // Calculate the X position to center the text horizontally
        const textY = canvas.height / 2; // Calculate the Y position to center the text vertically
        context.fillText('You Win!', textX, textY);
        resetGame(); // Call the resetGame() function to reset the game
        clearInterval(gameInterval); // Clear the interval to stop the game
        return; // Stop the update function
    }

    movePong();
    x += dx;
    y += dy;

    requestAnimationFrame(update);
}

// Function to start the game
function startGame() {
    createBricks();
    drawScoreboard();
    updateScoreboard();
    update();
}

handleNameInput();

// Event listener for the Start Game button
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', function () {
    playerName = document.getElementById('name-input').value;
    if (playerName.trim() !== '') {
        handleNameInput();
        startButton.disabled = true;
        document.getElementById('name-input').disabled = true;
        gameInterval = setInterval(update, 10);
    } else {
        alert('Please enter a valid name.');
    }

    // Refresh the page when Start button is pressed
    startButton.addEventListener('click', function () {
        window.location.reload();
    });
});
