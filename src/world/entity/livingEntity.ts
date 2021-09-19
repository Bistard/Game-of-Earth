
import { IPosition } from "../../common/UI/domNode.js";
import { calcDistance } from "../../common/utils/math.js";
import PriorityQueue from "../../common/utils/priorityQueue/PriorityQueue.js";
import { World } from "../world.js";
import { Entity, LivingType } from "./entity.js";

export enum SpeedRate {
    VERY_SLOW = 0.5,
    SLOW = 0.75,
    NORMAL = 1,
    FAST = 1.25,
    VERY_FAST = 1.5,
}

export enum TodoType {
    HUNGRY,
    OUT_OF_ENERGY,
    RUN_AWAY,
}

interface IPQItems {
    priority: number;
    item: TodoType;
}

export abstract class LivingEntity extends Entity {

    public health: number = 100;
    public hungry: number = 100;
    public energy: number = 100;

    public readonly speed: number;
    public readonly hungryRate: number;
    public readonly sightRange: number;

    protected readonly pq: PriorityQueue<IPQItems>
        = new PriorityQueue({
            comparator: (a: IPQItems, b:IPQItems) => {
                return a.priority - b.priority;
            }
        });

    constructor(type: LivingType, position: IPosition, parentContainer: HTMLElement, container: HTMLElement) {
        super(type, position, parentContainer, container);
    
        this.container.classList.add('living-entity');
        this.sightRange = 300;
        
        switch(type) {
            case LivingType.RABBIT:
                this.speed = 0.2;
                this.hungryRate = 1;
                break;
            case LivingType.HUMAN:
                this.speed = 0.25;
                this.hungryRate = 2;
                break;
            case LivingType.WOLF:
                this.speed = 0.3;
                this.hungryRate = 3;
                break;
            case LivingType.BEAR:
                this.speed = 0.2;
                this.hungryRate = 4;
                break;
        }

    }

    protected _eat(entity: number): void {
        for(let i = 0; i < World.entities.length; i++) {
            if (World.entities[i]!.id == entity) {
                const e = World.entities[i];
                e?.parentContainer.removeChild(e.container);
                World.entities.splice(i, 1);
                break;
            }
        }
    }

    public override update(): void {

        // detect if hungry
        if (this.hungry < 40) {
            this.pq.queue({
                priority: 2,
                item: TodoType.HUNGRY
            })
        }

        // detect if energy running out
        if (1) {

        }

        this._update();
    }

    private _update(): void {

        if (this.pq.length == 0) {
            // this._wander();
            this.hungry -= this.hungryRate;
            if (this.hungry == 0) {
                for(let i = 0; i < World.entities.length; i++) {
                    if (World.entities[i] == this) {
                        this.parentContainer.removeChild(this.container);
                        console.log(World.entities.splice(i, 1));
                        break;
                    }
                }
            }
            return;
        }

        const todo = this.pq.dequeue();
        switch(todo.item) {
            case TodoType.HUNGRY:
                this._onHungry();
                break;
            case TodoType.OUT_OF_ENERGY:
                this._onRunningOutOfEnergy();
                break;
            case TodoType.RUN_AWAY:
                this._onRunAway();
                break;
        }
    }

    /***************************************************************************
     * methods for specific livingEntity to override
     **************************************************************************/

    protected abstract _onHungry(): void;

    protected _onRunningOutOfEnergy(): void {
        // common method on dealing with running out of energy

        // stoped and starting restoring energy
    }

    protected _onRunAway(): void {
        // triggered when other entities are chasing 'me'
    }

    /***************************************************************************
     * methods for specific livingEntity to override (end)
     **************************************************************************/

    protected _moveTo(position: IPosition): void {
        this.container.style.left = position.x + 'px';
        this.container.style.top = position.y + 'px';
        this.position.x = position.x;
        this.position.y = position.y;
    }

    protected _checkSurroundEntity(): Entity[] {

        const entities: Entity[] = [];

        const length = World.entities.length;
        for (let i = 0; i < length; i++) {
            const otherEntity = World.entities[i]!;
            if (this === otherEntity) {
                continue;
            }

            const distance = calcDistance(this.position, otherEntity.position);
            if (distance <= this.sightRange) {
                entities.push(otherEntity);
            }
        }
        
        return entities;
    }

    protected _chaseTo(entity: Entity):void {
        const s  = this.speed / calcDistance(this.position, entity.position);
        const dx = s * (entity.position.x - this.position.x);
        const dy = s * (entity.position.y - this.position.y);
        this._moveTo({
            x: this.position.x + dx, 
            y: this.position.y + dy
        });
    }

    protected _runAwayFrom(entity: Entity):void {
        const s  = this.speed / calcDistance(this.position, entity.position);
        const dx = s * (this.position.x - entity.position.x);
        const dy = s * (this.position.y - entity.position.y);
        this._moveTo({
            x: this.position.x + dx, 
            y: this.position.y + dy
        });
    }

}