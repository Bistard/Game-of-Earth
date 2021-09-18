import { Emitter } from "../common/event.js";
import { Button } from "../common/UI/button.js";
import { IPosition } from "../common/UI/domNode.js";

export interface ToolListClickEvent {
    position: IPosition;
}

export class ToolList {
    
    public readonly parentContainer: HTMLElement;
    public readonly container: HTMLElement;

    // rabbit emitter
    private static _onCreateRabbit = new Emitter<ToolListClickEvent>();
    public static onCreateRabbit = ToolList._onCreateRabbit.event;
    
    // human emitter
    private static _onCreateHuman = new Emitter<ToolListClickEvent>();
    public static onCreateHuman = ToolList._onCreateHuman.event;

    // Wolf emitter
    private static _onCreateWolf = new Emitter<ToolListClickEvent>();
    public static onCreateWolf = ToolList._onCreateWolf.event;

    // Bear emitter
    private static _onCreateBear = new Emitter<ToolListClickEvent>();
    public static onCreateBear = ToolList._onCreateBear.event;

    constructor(parent: HTMLElement) {
        this.parentContainer = parent;
        this.container = document.createElement('div');
        this.container.id = 'too-list';
    }

    public render(): void {
        this.parentContainer.appendChild(this.container);
        
        const rabbitBtn = new Button('rabbit-create-button', this.container);
        rabbitBtn.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateRabbit.fire( { position: {x: ev.x, y: ev.y} } );
        });

    }

}