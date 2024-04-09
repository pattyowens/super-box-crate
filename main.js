/*jshint esversion: 6 */
// @ts-check

import { Platform } from "./boundaries.js";
import { Wall } from "./boundaries.js";
import { Crate } from "./crates.js";
import { PlayableCharacter } from "./playableCharacter.js";
import { TitleScreen } from "./titleScreen.js";


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
    [0.00 * width, 0.00 * height, width / 2 - 20], // left ceiling
    [0.50 * width + 20, 0.00 * height, width / 2 - 20], // right ceiling
    [0.00 * width, 1.00 * height - 20, width / 2 - 20], // left floor
    [0.50 * width + 20, 1.00 * height - 20, width / 2 - 20] // right floor
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

// TODO: Define invisible floors that only npcs can pass through


// TODO: Define the Playable Character
let hero = /** @type {PlayableCharacter} */ new PlayableCharacter();

/**
 * Draw our map
 */
function drawMap() {
    context?.save();
    context.fillStyle = "brown";
    context?.fillRect(0.50 * width - 20, canvas.height - 20, 40, 10);
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

function drawScore() {
    context?.save();
    context?.translate(30, 50);
    context.fillStyle = "black";
    context.font = "36px serif";
    context.fillText("Score: " + score, 0, 0, 500);
    context?.restore()
}

// Debugging board
function drawBoard(){
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
 * Wrapper for drawing all objects, establishes draw order
 */
function drawAll() {
    drawMap();
    drawScore();
    drawBoard();
    drawCrates();

    hero.draw(context);
}

function collectCrate() {
    for (let i = crates.length - 1; i >= 0; i--) {
        if (hero.x + hero.radius > crates[i].x && hero.x - hero.radius < crates[i].x + crates[i].length && hero.y + hero.radius > crates[i].y && hero.y - hero.radius < crates[i].y + crates[i].length) {
            crates.splice(i);
            score++;
        }
    }
}


let title = /** @type {TitleScreen} */ new TitleScreen();

let runGame = false;
let lastTime; // undefined by default
let crates = /** @type {Crate} */ [];
crates.push(new Crate());
let score = 0;
/**
 * Where we render the game
 * @param {*} timestamp 
 */
function loop(timestamp) {
    // Time step 
    const delta = (lastTime ? timestamp-lastTime : 0) * 1000.0/60.0;
    context?.clearRect(0, 0, width, height);

    if (!runGame && !title.visible) runGame = true;
    if (runGame) {
        // Space to do the work
        if (crates.length == 0) {
            crates.push(new Crate());
        }
        if (platforms !== undefined && crates !== undefined) {
            hero.update(canvas, platforms);
            crates.forEach(function (crate) {
                crate.update(canvas, platforms);
            })
            collectCrate();
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