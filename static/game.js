const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Get the 2D drawing context

const playerImage = new Image();
playerImage.src = 'static/assets/dog.png'; // Replace with the actual URL of the player image

// Get the player's name from the user
//const playerName = prompt("Please enter your name:");
const playerName = "TESTNAME";

//const bulletImage = new Image();
//bulletImage.src = 'static/assets/bullet.png'; // Replace with the actual URL of the bullet image

const bulletSpeed = 10; 
const bulletRadius = 5;

// Store the player's name in sessionStorage
sessionStorage.setItem('playerName', playerName);
//localStorage.setItem('playerName', playerName);

class GameObject {
    constructor(image, x, y, width, height, speed) {
        this.image = image;
        this.xPosition = x;
        this.yPosition = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.keys = {}; // Object to track pressed keys
    }

    update() {
        const dx = ((this.keys.ArrowLeft ? -1 : 0) + (this.keys.ArrowRight ? 1 : 0)) * this.speed;
        const dy = ((this.keys.ArrowUp ? -1 : 0) + (this.keys.ArrowDown ? 1 : 0)) * this.speed;

        // Update the position
        this.xPosition += dx / Math.sqrt(2);
        this.yPosition += dy / Math.sqrt(2);

        // Limit the object's position to stay within the canvas boundaries
        this.xPosition = Math.max(0, Math.min(canvas.width - this.width, this.xPosition));
        this.yPosition = Math.max(0, Math.min(canvas.height - this.height, this.yPosition));
    }

    draw() {
        // Draw the object at the current position
        ctx.drawImage(this.image, this.xPosition, this.yPosition, this.width, this.height);
        //ctx.strokeStyle = 'green'; // Set the border color 
        //ctx.strokeRect(this.xPosition, this.yPosition, this.width, this.height); // Draw the border
    }

    shoot(direction) {
        let bulletX = this.xPosition + this.width / 2;
        let bulletY = this.yPosition + this.height / 2;

        switch (direction) {
            case 'up':
                bulletY -= bulletSpeed;
                break;
            case 'left':
                bulletX -= bulletSpeed;
                break;
            case 'down':
                bulletY += bulletSpeed;
                break;
            case 'right':
                bulletX += bulletSpeed;
                break;
        }

        const newBullet = new Bullet(bulletX, bulletY, bulletSpeed, direction);
        bullets.push(newBullet);
    }
    
}


class Bullet {
    constructor(x, y, speed, direction) {
        this.xPosition = x;
        this.yPosition = y;
        this.speed = speed;
        this.direction = direction;
        this.width = 10; // Adjust bullet width
        this.height = 10; // Adjust bullet height
    }

    update() {
        switch (this.direction) {
            case 'up':
                this.yPosition -= this.speed;
                break;
            case 'left':
                this.xPosition -= this.speed;
                break;
            case 'down':
                this.yPosition += this.speed;
                break;
            case 'right':
                this.xPosition += this.speed;
                break;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.xPosition, this.yPosition, bulletRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'lightgreen'; // Adjust bullet color
        ctx.fill();
        ctx.closePath();
        //ctx.drawImage(bulletImage, this.xPosition, this.yPosition, this.width, this.height);
    }
}

class Enemy extends GameObject {
    constructor(image, x, y, width, height, speed) {
        super(image,x, y, width, height, speed);
        this.directions = ['top', 'left', 'right', 'bottom'];
        this.randomizeDirection();
    }

    randomizeDirection() {
        // Randomly choose a direction from the available directions
        this.direction = this.directions[Math.floor(Math.random() * this.directions.length)];

        // Reset the enemy's position based on the chosen direction
        switch (this.direction) {
            case 'top':
                this.xPosition = Math.random() * (canvas.width - this.width);
                this.yPosition = 0;
                break;
            case 'left':
                this.xPosition = canvas.width;
                this.yPosition = Math.random() * (canvas.height - this.height);
                break;
            case 'right':
                this.xPosition = -this.width;
                this.yPosition = Math.random() * (canvas.height - this.height);
                break;
            case 'bottom':
                this.xPosition = Math.random() * (canvas.width - this.width);
                this.yPosition = canvas.height;
                break;
        }
    }

    update() {
        switch (this.direction) {
            case 'top':
                this.yPosition += this.speed;
                break;
            case 'left':
                this.xPosition -= this.speed;
                break;
            case 'right':
                this.xPosition += this.speed;
                break;
            case 'bottom':
                this.yPosition -= this.speed;
                break;
        }

        // Check if the enemy has moved off the screen, then respawn and randomize the direction
        if (this.direction === 'top' && this.yPosition > canvas.height) {
            this.randomizeDirection();
        } else if (this.direction === 'left' && this.xPosition + this.width < 0) {
            this.randomizeDirection();
        } else if (this.direction === 'right' && this.xPosition > canvas.width) {
            this.randomizeDirection();
        } else if (this.direction === 'bottom' && this.yPosition + this.height < 0) {
            this.randomizeDirection();
        }
    }

    draw() {
        // Draw the object at the current position
        ctx.drawImage(this.image, this.xPosition, this.yPosition, this.width, this.height);
        //ctx.strokeStyle = 'red'; // Set the border color
        //ctx.strokeRect(this.xPosition, this.yPosition, this.width, this.height); // Draw the border
    }
    
}


function randomEnemyImage() {
    let enemyImages = [
        'bat.png',
        'bee.png',
        'cat1.png',
        'cat2.png',
        'spider.png',
        'crab.png'
    ];

    let img = enemyImages[Math.floor(Math.random() * enemyImages.length)];
    let enemyImage = new Image();
    enemyImage.src = 'static/assets/' + img;
    //console.log(img);
    return enemyImage; // Return the created image
}

// Replace with the actual URL of the enemy image

const player = new GameObject(playerImage, canvas.width / 2 - 50, canvas.height / 2 - 35, 100, 70, 5);
let enemies = [
    new Enemy(randomEnemyImage(), canvas.width / 2, canvas.height / 2, 80, 50, 3),
    new Enemy(randomEnemyImage(), canvas.width / 2, canvas.height / 2, 80, 50, 3)
] 

// Function to handle keydown and keyup events
function handleKeyDown(event) {
    if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
        player.shoot(event.key);
    }
    player.keys[event.key] = true;
}

function handleKeyUp(event) {
    player.keys[event.key] = false;
}


let level = 1;
let isGameRunning = true;
const bullets = []

function handleAddNewEnemy(){
    if (level <= 15) {
        let e = new Enemy(randomEnemyImage(), canvas.width / 2, canvas.height / 2, 80, 50, 3);
        enemies.push(e);
    }
    for(e in enemies){
        e.speed *= 1.5;
    }
}

function updateCount() {
    level += 1;
    handleAddNewEnemy();
    //console.log("Count:", level);
}

setInterval(updateCount, 3000);

// Update the count every 10 seconds (10000 milliseconds)
/*if (level <= 3) {
    clearInterval(intervalId)
    intervalId  = setInterval(updateCount, 5000);
}else if (level <= 10){
    clearInterval(intervalId)
    intervalId = setInterval(updateCount, 12000);
}else {
    clearInterval(intervalId)
    intervalId = setInterval(updateCount, 150000);
}*/


function removeEventListeners() {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
}

// Function to add keydown and keyup event listeners
function addEventListeners() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}


function resetGame(collisionFlag) {
    let confirmation = null;
    isGameRunning = false;
    if(collisionFlag){
        confirmation = confirm(`Game Over!\nYour Score: ${level}\nDo you want to play again?`);
    }else{
        confirmation = confirm("Are you sure you want to reset the game?\nCancel to keep playing.");
    }
    
    if (confirmation) {
        enemies = []; // Clear the enemies array
        player.xPosition = canvas.width / 2 - 50; // Reset player's x-position
        player.yPosition = canvas.height / 2 - 35; // Reset player's y-position
        level = 0; // Reset the level
        //clearInterval(intervalId); // Clear the interval used for updating count
        removeEventListeners()
        player.keys = {};
        updateCount(); // Start the count update interval again
        addEventListeners()
        bullets.length = 0;
        isGameRunning = true;
    }else if (collisionFlag){
        window.location.href = '/';
    }else{
        isGameRunning = true;
    }
}


function handleGameOver(){
    //console.log('Player hit by enemy!');
    let finalLevel = level
    resetGame(true) 
    // Send the score to the backend
    // Retrieve the player's name from sessionStorage
    const storedPlayerName = sessionStorage.getItem('playerName');
    let name = storedPlayerName;
    // Use the stored player's name in your game logic
    if (!storedPlayerName) {
        name = 'NA';
    } 
    sendScoreToBackend(finalLevel,name);
}

// Add event listener to the reset button
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', function() {
    resetGame(false);
});


const levelDisplay = document.getElementById('levelDisplay');

function updateLevelDisplay() {
    levelDisplay.textContent = `Level: ${level}`;
}


function checkCollision(object1, object2, overlapAllowance = 25) {
    return (
        object1.xPosition + overlapAllowance < object2.xPosition + object2.width &&
        object1.xPosition + object1.width - overlapAllowance > object2.xPosition &&
        object1.yPosition + overlapAllowance < object2.yPosition + object2.height &&
        object1.yPosition + object1.height - overlapAllowance > object2.yPosition
    );
}



addEventListeners();
// Animation loop to update and redraw the canvas
function animate() {
    if (isGameRunning){
        // Update positions
        player.update();
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].update();
        }
        // Collision check 
        for (let i = 0; i < enemies.length; i++) {
            if (checkCollision(player, enemies[i])) {
                handleGameOver();
                //console.log('Player hit by enemy!');
                // Handle collision behavior here
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the player and enemy objects
        player.draw();
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].draw();
        }
        // Bullet check for collection 

        for (let i = bullets.length - 1; i >= 0; i--) {
            console.log(bullets[i].xPosition);
            bullets[i].update();
            bullets[i].draw();
            console.log(bullets[i].xPosition);
            console.log('------')
            // Remove bullets that are out of canvas
            if (
                bullets[i].xPosition < 0 ||
                bullets[i].xPosition > canvas.width ||
                bullets[i].yPosition < 0 ||
                bullets[i].yPosition > canvas.height
            ) {
                bullets.splice(i, 1);
            }
        }
        
        updateLevelDisplay();
        requestAnimationFrame(animate);
    }
}



function sendScoreToBackend(score,name) {
    // Use XMLHttpRequest, fetch, or other methods to send the score to the Flask backend
    // Example using fetch:
    fetch('/send-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({score: score, name: name })
    })
    .then(response => response.json())
    .then(data => {
        //console.log('Score sent to backend:', data);
    })
    .catch(error => {
        console.error('Error sending score to backend:', error);
    });
}


// Load the images and start the animation loop once they're loaded
Promise.all([playerImage.onload, randomEnemyImage().onload]).then(() => {
    animate();
});
