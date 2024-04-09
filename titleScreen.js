/*jshint esversion: 6 */
// @ts-check

// A Title Screen
/**
 * @type {object}
 */
export class TitleScreen {
    constructor() {
        this.visible = true;

        // Setup keyboard events
        this.setupKeyboardEvents();
    }

    /**
     * Set up the keyboard events to listen for the enter key
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'KeyP':
                    this.visible = false;
                    break;
            }
        });
    }

    /**
     * Toggle to enable the title screen
     */
    showTitle() {
        this.visible = true;
    }

    /**
     * Draw the Title Screen
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.save();
        context.fillStyle = "rgba( 110, 110, 110, 0.5)"
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();

        context.save();
        context.translate(250, 250);
        context.font = "48px serif";
        context.fillStyle = "blue"
        context.fillText("Super Box Crate", 0, 0, 500);
        context.translate(34, 75);
        context.font = "36px serif";
        context.fillText("Press 'p' to play!", 0, 0, 500);
        context.restore();
    }

}