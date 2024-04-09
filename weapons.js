/*jshint esversion: 6 */
// @ts-check

import { Platform } from "./boundaries.js";

/**
 * A weapon
 * @type {object}
 */
export class Weapon {
    constructor(name, fireRate = 1) {
        this.name = name;
        this.fireRate = fireRate;
        this.firing = false;
        this.timeDown = 0;
        // Setup keyboard events
        this.setupKeyboardEvents();
    }
    /**
     * Set up the keyboard events to listen for the 'W', 'A', and 'D' keys.
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case ' ':
                    this.firing = true;
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch(event.key) {
                case ' ': // Stop moving left
                    this.firing = false;
                    this.timeDown = 0;
                    break;
            }
        });
    }
}

/**
 * A bullet
 * @type {object}
 */
export class Bullet {
    constructor(x, y, vx, vy = 0, size = 2) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = size;
    }

    /**
     * Update the bullet's position
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.fillStyle = "gray";
        context.moveTo(0, 0);
        context?.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context?.closePath();
        context.fill();
        context.restore();

    }
}