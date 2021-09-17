import { World } from "../world/world.js";
import { IStartButtonEvent, StartInterface } from "./startInterface.js";

export class Browser {

    
    public readonly mainContainer: HTMLElement = document.getElementById('main-app')!;

    public startInterface!: StartInterface;
    public world!: World;

    constructor() {
        this.init();
    }

    /**
     * @description renders and initializes the start interface.
     */
    public init(): void {

        this.startInterface = new StartInterface(this.mainContainer);
        this.startInterface.render();
        
        StartInterface.onDidClickStartButton((e: IStartButtonEvent) => {
            if (e.ifClicked) {
                this.startInterface.destory();
                this.world = new World(this.mainContainer);
                this.world.render();
            }
        });

    }

}
