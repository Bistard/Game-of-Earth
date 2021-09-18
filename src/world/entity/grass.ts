import { IPosition } from "../../common/UI/domNode.js";
import { StaticType } from "./entity.js";
import { StaticEntity } from "./staticEntity.js";

export class Grass extends StaticEntity {
    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(StaticType.GRASS, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    public override update(): void {
        
    }

    protected override _render(): void {
        this.container.classList.add('grass-entity');
        
        this.container.style.left = this.position.x + 'px';
        this.container.style.top = this.position.y + 'px';
    }
} 