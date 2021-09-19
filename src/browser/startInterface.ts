import { Emitter, sleep } from "../common/event.js";
import { Button } from "../common/UI/button.js";

export class StartInterface {

    private static _onDidClickStartButton = new Emitter<void>();
    public static onDidClickStartButton = StartInterface._onDidClickStartButton.event;

    public readonly parentContainer: HTMLElement;
    public container: HTMLElement | undefined;
    public contentContainer: HTMLElement | undefined;

    constructor(parent: HTMLElement) {
        this.parentContainer = parent;
    }

    public render(): void {
        
        this.container = document.createElement('div');
        this.container.id = 'start-interface';
        this.parentContainer.appendChild(this.container);

        this.contentContainer = document.createElement('div');
        this.contentContainer.id = 'start-interface-container';
        this.container.appendChild(this.contentContainer);

        // buttons

        const startBtn = new Button('start-button', this.contentContainer);
        startBtn.setClass(['button', 'vertical-center', 'start-button']);
        startBtn.setText('Start');
        startBtn.element.setFontSize(20);

        startBtn.addEventListener('click', () => {
            // tell all the listeners the startButton is clicked
            StartInterface._onDidClickStartButton.fire();

        });

    }

    public async destroy(): Promise<void> {
        this.container!.removeChild(this.contentContainer!);
        this.container!.style.backgroundColor = 'white';
        await sleep(1000);
        this.parentContainer.removeChild(this.container!);
    }

}