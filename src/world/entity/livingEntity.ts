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

interface IVector {
    dx: number;
    dy: number;
}

export abstract class LivingEntity extends Entity {

    public readonly health: number = 100;
    public readonly hungry: number = 100;
    public readonly energy: number = 100;

    public readonly speed: number;
    public readonly hungryRate: number;
    public readonly sightRange: number;

    constructor(type: LivingType, position: IPosition, parentContainer: HTMLElement, container: HTMLElement) {
        super(type, position, parentContainer, container);

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

    protected _chaseTo(entity: Entity): IVector {
        const s  = this.speed / calcDistance(this.position, entity.position);
        const dx = s * (entity.position.x - this.position.x);
        const dy = s * (entity.position.y - this.position.y);
        return {dx: dx, dy: dy};
    }

    protected _runAwayFrom(entity: Entity): IVector {
        const s  = this.speed / calcDistance(this.position, entity.position);
        const dx = s * (this.position.x - entity.position.x);
        const dy = s * (this.position.y - entity.position.y);
        return {dx: dx, dy: dy}; 
    }

}