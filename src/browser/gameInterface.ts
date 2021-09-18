import { World } from "../world/world.js";
import { ICreateEntityEvent, ToolList } from "./toolList.js";

export class GameInterface {

    public readonly parentContainer: HTMLElement;
    public container: HTMLElement;

    public readonly world: World;
    
    constructor(parent: HTMLElement) {
        
        this.parentContainer = parent;
        this.container = document.createElement('div');
        this.container.id = 'game-interface';
        
        this.world = new World(this.container);    
    }

    public render(): void {
        this.parentContainer.appendChild(this.container);
        this.renderToolList();
        this.registerListeners();

        this.runGame();
    }

    public registerListeners(): void {

        // listen to the emitter
        ToolList.onCreateEntity((event: ICreateEntityEvent) => {
            // debug
            console.log(event.position.x);
            console.log(event.position.y);
            
            this.world.createEntity(event.position, event.type);
        });

    }

    public renderToolList(): void {

        const toolList = new ToolList(this.container);

    }

    public runGame(): void {

        this.world.run();

    }

    public destroy(): void {
        this.parentContainer.removeChild(this.container);
    }

}