/*jshint esversion: 6 */
// @ts-check

/**
 * Set up the UI
 */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let context = canvas.getContext("2d");


function draw() {

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
    draw();
    // and loop
    window.requestAnimationFrame(loop);
}
// Start the loop wih the first iteration
window.requestAnimationFrame(loop);