import { IPosition } from "../../common/UI/domNode.js";
import { LivingType } from "./entity.js";
import { LivingEntity, SpeedRate } from "./livingEntity.js";
import { ISurroundEntities } from "./options.js";

export class Wolf extends LivingEntity {

    private readonly eatHumanProb = 0.3;
    private readonly eatHumanThres = 30;

    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.WOLF, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    protected override _onHungry(): void {
        let surds: ISurroundEntities = this._checkSurroundEntity();
        console.log(this.pq);

        const human = surds.surround.human;
        const rabbit = surds.surround.rabbit;

        const closestHuman = surds.shortest.human;
        const closestRabbit = surds.shortest.rabbit;

        if (this.hungry < this.eatHumanThres) {
            if (rabbit.length > 0 && human.length > 0) {
                if (Math.random() < this.eatHumanProb) {
                    this._eatOrChase(closestHuman!);
                } else {
                    this._eatOrChase(closestRabbit!);
                }
            } else if (rabbit.length > 0) {
                this.speedrate = SpeedRate.VERY_FAST;
                this._eatOrChase(closestRabbit!);
            } else if (human.length > 0) {
                this.speedrate = SpeedRate.VERY_FAST
                this._eatOrChase(closestHuman!);
            } else {
                this.speedrate = SpeedRate.NORMAL;
                this._wander();
            }
        } else {
            if (rabbit.length > 0) {
                this.speedrate = SpeedRate.FAST;
                this._eatOrChase(closestRabbit!);
            } else {
                this.speedrate = SpeedRate.NORMAL;
                this._wander();
            }
        }
        this._ifDie();
    }

    protected override _render(): void {

        this.container.classList.add('wolf-entity');
        this._moveTo(this.position);

    }
}
