import { Dimension, IDimension, IPosition } from "../../common/UI/domNode.js";
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

    public static readonly TOTAL_ENTITY_TYPE: number = 7;

    public readonly parentContainer: HTMLElement;
    public readonly container: HTMLElement;
    
    public readonly id: number;
    public readonly type: EntityType;
    public readonly position: IPosition;
    public readonly dimension!: IDimension;

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
                this.dimension = new Dimension(30, 30);
                break;
            case LivingType.HUMAN:
                World.state.count.human++;
                this.dimension = new Dimension(30, 30);
                break;
            case LivingType.WOLF:
                World.state.count.wolf++;
                this.dimension = new Dimension(30, 30);
                break;
            case LivingType.BEAR:
                World.state.count.bear++;
                this.dimension = new Dimension(30, 30);
                break;
            case StaticType.GRASS:
                World.state.count.grass++;
                this.dimension = new Dimension(30, 30);
                break;
            case StaticType.CLOUD:
                World.state.count.cloud++;
                this.dimension = new Dimension(30, 30);
                break;
        }

    }

    static isOverlap(m: Entity, n: Entity) : boolean {
        let mlx : number = m.position.x;
        let mly : number = m.position.y;
        let mrx : number = m.position.x + m.dimension.width;
        let mry : number = m.position.x - m.dimension.height;
        let nlx : number = n.position.x;
        let nly : number = n.position.y;
        let nrx : number = n.position.x + n.dimension.width;
        let nry : number = n.position.x - n.dimension.height;

        return !((mlx >= nrx || nlx >= mrx) || (mry >= nly || nry >= mly))
    }

    public abstract update(): void;
    protected abstract _render(): void;

}