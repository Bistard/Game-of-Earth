import { IPosition } from "../../common/UI/domNode.js";
import { calcDistance } from "../../common/utils/math.js";
import { World } from "../world.js";
import { Entity, LivingType } from "./entity.js";

export enum SpeedRate {
    VERY_SLOW = 0.5,
    SLOW = 0.75,
    NORMAL = 1,
    FAST = 1.25,
    VERY_FAST = 1.5,
}

export interface IVector {
    dx: number;
    dy: number;
}

export abstract class LivingEntity extends Entity {

    public readonly health: number = 100;
    public readonly hungry: number = 100;
    public readonly energy: number = 100;

    public readonly baseSpeed: number;
    public speedrate: number = 1;
    public readonly hungryRate: number;
    public readonly sightRange: number;

    public wandering: boolean = false;

    constructor(type: LivingType, position: IPosition, parentContainer: HTMLElement, container: HTMLElement) {
        super(type, position, parentContainer, container);

        this.container.classList.add('living-entity');
        this.sightRange = 300;

        switch (type) {
            case LivingType.RABBIT:
                this.baseSpeed = 0.2;
                this.hungryRate = 1;
                break;
            case LivingType.HUMAN:
                this.baseSpeed = 0.25;
                this.hungryRate = 2;
                break;
            case LivingType.WOLF:
                this.baseSpeed = 0.3;
                this.hungryRate = 3;
                break;
            case LivingType.BEAR:
                this.baseSpeed = 0.2;
                this.hungryRate = 4;
                break;
        }

    }

    public override update(): void {

        // region
        // manipulation ot pq
        // endregion

        this._update();

    }

    protected abstract _update(): void;

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

    protected _wander(): void {
        this.wandering = true;
        const dx = this.baseSpeed * this.speedrate * (Math.random()-0.5) * 2;
        const dy = this.baseSpeed * this.baseSpeed * (Math.random()-0.5) * 2;
        this._moveTo({x: this.position.x + dx, y: this.position.y + dy});
    }

    protected _chaseTo(entity: Entity): IVector {
        this.wandering = false;
        const s = this.baseSpeed / calcDistance(this.position, entity.position);
        const dx = s * (entity.position.x - this.position.x);
        const dy = s * (entity.position.y - this.position.y);
        return { dx: dx, dy: dy };
    }

    protected _runAwayFrom(entity: Entity): IVector {
        this.wandering = false;
        const s = this.baseSpeed / calcDistance(this.position, entity.position);
        const dx = s * (this.position.x - entity.position.x);
        const dy = s * (this.position.y - entity.position.y);
        return { dx: dx, dy: dy };
    }

}