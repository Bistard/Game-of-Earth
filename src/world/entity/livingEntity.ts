
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
    SLEEP,
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
    public speedrate: number = 1;
    public readonly healthRestoreRate: number;
    public readonly hungryRate: number;
    public readonly energyRate: number;
    public readonly sightRange: number;
    public readonly actionRange: number = Math.max(this.dimension.height, this.dimension.width) / 2;

    protected wandering: boolean = false;
    private wanderFrameCount = 0;
    protected wanderDirection: IVector = { dx: 0, dy: 0 };

    protected readonly pq = new PriorityQueue({ comparator: (a: IPQItems, b: IPQItems) => { return a.priority - b.priority; } });
    public readonly todoState = {
        hungry: false,
        sleep: false,
        runAway: false,
    };

    constructor(type: LivingType, position: IPosition, parentContainer: HTMLElement, container: HTMLElement) {
        super(type, position, parentContainer, container);

        this.container.classList.add('living-entity');
        this.sightRange = 500;

        switch (type) {
            case LivingType.RABBIT:
                this.speed = 0.4;
                this.healthRestoreRate = 0.05;
                this.hungryRate = 0.02;
                this.energyRate = 0.05;
                break;
            case LivingType.HUMAN:
                this.speed = 0.5;
                this.healthRestoreRate = 0.05;
                this.hungryRate = 0.03;
                this.energyRate = 0.05;
                break;
            case LivingType.WOLF:
                this.speed = 0.6;
                this.healthRestoreRate = 0.05;
                this.hungryRate = 0.03;
                this.energyRate = 0.05;
                break;
            case LivingType.BEAR:
                this.speed = 0.4;
                this.healthRestoreRate = 0.05;
                this.hungryRate = 0.03;
                this.energyRate = 0.05;
                break;
        }

    }

    public override update(): void {

        // detect if hungry
        if (this.hungry < 40 && !this.todoState.hungry) {
            this.pq.queue({
                priority: 1,
                item: TodoType.HUNGRY,
            });
            this.todoState.hungry = true;
        }

        // detect if energy running out
        if (this.energy < 30 && !this.todoState.sleep) {
            this.pq.queue({
                priority: 2,
                item: TodoType.SLEEP,
            });
            this.todoState.sleep = true;
        }

        this._update();
    }

    private _update(): void {

        if (this.pq.length == 0) {
            this._wander();
            this._ifDie();
            return;
        }

        const todo = this.pq.peek();

        switch(todo.item) {
            case TodoType.HUNGRY:
                this._onHungry();
                break;
            case TodoType.SLEEP:
                this._onSleep();
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

    protected _onSleep(): void {
        // common method on dealing with running out of energy
        // stopped and starting restoring energy
        this.energy = Math.max(this.energy + this.energyRate, 100);
        this.health = Math.max(this.health + this.healthRestoreRate, 100);
        this.hungry = Math.min(this.hungry - this.hungryRate * 0.3, 0);

        
        if (this.energy > 80) {
            this.pq.dequeue();
        }
        
    }

    protected _onRunAway(): void {
        // triggered when other entities are chasing 'me'
    }

    /***************************************************************************
     * methods for specific livingEntity to override (end)
     **************************************************************************/
    
     protected _eat(entity: Entity): void {
        Entity.removeEntity(entity);
        this.hungry = 100;
        this.todoState.hungry = false;
    }

    protected _eatOrChase(entity: Entity): void {
        const distance = calcDistance(this.position, entity.position);
        if(distance < Math.max(this.dimension.height, this.dimension.width) / 2) {
            // case when the grass is inside eat range
            this._eat(entity);
            this.pq.dequeue();
        } else {
            // case when the grass is outside eat range
            this._chase(entity);
            this.hungry -= this.hungryRate;
        }
    }

    protected _ifDie(): void {

        if (this.hungry <= 0) {
            // hungry detection
            const index = World.entities.indexOf(this);
            World.entities.splice(index, 1);
            this.parentContainer.removeChild(this.container);
        } else if (this.health <= 0) {
            // health detection
        }

    }

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

    protected _chase(entity: Entity): void {
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