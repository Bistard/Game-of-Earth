import { IPosition } from "../../common/UI/domNode.js";
import { World } from "../world.js";
import { StaticType } from "./entity.js";
import { StaticEntity } from "./staticEntity.js";

export class Grass extends StaticEntity {
    private existTime: number = 0;

    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(StaticType.GRASS, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    public override update(): void {
        // this.existTime++;
        // if (this.existTime > 1800) {
        //     // pass life time, destroy self
        //     for(let i = 0; i < World.entities.length; i++) {
        //         if (World.entities[i] == this) {
        //             World.entities.splice(i, 1);
        //             break;
        //         }
        //     }
        // }
    }

    protected override _render(): void {
        this.container.classList.add('grass-entity');
        
        this.container.style.left = this.position.x + 'px';
        this.container.style.top = this.position.y + 'px';
    }
} 