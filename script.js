const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Load the spaceship images
const ballImage = new Image();
ballImage.src = 'C:/Users/steff/OneDrive/Desktop/MiniGame/spaceShip.png';
const ballImageWithStar = new Image();
ballImageWithStar.src = 'C:/Users/steff/OneDrive/Desktop/MiniGame/spaceShipWithStar.png';

// Load the enemy spaceship image
const enemyImage = new Image();
enemyImage.src = 'C:/Users/steff/OneDrive/Desktop/MiniGame/enemyShip.png';

// Load the goal image
const goalImage = new Image();
goalImage.src = 'C:/Users/steff/OneDrive/Desktop/MiniGame/goal.png';

ballImage.onload = function () {
    console.log('Image loaded successfully');
};

ballImage.onerror = function () {
    console.error('Failed to load the image. Please check the path and ensure the image exists.');
};

ballImageWithStar.onload = function () {
    console.log('Image with star loaded successfully');
};

ballImageWithStar.onerror = function () {
    console.error('Failed to load the image with star. Please check the path and ensure the image exists.');
};

enemyImage.onload = function () {
    console.log('Enemy image loaded successfully');
};

enemyImage.onerror = function () {
    console.error('Failed to load the enemy image. Please check the path and ensure the image exists.');
};

goalImage.onload = function () {
    console.log('Goal image loaded successfully');
};

goalImage.onerror = function () {
    console.error('Failed to load the goal image. Please check the path and ensure the image exists.');
};

function drawBall() {
    if (ball.hasStar) {
        context.drawImage(ballImageWithStar, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    } else {
        context.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    }
}

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    dx: 5,
    dy: 5,
    canShoot: true,
    moving: false,
    hasStar: false // Indicates if the ball has picked up the star
};

let enemies = [];
const enemyRadius = 10;
const enemySpeed = 1;

let bullets = [];
const bulletSpeed = 7;
const bulletRadius = 5;
let shootInterval = 1000; // Start with 1 bullet per second
const percentageDecrease = 0.10; // 10% decrease

const enemyColors = ['#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#800080']; // Colors for health levels

let score = 0; // Score variable
let highScore = 0; // High score variable
let starsSaved = 0; // Variable to keep track of saved stars
let isGameOver = false; // Game over state variable

let star = {}; // Star object
const starRadius = 10; // Star size
let goal = {}; // Goal object
const goalSize = 80; // Goal size

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8; // Adjust to fit 80% of window width
    canvas.height = window.innerHeight * 0.8; // Adjust to fit 80% of window height
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createEnemy() {
    console.log('Creating enemy...');
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    enemies.push({ x, y, health: 1, respawnCount: 0, color: enemyColors[0] });
    console.log('Enemy created at', x, y);
}

function getColorByHealth(health) {
    return enemyColors[Math.min(health - 1, enemyColors.length - 1)];
}

function createStar() {
    console.log('Creating star...');
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    star = { x, y };
    console.log('Star created at', x, y);
}

function createGoal() {
    console.log('Creating goal...');
    goal = { x: canvas.width - goalSize - 10, y: canvas.height - goalSize - 10 }; // Position goal in the bottom right corner
    console.log('Goal created at', goal.x, goal.y);
}

function drawBall() {
    if (ball.hasStar) {
        context.drawImage(ballImageWithStar, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    } else {
        context.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        context.save(); // Save the current context state
        context.beginPath();
        context.arc(enemy.x, enemy.y, enemyRadius, 0, Math.PI * 2); // Create a circular clipping path
        context.closePath();
        context.clip(); // Clip to the circular path
        context.drawImage(enemyImage, enemy.x - enemyRadius, enemy.y - enemyRadius, enemyRadius * 2, enemyRadius * 2); // Draw the image
        context.restore(); // Restore the context to the previous state
    });
}

function drawBullets() {
    context.fillStyle = '#FFFF00';
    bullets.forEach(bullet => {
        context.beginPath();
        context.arc(bullet.x, bullet.y, bulletRadius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    });
}

function drawStar() {
    if (!ball.hasStar) {
        context.beginPath();
        context.moveTo(star.x, star.y - starRadius);
        for (let i = 1; i < 5; i++) {
            context.lineTo(star.x + starRadius * Math.cos((Math.PI * 2 * i) / 5 - Math.PI / 2),
                star.y + starRadius * Math.sin((Math.PI * 2 * i) / 5 - Math.PI / 2));
        }
        context.closePath();
        context.fillStyle = '#FFD700'; // Gold color
        context.fill();
    }
}

// Adjust goal position to be centered on the right side
function createGoal() {
    console.log('Creating goal...');
    goal = {
        x: canvas.width - goalSize - 20, // Positioned 20 pixels from the right edge
        y: (canvas.height - goalSize) / 2 // Centered vertically
    };
    console.log('Goal created at', goal.x, goal.y);
}

function drawGoal() {
    context.drawImage(goalImage, goal.x, goal.y, goalSize, goalSize);
}

function drawScore() {
    context.font = '20px Arial';
    context.fillStyle = '#FFFFFF';
    context.textAlign = 'left'; // Ensure left alignment
    context.fillText(`Score: ${score}`, 25, 20);
    context.fillText(`Bullet Speed: ${(1000 / shootInterval).toFixed(2)} bullets/sec`, 25, 50); // Display bullet speed
    context.fillText(`High Score: ${highScore}`, 25, 80); // Display high score
    context.fillText(`Stars Saved: ${starsSaved}`, 25, 110); // Display stars saved
}

function drawGameOver() {
    context.font = '30px Arial';
    context.fillStyle = '#FF0000';
    context.textAlign = 'center';
    context.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 60);
    context.fillText(`Your score: ${score}`, canvas.width / 2, canvas.height / 2);
    context.fillText(`High score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 60);
}

function moveEnemies() {
    enemies.forEach(enemy => {
        const angle = Math.atan2(ball.y - enemy.y, ball.x - enemy.x);
        enemy.x += enemySpeed * Math.cos(angle);
        enemy.y += enemySpeed * Math.sin(angle);
    });
}

function moveBullets() {
    bullets.forEach(bullet => {
        bullet.x += bulletSpeed * Math.cos(bullet.angle);
        bullet.y += bulletSpeed * Math.sin(bullet.angle);
    });
}

function checkCollision() {
    console.log('Checking collisions...');
    // Check collision between ball and enemies
    for (let enemy of enemies) {
        const dist = Math.hypot(ball.x - enemy.x, ball.y - enemy.y);
        if (dist < ball.radius + enemyRadius) {
            if (score > highScore) {
                highScore = score; // Update high score if the current score is higher
            }
            isGameOver = true; // Set game-over state
            setTimeout(resetGame, 2000); // Set timeout to reset the game after 2 seconds
            return;
        }
    }

    // Check collision between ball and star
    if (!ball.hasStar && Math.hypot(ball.x - star.x, ball.y - star.y) < ball.radius + starRadius) {
        ball.hasStar = true; // Ball picks up the star
        console.log('Ball has picked up the star');
    }

    // Check collision between ball and goal
    if (ball.hasStar && ball.x > goal.x && ball.x < goal.x + goalSize && ball.y > goal.y && ball.y < goal.y + goalSize) {
        ball.hasStar = false; // Ball reaches the goal with the star
        score += 10; // Increase score by 10 points
        starsSaved += 1; // Increment stars saved
        createStar(); // Create a new star
        updateShootInterval(); // Update shooting interval based on score
        console.log('Star delivered to the goal');
    }

    if (!isGameOver) {
        // Check collision between bullets and enemies
        bullets = bullets.filter(bullet => {
            let hit = false;
            enemies = enemies.map(enemy => {
                const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
                if (dist < bulletRadius + enemyRadius) {
                    hit = true;
                    enemy.health -= 1;
                    if (enemy.health <= 0) {
                        // Respawn enemy with increased health
                        let newX, newY;
                        do {
                            newX = Math.random() * canvas.width;
                            newY = Math.random() * canvas.height;
                        } while (Math.hypot(newX - enemy.x, newY - enemy.y) < Math.min(canvas.width, canvas.height) / 2);
                        enemy.x = newX;
                        enemy.y = newY;
                        enemy.respawnCount += 1;
                        enemy.health = enemy.respawnCount + 1;
                        enemy.color = getColorByHealth(enemy.health);
                        score += 1; // Increment score
                        updateShootInterval(); // Update shooting interval based on score
                    } else {
                        // Update color based on current health
                        enemy.color = getColorByHealth(enemy.health);
                    }
                }
                return enemy;
            });
            return !hit; // Remove the bullet if it hit an enemy
        });
    }
}

function resetGame() {
    console.log('Resetting game...');
    score = 0;
    starsSaved = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.hasStar = false;
    enemies = [];
    bullets = [];
    isGameOver = false; // Reset game-over state
    initGameObjects();
    updateShootInterval();
    draw(); // Ensure draw call to reset canvas
    console.log('Game reset.');
}

function updateShootInterval() {
    const intervalReduction = Math.floor(score / 5) * percentageDecrease;
    shootInterval = Math.max(300, 1000 * (1 - intervalReduction)); // Ensure interval doesn't go below 300ms
}

function moveBall(event) {
    ball.moving = true;
    switch (event.key) {
        case 'ArrowUp':
            ball.y -= ball.dy;
            if (ball.y - ball.radius < 0) ball.y = ball.radius;
            break;
        case 'ArrowDown':
            ball.y += ball.dy;
            if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
            break;
        case 'ArrowLeft':
            ball.x -= ball.dx;
            if (ball.x - ball.radius < 0) ball.x = ball.radius;
            break;
        case 'ArrowRight':
            ball.x += ball.dx;
            if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
            break;
    }
    draw();
}

function shootBullet() {
    if (ball.canShoot && enemies.length > 0) {
        // Find the closest enemy
        let closestEnemy = enemies[0];
        let minDist = Math.hypot(ball.x - closestEnemy.x, ball.y - closestEnemy.y);

        enemies.forEach(enemy => {
            const dist = Math.hypot(ball.x - enemy.x, ball.y - enemy.y);
            if (dist < minDist) {
                closestEnemy = enemy;
                minDist = dist;
            }
        });

        // Shoot towards the closest enemy
        const angle = Math.atan2(closestEnemy.y - ball.y, closestEnemy.x - ball.x);
        bullets.push({
            x: ball.x,
            y: ball.y,
            angle: angle
        });
        ball.canShoot = false;
        setTimeout(() => ball.canShoot = true, shootInterval);
    }
}

function draw() {
    // Clear the canvas with a darker background color
    context.fillStyle = '#001f3f'; // Dark blue color to represent the night sky
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawBall();
    drawEnemies();
    drawBullets();
    drawScore(); // Draw the score and bullet speed
    drawStar(); // Draw the star
    drawGoal(); // Draw the goal

    if (isGameOver) {
        drawGameOver(); // Draw the game-over message
    }
}

function update() {
    console.log('Updating game...');
    if (!isGameOver) {
        moveEnemies();
        moveBullets();
        checkCollision();
    }
    draw();
    if (ball.moving) {
        shootBullet();
        ball.moving = false;
    }
    requestAnimationFrame(update);
}

function initGameObjects() {
    console.log('Initializing game objects...');
    for (let i = 0; i < 5; i++) {
        createEnemy();
    }
    createStar(); // Create the first star
    createGoal(); // Create the goal
    console.log('Game objects initialized.');
}

function initGame() {
    console.log('Initializing the game...');
    initGameObjects();
    console.log('Game initialized.');
    update();
}

document.addEventListener('keydown', moveBall);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    ball.moving = true;
    if (touch.clientX > ball.x) {
        ball.x += ball.dx;
        if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
    } else {
        ball.x -= ball.dx;
        if (ball.x - ball.radius < 0) ball.x = ball.radius;
    }
    if (touch.clientY > ball.y) {
        ball.y += ball.dy;
        if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
    } else {
        ball.y -= ball.dy;
        if (ball.y - ball.radius < 0) ball.y = ball.radius;
    }
    draw();
}, false);

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    ball.moving = true;
    ball.x = touch.clientX;
    ball.y = touch.clientY;
    if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
    if (ball.x - ball.radius < 0) ball.x = ball.radius;
    if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
    if (ball.y - ball.radius < 0) ball.y = ball.radius;
    draw();
}, false);

function startGame() {
    console.log('Starting the game...');
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    initGame();
}

function showHowToPlay() {
    document.getElementById('howToPlay').style.display = 'block';
}

function closeHowToPlay() {
    document.getElementById('howToPlay').style.display = 'none';
}
