import { IPosition } from "../../common/UI/domNode.js";
import { calcDistance } from "../../common/utils/math.js";
import { World } from "../world.js";
import { LivingType, StaticType } from "./entity.js";
import { LivingEntity, TodoType } from "./livingEntity.js";

export class Rabbit extends LivingEntity {
    constructor(parentContainer: HTMLElement, position: IPosition) {
        super(LivingType.RABBIT, position, parentContainer, document.createElement('div'));
        this.parentContainer.appendChild(this.container);
        this._render();
    }

    protected override _update(): void {
        if (this.pq.length == 0) {
            this.randomMove();
            this.hungry -= this.hungryRate;
            if(this.hungry == 0){
                for(let i = 0; i < World.entities.length; i++){
                    if (World.entities[i] == this) {
                        World.entities.splice(i, 1);
                        break;
                    }
                }
            }
            return;
        }
        const nextTODO = this.pq.dequeue();
        switch(nextTODO.item) {
            case TodoType.HUNGRY:
                const surroundings = this._checkSurroundEntity();
                // find grass inside sightrange
                for (let e of surroundings) {
                    if (e.type == StaticType.GRASS) {
                        const distance = calcDistance(this.position, e.position);
                        if(distance < Math.max(this.dimension.height, this.dimension.width) / 2) {
                            // case when the grass is inside eat range
                            this._eat(e.id);
                            this.hungry = 100;
                            // TODO: No specific plan on the number so far
                        } else {
                            // case when the grass is outside eat range
                            this._chaseTo(e);
                            this.hungry -= this.hungryRate;
                            this.pq.queue(nextTODO);
                        }
                        return;
                    }
                }
                // no grass inside sightrange, continue randomMove
                this.hungry -= this.hungryRate;
                this.randomMove();
                this.pq.queue(nextTODO);
                break;
        }
    }

    protected override _render(): void {

        this.container.classList.add('rabbit-entity');
        this._moveTo(this.position);

    }

    private randomMove(): void {
        const dx = this.speed * Math.random();
        const dy = Math.sqrt(this.speed^2 - dx^2);
        if (Math.random() >= 0.5) {
            this.position.x += dx;
        } else {
            this.position.x -= dx;
        }
        if (Math.random() >= 0.5) {
            this.position.y += dy;
        } else {
            this.position.y -= dy;
        }
    }
}
