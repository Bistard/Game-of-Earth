import { IPosition } from "../../common/UI/domNode.js";
import { LivingType } from "./entity.js";
import { LivingEntity } from "./livingEntity.js";

export class Bear extends LivingEntity {
    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.BEAR, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    public override update(): void {
        // TODO
    }

    protected override _render(): void {

        this.container.classList.add('bear-entity');
        this._moveTo(this.position);

    }
}
