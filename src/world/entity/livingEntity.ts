
import { Emitter } from "../../common/event.js";
import { IPosition, IVector } from "../../common/UI/domNode.js";
import { calcDistance } from "../../common/utils/math.js";
import PriorityQueue from "../../common/utils/priorityQueue/PriorityQueue.js";
import { World } from "../world.js";
import { Bear } from "./bear.js";
import { Cloud } from "./cloud.js";
import { Entity, LivingType } from "./entity.js";
import { Forest } from "./forest.js";
import { Grass } from "./grass.js";
import { Human } from "./human.js";
import { ICheckSurroundOptions, ISurroundEntities } from "./options.js";
import { Rabbit } from "./rabbit.js";
import { Wolf } from "./wolf.js";

export enum SpeedRate {
    VERY_SLOW = 0.5,
    SLOW = 0.75,
    NORMAL = 1,
    FAST = 1.25,
    VERY_FAST = 1.5,
}

export enum TodoType {
    HUNGRY,
    TIRE,
    RUN
}

interface IPQItems {
    priority: number;
    item: TodoType;
}

export interface BeingChasedEvent {
    
}

export abstract class LivingEntity extends Entity {

    public health: number = 100;
    public hungry: number = 100;
    public energy: number = 100;

    public readonly speed: number;
    public speedrate: number = 1;
    public readonly hungryRate: number;
    public readonly sightRange: number;
    public readonly actionRange: number = Math.max(this.dimension.height, this.dimension.width) / 2;

    protected wandering: boolean = false;
    private wanderFrameCount = 0;
    protected wanderDirection: IVector = { dx: 0, dy: 0 };

    // being chased
    private static _onCreateEntity = new Emitter<BeingChasedEvent>();
    public static onCreateEntity = LivingEntity._onCreateEntity.event;

    protected readonly pq: PriorityQueue<IPQItems>
        = new PriorityQueue({
            comparator: (a: IPQItems, b: IPQItems) => {
                return a.priority - b.priority;
            }
        });

    constructor(type: LivingType, position: IPosition, parentContainer: HTMLElement, container: HTMLElement) {
        super(type, position, parentContainer, container);

        this.container.classList.add('living-entity');
        this.sightRange = 500;
        
        switch(type) {
            case LivingType.RABBIT:
                this.speed = 0.4;
                this.hungryRate = 1;
                break;
            case LivingType.HUMAN:
                this.speed = 0.5;
                this.hungryRate = 2;
                break;
            case LivingType.WOLF:
                this.speed = 0.6;
                this.hungryRate = 3;
                break;
            case LivingType.BEAR:
                this.speed = 0.4;
                this.hungryRate = 4;
                break;
        }

    }

    protected _eat(entity: Entity): void {
        console.log(entity);
        Entity.removeEntity(entity);
    }

    public override update(): void {

        // region
        // manipulation ot pq
        // endregion
        if (this.hungry < 40) {
            this.pq.queue({
                priority: 2,
                item: TodoType.HUNGRY
            })
        }


        this._update();

    }

    protected abstract _update(): void;

    protected _moveTo(position: IPosition): void {
        let xPos = position.x;
        let yPos = position.y;
        if (xPos < 15) xPos = 15;
        if (yPos < 15) yPos = 15;
        if (xPos > window.screen.height - 15) xPos = window.screen.height - 15;
        if (yPos > window.screen.height - 15) yPos = window.screen.height - 15;
        this.container.style.left = position.x + 'px';
        this.container.style.top = position.y + 'px';
        this.position.x = position.x;
        this.position.y = position.y;
    }

    protected _moveInDir(vec: IVector): void {
        this._moveTo({ x: this.position.x + vec.dx, y: this.position.y + vec.dy });
    }

    protected _checkSurroundEntity(): ISurroundEntities {

        let shortest: {
            human: Human,
            rabbit: Rabbit,
            wolf: Wolf,
            bear: Bear,
            grass: Grass,
            cloud: Cloud,
            forest: Forest,
        };

        const entities = {
            human: [],
            rabbit: [],
            wolf: [],
            bear: [],
            grass: [],
            cloud: [],
            forest: [],
        };

        const length = World.entities.length;
        for (let i = 0; i < length; i++) {
            const otherEntity = World.entities[i]!;
            if (this === otherEntity || filter(otherEntity) === false) {
                continue;
            }

            const distance = calcDistance(this.position, otherEntity.position);
            if (distance <= this.sightRange) {
                // entities.push(otherEntity);
            }
        }
        
        // return entities;
    }

    protected _wander(): void {
        this.wandering = true;
        this.wanderFrameCount++;
        if (this.wanderFrameCount > (180 - Math.random() * 120)) {
            let xWeight = Math.random() * 10;
            let yWeight = Math.random() * 10;
            let diagLength = Math.sqrt(xWeight**2 + yWeight**2);
            let dx = (xWeight / diagLength) * this.speed * this.speedrate;
            let dy = (yWeight / diagLength) * this.speed * this.speedrate;
            if (Math.random() >= 0.5) {
                dx *= -1;
            }
            if (Math.random() >= 0.5) {
                dy *= -1;
            }
            this.wanderDirection = { dx: dx, dy: dy };
            this.wanderFrameCount = 0;
        }
        this._moveInDir(this.wanderDirection);
    }

    protected _chaseTo(entity: Entity): void {
        const s = this.speed / calcDistance(this.position, entity.position);
        const dx = s * (entity.position.x - this.position.x);
        const dy = s * (entity.position.y - this.position.y);
        this._moveTo({
            x: this.position.x + dx,
            y: this.position.y + dy
        });
    }

    protected _runAwayFrom(entity: Entity): void {
        const s = this.speed / calcDistance(this.position, entity.position);
        const dx = s * (this.position.x - entity.position.x);
        const dy = s * (this.position.y - entity.position.y);
        this._moveTo({
            x: this.position.x + dx,
            y: this.position.y + dy
        });
    }

}