/*jshint esversion: 6 */
// @ts-check


// A platform
/**
 * @type {object}
 */
export class Platform {
    /**
     * 
     * @param {number} x
     * @param {number} y     
     * @param {number} width
     * @param {number} height
     * @param {string} color
     */
    constructor(x, y, width = 50, height = 10, color = "black" ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
 
    /**
     * Draw the platform 
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.width, this.height);

        context.restore();
    }

}