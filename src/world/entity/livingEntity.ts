
import { Emitter } from "../../common/event.js";
import { IPosition, IVector } from "../../common/UI/domNode.js";
import { calcDistance } from "../../common/utils/math.js";
import PriorityQueue from "../../common/utils/priorityQueue/PriorityQueue.js";
import { World } from "../world.js";
import { Bear } from "./bear.js";
import { Cloud } from "./cloud.js";
import { Entity, LivingType, StaticType } from "./entity.js";
import { Forest } from "./forest.js";
import { Grass } from "./grass.js";
import { Human } from "./human.js";
import { ISurroundEntities } from "./options.js";
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
    OUT_OF_ENERGY,
    RUN_AWAY,
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
    public readonly energyRate: number;
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

        switch (type) {
            case LivingType.RABBIT:
                this.speed = 0.4;
                this.hungryRate = 1;
                this.energyRate = 0.05;
                break;
            case LivingType.HUMAN:
                this.speed = 0.5;
                this.hungryRate = 2;
                this.energyRate = 0.05;
                break;
            case LivingType.WOLF:
                this.speed = 0.6;
                this.hungryRate = 3;
                this.energyRate = 0.05;
                break;
            case LivingType.BEAR:
                this.speed = 0.4;
                this.hungryRate = 4;
                this.energyRate = 0.05;
                break;
        }

    }

    protected _eat(entity: Entity): void {
        console.log(entity);
        Entity.removeEntity(entity);
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
        if (this.energy < 30) {
            this.pq.queue({
                priority: 1,
                item: TodoType.OUT_OF_ENERGY
            })
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
        // stopped and starting restoring energy
        this.energy += this.energyRate;
    }

    protected _onRunAway(): void {
        // triggered when other entities are chasing 'me'
    }

    /***************************************************************************
     * methods for specific livingEntity to override (end)
     **************************************************************************/

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
            human?: Human | undefined,
            rabbit?: Rabbit | undefined,
            wolf?: Wolf | undefined,
            bear?: Bear | undefined,
            grass?: Grass | undefined,
            cloud?: Cloud | undefined,
            forest?: Forest | undefined,
        } = {};

        let shortestDist: {
            minHuman?: number | undefined,
            minRabbit?: number | undefined,
            minWolf?: number | undefined,
            minBear?: number | undefined,
            minGrass?: number | undefined,
            minCloud?: number | undefined,
            minForest?: number | undefined,
        } = {};

        let entities = {
            human: [] as Human[],
            rabbit: [] as Rabbit[],
            wolf: [] as Wolf[],
            bear: [] as Bear[],
            grass: [] as Grass[],
            cloud: [] as Cloud[],
            forest: [] as Forest[],
        };

        const length = World.entities.length;
        for (let i = 0; i < length; i++) {
            const otherEntity = World.entities[i]!;
            if (this === otherEntity) {
                continue;
            }

            const distance = calcDistance(this.position, otherEntity.position);
            if (distance <= this.sightRange) {
                switch (otherEntity.type) {
                    case LivingType.HUMAN:
                        if (!shortest.human || distance < shortestDist.minHuman!) {
                            shortest.human = otherEntity as Human;
                            shortestDist.minHuman = distance;
                        }
                        entities.human.push(otherEntity as Human);
                        break;
                    
                    case LivingType.BEAR:
                        if (!shortest.bear || distance < shortestDist.minBear!) {
                            shortest.bear = otherEntity as Bear;
                            shortestDist.minBear = distance;
                        }
                        entities.bear.push(otherEntity as Bear);
                        break;
                    
                    case LivingType.RABBIT:
                        if (!shortest.rabbit || distance < shortestDist.minRabbit!) {
                            shortest.rabbit = otherEntity as Rabbit;
                            shortestDist.minRabbit = distance;
                        }
                        entities.rabbit.push(otherEntity as Rabbit);
                        break;

                    case LivingType.WOLF:
                        if (!shortest.wolf || distance < shortestDist.minWolf!) {
                            shortest.wolf = otherEntity as Wolf;
                            shortestDist.minWolf = distance;
                        }
                        entities.wolf.push(otherEntity as Wolf);
                        break;

                    case StaticType.CLOUD:
                        if (!shortest.cloud || distance < shortestDist.minCloud!) {
                            shortest.cloud = otherEntity as Cloud;
                            shortestDist.minCloud = distance;
                        }
                        entities.cloud.push(otherEntity as Cloud);
                        break;

                    case StaticType.FOREST:
                        if (!shortest.forest || distance < shortestDist.minForest!) {
                            shortest.forest = otherEntity as Forest;
                            shortestDist.minForest = distance;
                        }
                        entities.forest.push(otherEntity as Forest);
                        break;

                    case StaticType.GRASS:
                        if (!shortest.grass || distance < shortestDist.minGrass!) {
                            shortest.grass = otherEntity as Grass;
                            shortestDist.minGrass = distance;
                        }
                        entities.grass.push(otherEntity as Grass);
                        break;

                }
            }
        }

        return {shortest: shortest, surround: entities};

        // return entities;
    }

    protected _wander(): void {
        this.wandering = true;
        this.wanderFrameCount++;
        if (this.wanderFrameCount > (180 - Math.random() * 120)) {
            let xWeight = Math.random() * 10;
            let yWeight = Math.random() * 10;
            let diagLength = Math.sqrt(xWeight ** 2 + yWeight ** 2);
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