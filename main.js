/*jshint esversion: 6 */
// @ts-check

import { Platform } from "./boundaries.js";
import { Wall } from "./boundaries.js";
import { Crate } from "./crates.js";
import { PlayableCharacter } from "./playableCharacter.js";
import { TitleScreen } from "./titleScreen.js";
import { Enemy } from "./enemies.js";
import { Bullet } from "./weapons.js";


/**
 * Set up the UI
 */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context = /** @type {CanvasRenderingContext2D} */ canvas.getContext("2d");

// Define our Map Platforms
let width = canvas.width;
let height = canvas.height;
let plat_points = [
    [0.25 * width, 0.20 * height, width / 2],    // Upper central
    [0.00 * width, 0.35 * height, width / 3],    // mid1 left
    [2/3 * width, 0.35 * height, width / 3],    // mid1 right
    [0.25 * width, 0.50 * height, width / 2],    // mid2 central
    [0.00 * width, 0.65 * height, width / 3],    // mid1 left
    [2/3 * width, 0.65 * height, width / 3],    // mid1 right
    [0.25 * width, 0.80 * height, width / 2],    // Bottom central
    [0.00 * width, 0.00 * height, width / 2 - 60], // left ceiling
    [0.50 * width + 60, 0.00 * height, width / 2 - 60], // right ceiling
    [0.00 * width, 1.00 * height - 20, width / 2 - 40], // left floor
    [0.50 * width + 40, 1.00 * height - 20, width / 2 - 40] // right floor
];
let platforms = /** @type {[Platform]} */ [];
plat_points.forEach(function (p) {
    platforms.push(new Platform(p[0], p[1], p[2], p[3]));
})

// Define Map Walls
let wall_points = [
    [0.00 * width, 0.00 * height, 20, height],   // Left wall
    [1.00 * width - 20, 0.00 * height, 20, height]    // Right wall
];
let walls = /** @type {[Wall]} */ [];
wall_points.forEach(function (w) {
    walls.push(new Wall(w[0], w[1], w[2], w[3]));
});


/**
 * Draw our map
 */
function drawMap() {
    context?.save();
    context.fillStyle = "brown";
    context?.fillRect(0.50 * width - 40, canvas.height - 20, 80, 10);
    context?.restore();

    platforms.forEach(function (platform) {
        platform.draw(context);
    })

    walls.forEach(function (wall) {
        wall.draw(context);
    });
}

/**
 * Draw the crate
 * - Support multiple crates if we wanna get crazy later on
 */
function drawCrates() {
    crates.forEach(function (crate) {
        crate.draw(context);
    })
}

/**
 * Draw the Score & Session hi-score
 */
function drawScore() {
    context?.save();
    context?.translate(30, 50);
    context.fillStyle = "black";
    context.font = "36px serif";
    if (highestScore !== 0) {
        context.fillText("Best:   " + highestScore, 0, 0, 500);
        context?.translate(0, 30);
    }
    context.fillText("Score: " + score, 0, 0, 500);
    
    context?.restore()
}

// Debugging grid - Got this from a stack overflow thread
function drawBoard() {
    context?.save();
    let p = 0;
    for (var x = 0; x <= canvas.width; x += 40) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, canvas.height + p);
    }

    for (var x = 0; x <= canvas.height; x += 40) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(canvas.width + p, 0.5 + x + p);
    }
    context.strokeStyle = "black";
    context.stroke();
    context?.restore();
}

/**
 * Wrapper to render each bullet
 */
function drawBullets() {
    bullets.forEach(function (bullet) {
        bullet.draw(context);
    })
}

/**
 * Wrapper to render each enemy
 */
function drawEnemies() {
    enemies.forEach(function (enemy) {
        enemy.draw(context);
    })
}

/**
 * Wrapper for drawing all objects, establishes draw order
 */
function drawAll() {
    drawMap();
    drawScore();
    //drawBoard();
    drawCrates();
    drawBullets();
    drawEnemies();
    hero.draw(context);
}

/**
 * Detect if a crate has been collected by the player
 */
function collectCrate() {
    for (let i = crates.length - 1; i >= 0; i--) {
        if (hero.x + hero.radius > crates[i].x && hero.x - hero.radius < crates[i].x + crates[i].length && hero.y + hero.radius > crates[i].y && hero.y - hero.radius < crates[i].y + crates[i].length) {
            crates.splice(i, 1);
            hero.randomGun();
            score++;
        }
    }
}

/**
 * Handle the collision of bullets with the platforms, wall, ceilings, and enemies
 */
function bulletCollision() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        // Left wall
        if (bullets[i].x - bullets[i].radius < 20) {
            bullets.splice(i, 1);
            continue;
        }
        // Right wall
        if (bullets[i].x + bullets[i].radius > canvas.width - 20) {
            bullets.splice(i, 1);
            continue;
        }
        // Invisible Ceiling
        if (bullets[i].y - bullets[i].radius < 20) {
            bullets.splice(i, 1);
            continue;
        }
        // Invisible Floor
        if (bullets[i].y + bullets[i].radius > canvas.height - 20) {
            bullets.splice(i, 1);
            continue;
        }
        let remove = false;
        platforms.forEach(function (platform) {
        // Check for collision of bullet and floor
            if ((bullets[i].y + bullets[i].radius) > platform.y && (bullets[i].y - bullets[i].radius) < (platform.y + platform.height) && (bullets[i].x + bullets[i].radius) > platform.x && (bullets[i].x - bullets[i].radius) < (platform.x + platform.width)) {
                remove = true;
            }
        });
        if (!remove) for (let j = enemies.length - 1; j >= 0; j--) {
            if ((bullets[i].y + bullets[i].radius) > enemies[j].y - enemies[j].radius && (bullets[i].y - bullets[i].radius) < (enemies[j].y + enemies[j].radius) && (bullets[i].x + bullets[i].radius) > enemies[j].x - enemies[j].radius && (bullets[i].x - bullets[i].radius) < (enemies[j].x + enemies[j].radius)) {
                remove = true;
                enemies.splice(j, 1);
            }
        }
        if (remove) bullets.splice(i, 1);
    }
}

/**
 * Determine if the character is dead!
 * @returns {Boolean} - True if player should die
 */
function isDead() {
    for (let i = 0; i < enemies.length; i++) {
        if ((hero.y + hero.radius) > enemies[i].y - enemies[i].radius && (hero.y - hero.radius) < (enemies[i].y + enemies[i].radius) && (hero.x + hero.radius) > enemies[i].x - enemies[i].radius && (hero.x - hero.radius) < (enemies[i].x + enemies[i].radius)){
            return true;
        }
    }
    return false;
}

/**
 * Clear an array of undefined object
 * @param {Object[]} array 
 */
function clearObjectArray(array) {
    if (array.length > 0) array.splice(0);
}

/**
 * Handle the different elemenets required for ending the current game and 
 * returning to the title to start a new one 
 */
function endGame() {
    if (score > highestScore) highestScore = score;
    score = 0;
    runGame = false;
    clearObjectArray(crates);
    clearObjectArray(bullets);
    clearObjectArray(enemies);
    hero = new PlayableCharacter();
    title.showTitle();
}

// Spawn a new crate if none are on the field
function spawnCrate() {
    if (crates.length == 0) {
        crates.push(new Crate());
    }
}

// Spawn another enemy if under maximum for level
function spawnEnemy() {
    if (timeSinceLastSpawn > (3 - (score - enemies.length) * 0.5)) {
        timeSinceLastSpawn = 0;
        if (enemies.length < score + 1) {
            let speed = 4 + Math.floor(score * Math.random() / 3);
            let size = speed * 2;
            if (size > 20) size = 20;
            let modifier = (speed - 4) * 30;
            if (modifier > 255) modifier = 255;
            let red = 255 - modifier;
            let green = modifier;
            let color = "rgb(" + red + ", " + green + ", 0)";
            enemies.push(new Enemy(speed, size, color));
        }
    }
}

let hero = /** @type {PlayableCharacter} */ new PlayableCharacter();
let title = /** @type {TitleScreen} */ new TitleScreen();
let runGame = false;
let lastTime;
let crates = /** @type {Crate} */ [];
let bullets = /** @type {Bullet} */ [];
let enemies = /** @type {Enemy} */ [];
let score = 0;
let highestScore = 0;
let timeSinceLastSpawn = 0;


/**
 * Where we run the game
 * @param {number} timestamp 
 */
function loop(timestamp) {
    // Time step 
    if (lastTime === undefined) lastTime = 0;
    const delta = (timestamp-lastTime) / 1000;
    let adjDelta = delta * 50;
    lastTime = timestamp;
    timeSinceLastSpawn += delta;

    context?.clearRect(0, 0, width, height);

    if (!runGame && !title.visible) runGame = true;
    if (runGame) {
        // Space to do the work
        spawnCrate();
        spawnEnemy();
        if (platforms !== undefined && crates !== undefined && bullets !== undefined && enemies !== undefined) {
            hero.update(canvas, platforms, adjDelta);
            crates.forEach(function (crate) {
                crate.update(canvas, platforms);
            })
            collectCrate();
            enemies.forEach(function (enemy) {
                enemy.update(canvas, platforms, adjDelta);
            })
            hero.fireGun(delta, adjDelta, bullets);
            bullets.forEach(function (bullet) {
                bullet.update(adjDelta);
            })
            bulletCollision();
            // EndGame conditions
            if (isDead()) endGame();
        }
    }
    // Now we can render
    drawAll();
    if (!runGame) {
        title.draw(context);
    }
    
    // and loop
    window.requestAnimationFrame(loop);
}
// Start the loop wih the first iteration
window.requestAnimationFrame(loop);