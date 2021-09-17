import { Button } from "../common/UI/button.js";

export class StartInterface {

    public readonly parentContainer: HTMLElement;
    public container: HTMLElement | undefined;

    constructor(parent: HTMLElement) {
        this.parentContainer = parent;
    }

    /**
     * @description render the window
     */
    public render(): void {
        
        this.container = document.createElement('div');
        this.container.id = 'start-interface';
        this.parentContainer.appendChild(this.container);

        const contentContainer = document.createElement('div');
        contentContainer.id = 'start-interface-container';
        this.container.appendChild(contentContainer);

        // buttons

        const startBtn = new Button('start-button', contentContainer);
        startBtn.setClass(['button', 'vertical-center', 'start-button']);
        startBtn.setText('Start');
        startBtn.element.setFontSize(20);

    }

    /**
     * @description destory the window
     */
    public destory(): void {

    }

}