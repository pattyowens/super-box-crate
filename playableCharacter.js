/*jshint esversion: 6 */
// @ts-check
import { Platform } from "./boundaries.js";
import { Crate } from "./crates.js";

// A playable character
/**
 * @type {object}
 */
export class PlayableCharacter {
    /**
     * @param {number} x - The starting x position
     * @param {number} y - The starting y position
     * @param {number} speed - The movement speed
     */
    constructor(x = 400, y = 350, speed = 6) {
        this.x = x; // Default x position
        this.y = y; // Default y position
        this.speed = speed; // Default speed
        this.radius = 12;

        // Movement direction
        this.moveLeft = false;
        this.moveRight = false;
        this.moveDown = true;
        this.vy = 0;
        this.ay = 0.4;

        // Setup keyboard events
        this.setupKeyboardEvents();
    }

    /**
     * Set up the keyboard events to listen for the 'W', 'A', and 'D' keys.
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'a': // Move left
                    this.moveLeft = true;
                    break;
                case 'd': // Move right
                    this.moveRight = true;
                    break;
                case 'w': // Move up
                    this.vy = -12;
                    this.moveDown = true;
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch(event.key) {
                case 'a': // Stop moving left
                    this.moveLeft = false;
                    break;
                case 'd': // Stop moving right
                    this.moveRight = false;
                    break;
            }
        });
    }

    /**
     * Update the character's position based on movement flags.
     * @param {HTMLCanvasElement} canvas 
     * @param {[Platform]} platforms 
     */
    update(canvas, platforms) {
        let stopFall = false;
        if (this.moveLeft) this.x -= this.speed;
        if (this.moveRight) this.x += this.speed;
        if (this.moveDown) {
            if (this.vy <= 8) this.vy += this.ay;
            this.y += this.vy;
        }

        // Now we do our collision detection
        // Left wall
        if (this.x - this.radius < 20) {
            this.moveLeft = false;
            this.x = 20 + this.radius;
        }
        // Right wall
        if (this.x + this.radius > canvas.width - 20) {
            this.moveright = false;
            this.x = canvas.width - 20 - this.radius;
        }
        // Invisible Ceiling
        if (this.y - this.radius < 20) {
            this.y = 20 + this.radius;
            this.vy = 0;
        }
        // Invisible Floor
        if (this.y + this.radius > canvas.height - 20) {
            this.y = canvas.height - 20 - this.radius;
            this.vy = 0;
        }

        let hero = this;
        platforms.forEach(function (platform) {
            // Check for collision of character and floor
            if (stopFall == false) {
                if ((hero.y + hero.radius) > platform.y && (hero.y - hero.radius) < (platform.y + platform.height) && (hero.x + hero.radius) > platform.x && (hero.x - hero.radius) < (platform.x + platform.width)) {
                    stopFall = true;
                    hero.moveDown = false;
                    if (hero.y > platform.y + platform.height / 2) {
                        hero.y = platform.y + platform.height + hero.radius;
                    } 
                    else hero.y = platform.y - hero.radius;
                    hero.vy = 0;
                }
            }
        })
        if (!stopFall) this.moveDown = true;
    }

    /**
     * Draw the hero
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        // Then draw
        context.save();
        context.translate(this.x, this.y);
        context.fillStyle = "red";
        context.moveTo(0, 0);
        context?.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context?.closePath();
        context.fill();
        context.restore();
    }

}