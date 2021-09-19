import { IPosition } from "../../common/UI/domNode.js";
import { LivingType } from "./entity.js";
import { LivingEntity, SpeedRate } from "./livingEntity.js";
import { Entity } from "./entity.js";
import { Rabbit } from "./rabbit.js";
import { Human } from "./human.js";
import { Wolf } from "./wolf.js";
import { calcDistance } from "../../common/utils/math.js";
import { World } from "../world.js";
import { ISurroundEntities } from "./options.js";

export class Bear extends LivingEntity {

    private readonly eatHumanProb = 0.3;
    private readonly eatWolfThres = 70;
    private readonly eatHumanThres = 30;

    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.BEAR, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    protected override _onHungry(): void { //STATUS : Wandering, need to eat, need to sleep. Hunger > sleep > wandering
        let surds: ISurroundEntities = this._checkSurroundEntity();
        
        const human = surds.surround.human;
        const wolf = surds.surround.wolf;

        const closestHuman = surds.shortest.human;
        const closestWolf = surds.shortest.wolf;

        if (this.hungry < this.eatHumanThres) {
            if (wolf.length > 0 && human.length > 0) {
                if (Math.random() < this.eatHumanProb) {
                    this._chase(closestHuman!);
                } else {
                    this._chase(closestWolf!);
                }
            } else if (wolf.length > 0) {
                this.speedrate = SpeedRate.FAST;
                this._chase(closestWolf!);
            } else if (human.length > 0) {
                this.speedrate = SpeedRate.FAST
                this._chase(closestHuman!);
            } else {
                this.speedrate = SpeedRate.NORMAL;
                this._wander();
            }
        } else if (this.hungry < this.eatWolfThres) {
            if (wolf.length > 0) {
                this.speedrate = SpeedRate.FAST;
                this._chase(closestWolf!);
            } else {
                this.speedrate = SpeedRate.NORMAL;
                this._wander();
            }
        } else {
            this.speedrate = SpeedRate.VERY_SLOW;
            this._wander();
        }
    }

    protected override _render(): void {

        this.container.classList.add('bear-entity');
        this._moveTo(this.position);

    }
}
