/*jshint esversion: 6 */
// @ts-check

import { Platform } from "./boundaries.js";

// TODO - Implement enemies
/**
 * @type {object}
 */
export class Enemy {
    constructor(speed = 4, size = 8, color = "red") {
        this.x = 400;
        this.y = 0;
        this.speed = speed;
        if (Math.random() > 0.5) this.direction = 1;
        else this.direction = -1;
        this.vy = 0;
        this.ay = 0.5;
        
        this.radius = size;
        this.color = color;
    }


    /**
     * Update the enemy's position 
     * @param {HTMLCanvasElement} canvas 
     * @param {[Platform]} platforms 
     * @param {number} delta
     */
    update(canvas, platforms, delta) {
        let stopFall = false;
        this.x += this.speed * this.direction * delta;
        if (this.moveDown) {
            if (this.vy <= 8) this.vy += this.ay;
            this.y += this.vy * delta;
        }

        // Now we do our collision detection
        // Left wall
        if (this.x - this.radius < 20) {
            this.switchDirection();
            this.x = 20 + this.radius;
        }
        // Right wall
        if (this.x + this.radius > canvas.width - 20) {
            this.switchDirection();
            this.x = canvas.width - 20 - this.radius;
        }
        // Invisible Floor
        if (this.y - this.radius > canvas.height) {
            this.y = 0 - this.radius;
        }

        let enemy = this;
        platforms.forEach(function (platform) {
            // Check for collision of character and floor
            if (stopFall == false) {
                if ((enemy.y + enemy.radius) > platform.y && (enemy.y - enemy.radius) < (platform.y + platform.height) && (enemy.x + enemy.radius) > platform.x && (enemy.x - enemy.radius) < (platform.x + platform.width)) {
                    stopFall = true;
                    enemy.moveDown = false;
                    if (enemy.y > platform.y + platform.height / 2) {
                        enemy.y = platform.y + platform.height + enemy.radius;
                    } 
                    else enemy.y = platform.y - enemy.radius;
                    enemy.vy = 0;
                }
            }
        })
        if (!stopFall) this.moveDown = true;
    }

    /**
     * Switch the enemy's x-direction
     */
    switchDirection() {
        this.direction = this.direction * -1;
    }


    /**
     * Draw the Enemy
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        // Then draw
        context.save();
        context.translate(this.x, this.y);
        context.fillStyle = this.color;
        context.moveTo(0, 0);
        context?.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context?.closePath();
        context.fill();
        context.restore();
    }
}