/*jshint esversion: 6 */
// @ts-check

import { Platform } from "./boundaries.js";


/**
 * Set up the UI
 */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let context = /** @type {CanvasRenderingContext2D} */ canvas.getContext("2d");

// Define our initial map
let width = canvas.width;
let height = canvas.height;
let plat_points = [
    [0.25 * width, 0.20 * height, width / 2],    // Upper central
    [0.10 * width, 0.35 * height, width / 4],    // mid1 left
    [0.65 * width, 0.35 * height, width / 4],    // mid1 right
    [0.25 * width, 0.50 * height, width / 2],    // mid2 central
    [0.10 * width, 0.65 * height, width / 4],    // mid1 left
    [0.65 * width, 0.65 * height, width / 4],    // mid1 right
    [0.00 * width, 0.80 * height, width / 5],    // bottom left
    [0.80 * width, 0.80 * height, width / 5],    // bottom right
    [0.25 * width, 0.80 * height, width / 2],    // Bottom central
    [0.00 * width, 0.00 * height, 10, height],   // Left wall
    [1.00 * width - 10, 0.00 * height, 10, height],    // Right wall
    [0.00 * width, 0.00 * height, width / 2 - 20], // left ceiling
    [0.50 * width + 40, 0.00 * height, width / 2 - 20], // right ceiling
    [0.00 * width, 1.00 * height - 10, width / 2 - 20], // left ceiling
    [0.50 * width + 40, 1.00 * height - 10, width / 2 - 20] // right ceiling
];

let platforms = /** @type {[Platform]} */ [];

plat_points.forEach(function (p) {
    platforms.push(new Platform(p[0], p[1], p[2], p[3]));
})

function drawMap() {
    platforms.forEach(function (platform) {
        platform.draw(context);
    })
}

function drawAll() {
    drawMap();
}

let lastTime; // undefined by default
/**
 * Where we render the game
 * @param {*} timestamp 
 */
function loop(timestamp) {
    // Time step 
    const delta = (lastTime ? timestamp-lastTime : 0) * 1000.0/60.0;

    // Space to do the work


    // Now we can render
    drawAll();
    // and loop
    window.requestAnimationFrame(loop);
}
// Start the loop wih the first iteration
window.requestAnimationFrame(loop);