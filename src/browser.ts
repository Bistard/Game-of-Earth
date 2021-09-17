import { Button } from "./common/UI/button.js";

export class Browser {

    public readonly mainContainer: HTMLElement = document.getElementById('mainApp')!;

    constructor() {

        this.initStartInterface();

    }

    /**
     * @description renders and initializes the start interface.
     */
    public initStartInterface(): void {

        const container = document.createElement('div');
        container.id = 'start-interface';
        this.mainContainer.appendChild(container);

        const button = new Button('start-button', container);
        button.setClass(['start-button']);

        
    }

}

new Browser();
