import { IPosition } from "../../common/UI/domNode.js";
import { calcDistance } from "../../common/utils/math.js";
import { World } from "../world.js";
import { Entity, LivingType, StaticType } from "./entity.js";
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
                Entity.removeEntity(this);
            }
            return;
        }
        const todo = this.pq.dequeue();
        switch(todo.item) {
            case TodoType.HUNGRY:
                const surroundings = this._checkSurroundEntity();
                // find grass inside sightrange
                for (let entity of surroundings) {
                    if (entity.type == StaticType.GRASS) {
                        const distance = calcDistance(this.position, entity.position);
                        if(distance < this.actionRange) {
                            // case when the grass is inside eat range
                            this._eat(entity);
                            this.hungry = 100;
                            // TODO: No specific plan on the number so far
                        } else {
                            // case when the grass is outside eat range
                            this._chaseTo(entity);
                            this.hungry -= this.hungryRate;
                            this.pq.queue(todo);
                        }
                        return;
                    }
                }
                // no grass inside sightrange, continue randomMove
                this.hungry -= this.hungryRate;
                if(this.hungry < 0) {
                    Entity.removeEntity(this);
                    return;
                }
                this.randomMove();
                this.pq.queue(todo);
                break;
        }
    }

    protected override _render(): void {

        this.container.classList.add('rabbit-entity');
        this._moveTo(this.position);

    }

    private randomMove(): void {
        let dx = this.speed * Math.random();
        let dy = Math.sqrt(this.speed^2 - dx^2);
        if (Math.random() >= 0.5) {
            dx *= -1;
        }
        if (Math.random() >= 0.5) {
            dy *= -1;
        } 
        this._moveTo({
            x: this.position.x + dx,
            y: this.position.y + dy
        })
    }
}
