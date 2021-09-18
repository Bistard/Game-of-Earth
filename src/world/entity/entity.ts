import { IPosition } from "../../common/UI/domNode.js";
import { World } from "../world.js";

export enum LivingType {
    HUMAN = 0,
    RABBIT,
    WOLF,
    BEAR
}

export enum StaticType {
    GRASS = 0,
    CLOUD,
    FOREST
}

export type EntityType = LivingType | StaticType;

export interface IEntity {

    readonly id: number;
    readonly type: EntityType;
    readonly position: IPosition;

}

export abstract class Entity implements IEntity {

    public readonly parentContainer: HTMLElement;
    public readonly container: HTMLElement;
    
    public readonly id: number;
    public readonly type: EntityType;
    public readonly position: IPosition;

    constructor(type: EntityType, position: IPosition, parentContainer: HTMLElement, container: HTMLElement) {
        this.id = World.entityID++;
        this.type = type;
        this.position = position;
        this.parentContainer = parentContainer;
        this.container = container;

        /**
         * @readonly maintains the state of World
         */
        
        World.entities.push(this);
        switch(type) {
            case LivingType.RABBIT:
                World.state.count.rabbit++;
                break;
            case LivingType.HUMAN:
                World.state.count.human++;
                break;
            case LivingType.WOLF:
                World.state.count.wolf++;
                break;
            case LivingType.BEAR:
                World.state.count.bear++;
                break;
            case StaticType.GRASS:
                World.state.count.grass++;
                break;
            case StaticType.CLOUD:
                World.state.count.cloud++;
                break;
        }

    }

    public abstract update(): void;

}