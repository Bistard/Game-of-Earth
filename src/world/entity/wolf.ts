import { IPosition } from "../../common/UI/domNode.js";
import { LivingType } from "./entity.js";
import { LivingEntity } from "./livingEntity.js";

export class Wolf extends LivingEntity {
    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.WOLF, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    protected override _onHungry(): void {
        // TODO
    }

    protected override _render(): void {

        this.container.classList.add('wolf-entity');
        this._moveTo(this.position);

    }
}
