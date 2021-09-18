import { IPosition } from "../../common/UI/domNode.js";
import { calcDistance } from "../../common/utils/math.js";
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
            this.hungry -= this.hungryRate;
            this.move();
        }
        const nextTODO = this.pq.dequeue();
        switch(nextTODO.item) {
            case TodoType.HUNGRY:
                const surroundings = this._checkSurroundEntity();
                    for (let e of surroundings) {
                        if (e.type == StaticType.GRASS) {
                            //case when the grass is beyond eat range
                            const distance = calcDistance(this.position, e.position);
                            // TODO


                        }
                    }
                break;
        }
    }

    protected override _render(): void {

        this.container.classList.add('rabbit-entity');
        this._moveTo(this.position);

    }

    private move(): void {
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
