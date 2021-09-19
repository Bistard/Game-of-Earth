import { IPosition } from "../../common/UI/domNode.js";
import { LivingType } from "./entity.js";
import { LivingEntity, SpeedRate } from "./livingEntity.js";
import { Entity } from "./entity.js";
import { Rabbit } from "./rabbit.js";
import { Human } from "./human.js";
import { Wolf } from "./wolf.js";
import { calcDistance } from "../../common/utils/math.js";
import { World } from "../world.js";

export class Bear extends LivingEntity {

    private readonly eatHumanProb = 0.3;
    private readonly eatWolfThres = 70;
    private readonly eatHumanThres = 30;

    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.BEAR, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    protected override _update(): void { //STATUS : Wandering, need to eat, need to sleep. Hunger > sleep > wandering
        let surrounding: Entity[] = this._checkSurroundEntity();
        let human: Human[] = [];
        let wolf: Wolf[] = [];
        //preprocess, maybe put this as the checkSurroundingEntity in the livingENtity.ts
        for (let i = 0; i < surrounding.length; i++) {
            if (surrounding[i]!.type == LivingType.WOLF) {
                wolf.push(surrounding[i] as Wolf);
            } else if (surrounding[i]!.type == LivingType.HUMAN) {
                human.push(surrounding[i] as Human);
            }
        }
        
        function sortByDistance(a: Entity, b: Entity, c: IPosition) {
            return calcDistance(c, a.position) < calcDistance(c, b.position) ? -1 : 1;
        }
        human = human.sort((a, b) => sortByDistance(a, b, this.position));
        wolf = wolf.sort((a, b) => sortByDistance(a, b, this.position));
        if (this.hungry < this.eatHumanThres) {
            if (wolf.length > 0 && human.length > 0) {
                if (Math.random() < this.eatHumanProb) {
                    this._chaseTo(human[0]!);
                } else {
                    this._chaseTo(wolf[0]!);
                }
            } else if (wolf.length > 0) {
                this.speedrate = SpeedRate.FAST;
                this._chaseTo(wolf[0]!);
            } else if (human.length > 0) {
                this.speedrate = SpeedRate.FAST
                this._chaseTo(human[0]!);
            } else {
                this.speedrate = SpeedRate.NORMAL;
                this._wander();
            }
        } else if (this.hungry < this.eatWolfThres) {
            if (wolf.length > 0) {
                this.speedrate = SpeedRate.FAST;
                this._chaseTo(wolf[0]!);
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
