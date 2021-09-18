import { IPosition } from "../../common/UI/domNode.js";
import { LivingType } from "./entity.js";
import { LivingEntity } from "./livingEntity.js";

export class Human extends LivingEntity {

    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.HUMAN, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    public override update(): void {

    }

    protected override _render(): void {
        
        this.container.classList.add('human-entity');
        this._moveTo(this.position);

    }

}
