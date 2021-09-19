import { IPosition } from "../../common/UI/domNode.js";
import { World } from "../world.js";
import { LivingType, StaticType } from "./entity.js";
import { LivingEntity, TodoType } from "./livingEntity.js";

export class Rabbit extends LivingEntity {
    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.RABBIT, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    protected override _onHungry(): void {
       
        const surds = this._checkSurroundEntity();
        
        const grass = surds.surround.grass;
        const closestGrass = surds.shortest.grass;

        if (grass.length) {
            this._eatOrChase(closestGrass!);
        } else {
            this._wander();
        }
    
        this._ifDie();
    }

    protected override _render(): void {

        this.container.classList.add('rabbit-entity');
        this._moveTo(this.position);

    }
}
