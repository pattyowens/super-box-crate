/*jshint esversion: 6 */
// @ts-check

import { Platform } from "./boundaries.js";
import { Wall } from "./boundaries.js";
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
 * Wrapper for drawing all objects, establishes draw order
 */
function drawAll() {
    drawMap();
    hero.draw(context);
}


let title = /** @type {TitleScreen} */ new TitleScreen();

let runGame = false;
let lastTime; // undefined by default
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
        if (platforms !== undefined) hero.update(canvas, platforms);
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