import { StartInterface } from "./startInterface.js";

export class Browser {

    public readonly mainContainer: HTMLElement = document.getElementById('main-app')!;

    public startInterface!: StartInterface;

    constructor() {

        this.initStartInterface();

    }

    /**
     * @description renders and initializes the start interface.
     */
    public initStartInterface(): void {

        this.startInterface = new StartInterface(this.mainContainer);
        this.startInterface.render();
        
    }

}
