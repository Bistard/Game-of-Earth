import { IPosition } from "../../common/UI/domNode.js";
import { LivingType } from "./entity.js";
import { LivingEntity, SpeedRate } from "./livingEntity.js";

export class Human extends LivingEntity {

    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.HUMAN, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    protected override _onHungry(): void {
        const surds = this._checkSurroundEntity();
        
        const rabbit = surds.surround.rabbit;
        const closestRabbit = surds.shortest.rabbit;

        if (rabbit.length) {
            this.speedrate = SpeedRate.VERY_FAST;
            this._eatOrChase(closestRabbit!);
        } else {
            this.speedrate = SpeedRate.NORMAL;
            this._wander();
        }
    
        this._ifDie();
    }

    protected override _render(): void {
        
        this.container.classList.add('human-entity');
        this._moveTo(this.position);

    }

}
