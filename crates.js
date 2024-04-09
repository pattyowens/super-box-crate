/*jshint esversion: 6 */
// @ts-check
import { Platform } from "./boundaries.js";

// A playable character
/**
 * @type {object}
 */
export class Crate {
    constructor() {
        let rows = [80, 200, 350, 440, 580];
        this.x = 50 + Math.random() * 700;
        this.y = rows[Math.floor(Math.random() * rows.length)];
        this.length = 20;
        this.moveDown = true;
        this.vy = 0;
        this.ay = 0.3;
    }
    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.fillStyle = "brown";
        context.fillRect(0, 0, this.length, this.length);
        context.restore();
    }

    /**
     * Update the character's position based on movement flags.
     * @param {HTMLCanvasElement} canvas 
     * @param {[Platform]} platforms 
     */
    update(canvas, platforms) {
        if (this.moveDown) {
            if (this.vy <= 5) this.vy += this.ay;
            this.y += this.vy;
        }

        let stopFall = false;
        let crate = this;
        platforms.forEach(function (platform) {
            // Check for collision of character and floor
            if (stopFall == false) {
                if ((crate.y + crate.length) > platform.y && (crate.y - crate.length) < (platform.y + platform.height) && (crate.x + crate.length) > platform.x && (crate.x) < (platform.x + platform.width)) {
                    stopFall = true;
                    crate.moveDown = false;
                    if (crate.y > platform.y + platform.height / 2) {
                        crate.y = platform.y + platform.height + crate.length;
                    } 
                    else crate.y = platform.y - crate.length;
                    crate.vy = 0;
                }
            }
        })
        if (!stopFall) this.moveDown = true;
    }

}