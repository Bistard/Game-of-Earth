import { Emitter } from "../common/event.js";
import { Button } from "../common/UI/button.js";
import { IPosition } from "../common/UI/domNode.js";
import { EntityType, LivingType, StaticType } from "../world/entity/entity.js";

export interface ICreateEntityEvent {
    type: EntityType;
    position: IPosition;
}

export class ToolList {
    
    public readonly parentContainer: HTMLElement;
    public readonly container: HTMLElement;

    // entity creation emitter
    private static _onCreateEntity = new Emitter<ICreateEntityEvent>();
    public static onCreateEntity = ToolList._onCreateEntity.event;
    
    constructor(parent: HTMLElement) {
        this.parentContainer = parent;
        this.container = document.createElement('div');
        this.container.id = 'tool-list';
    }

    public render(): void {
        
        this.parentContainer.appendChild(this.container);
        
        const livingContainer = document.createElement('div');
        livingContainer.id = 'living-tool-list';

        const staticContainer = document.createElement('div');
        staticContainer.id = 'static-tool-list';

        this.container.appendChild(staticContainer);
        this.container.appendChild(livingContainer);

        /***********************************************************************
         * LivingEntity Creation Button
         **********************************************************************/
        
        const rabbitBtn = new Button('rabbit-create-button', livingContainer);
        rabbitBtn.setImage('../../src/assets/rabbit.png');
        rabbitBtn.setImageClass(['tool-button-img']);
        rabbitBtn.element.domNode.classList.add('tool-button', 'button');
        rabbitBtn.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateEntity.fire({
                type: LivingType.RABBIT, 
                position: {x: ev.x, y: ev.y},
            });
        });

        const humanBtn = new Button('human-create-button', livingContainer);
        humanBtn.setImage('../../src/assets/human.png');
        humanBtn.setImageClass(['tool-button-img']);
        humanBtn.element.domNode.classList.add('tool-button', 'button');
        humanBtn.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateEntity.fire({
                type: LivingType.HUMAN, 
                position: {x: ev.x, y: ev.y},
            });
        });

        const wolfBtn = new Button('wolf-create-button', livingContainer);
        wolfBtn.setImage('../../src/assets/wolf.png');
        wolfBtn.setImageClass(['tool-button-img']);
        wolfBtn.element.domNode.classList.add('tool-button', 'button');
        wolfBtn.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateEntity.fire({
                type: LivingType.WOLF, 
                position: {x: ev.x, y: ev.y},
            });
        });

        const bearBtn = new Button('bear-create-button', livingContainer);
        bearBtn.setImage('../../src/assets/bear.png');
        bearBtn.setImageClass(['tool-button-img']);
        bearBtn.element.domNode.classList.add('tool-button', 'button');
        bearBtn.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateEntity.fire({
                type: LivingType.BEAR, 
                position: {x: ev.x, y: ev.y},
            });
        });

        /***********************************************************************
         * StaticEntity Creation Button
         **********************************************************************/

        const grass = new Button('grass-create-button', staticContainer);
        grass.setImage('../../src/assets/grass.png');
        grass.setImageClass(['tool-button-img']);
        grass.element.domNode.classList.add('tool-button', 'button');
        grass.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateEntity.fire({
                type: StaticType.GRASS, 
                position: {x: ev.x, y: ev.y},
            });
        });

        const forest = new Button('forest-create-button', staticContainer);
        forest.setImage('../../src/assets/tree.png');
        forest.setImageClass(['tool-button-img']);
        forest.element.domNode.classList.add('tool-button', 'button');
        forest.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateEntity.fire({
                type: StaticType.FOREST, 
                position: {x: ev.x, y: ev.y},
            });
        });

        const cloud = new Button('cloud-create-button', staticContainer);
        cloud.setImage('../../src/assets/cloud.png');
        cloud.setImageClass(['tool-button-img']);
        cloud.element.domNode.classList.add('tool-button', 'button');
        cloud.addEventListener('click', (ev: MouseEvent) => {
            ToolList._onCreateEntity.fire({
                type: StaticType.CLOUD, 
                position: {x: ev.x, y: ev.y},
            });
        });


    }

}