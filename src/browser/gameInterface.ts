import { World } from "../world/world.js";
import { ICreateEntityEvent, ToolList } from "./toolList.js";

export class GameInterface {

    public readonly parentContainer: HTMLElement;
    public container: HTMLElement;

    public static currTimeElement: HTMLElement;
    public static currTimeCount: number = -1;

    public static toolList: ToolList;

    public readonly world: World;
    
    constructor(parent: HTMLElement) {
        
        this.parentContainer = parent;
        this.container = document.createElement('div');
        this.container.id = 'game-interface';
        
        this.world = new World(this.container);    
    }

    public render(): void {
        this.parentContainer.appendChild(this.container);
        this.renderCurrentTime();
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

    public renderCurrentTime(): void {
        GameInterface.currTimeElement = document.createElement('div');
        GameInterface.currTimeElement.id = 'current-time';
        GameInterface.currTimeElement.classList.add('pure-text');
        GameInterface.updateCurrentTime();
        
        this.container.appendChild(GameInterface.currTimeElement);
    }

    public static updateCurrentTime(): void {
        GameInterface.currTimeCount++;
        GameInterface.currTimeElement.innerHTML = Math.floor(GameInterface.currTimeCount / 60) + ' : ' + GameInterface.currTimeCount % 60;
    }

    public renderToolList(): void {

        GameInterface.toolList = new ToolList(this.container);
        GameInterface.toolList.render();

    }

    public runGame(): void {
        
        this.world.run();

    }

    public destroy(): void {
        this.parentContainer.removeChild(this.container);
    }

}