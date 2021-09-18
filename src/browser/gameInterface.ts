import { World } from "../world/world.js";
import { ToolList, ToolListClickEvent } from "./toolList.js";

export class GameInterface {

    public readonly parentContainer: HTMLElement;
    public container: HTMLElement;

    public readonly world: World;

    constructor(parent: HTMLElement) {
        
        this.parentContainer = parent;
        this.container = document.createElement('div');
        this.container.id = 'too-list';
        
        this.world = new World();
    }

    public render(): void {
        this.parentContainer.appendChild(this.container);
        this.initToolList();
        this.registerListeners();
    }

    public registerListeners(): void {

        // listen to the emitter
        ToolList.onCreateRabbit((e: ToolListClickEvent) => {
            const position  = e.position;
            console.log(position.x);
            console.log(position.y);
        });

    }

    public initToolList(): void {

        const toolList = new ToolList(this.container);

    }

    public destroy(): void {
        this.parentContainer.removeChild(this.container);
    }

}