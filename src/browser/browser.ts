import { IDimension } from "../common/UI/domNode.js";
import { GameInterface } from "./gameInterface.js";
import { StartInterface } from "./startInterface.js";

export class Browser {

    public readonly mainContainer: HTMLElement = document.getElementById('main-app')!;

    public startInterface!: StartInterface;
    public gameInterface!: GameInterface;

    public static readonly size: IDimension = {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
    };

    constructor() {
        this.init();
    }

    /**
     * @description renders and initializes the start interface.
     */
    public init(): void {

        this.startInterface = new StartInterface(this.mainContainer);
        this.startInterface.render();
        
        StartInterface.onDidClickStartButton(() => {
            
            this.startInterface.destroy();
            this.gameInterface = new GameInterface(this.mainContainer);
            this.gameInterface.render();
            
        });

    }

}
