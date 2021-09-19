import { Dimension, IDimension, IPosition } from "../../common/UI/domNode.js";
import { World } from "../world.js";

export enum LivingType {
    HUMAN = 0,
    RABBIT,
    WOLF,
    BEAR
}

export enum StaticType {
    GRASS = 4,
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
    public static nameTagContainer: HTMLElement;
    
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
        this.container.classList.add('entity');

        /**
         * @readonly hovering create name tag
         */
        this.container.addEventListener('mouseenter', () => {
            Entity.createEntityTag(this);
        });

        this.container.addEventListener('mouseout', () => {
            Entity.removeEntityTag(this);
        });

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
            case StaticType.FOREST:
                World.state.count.cloud++;
                this.dimension = new Dimension(30, 30);
                break;
        }

    }

    public static isOverlap(p1: IPosition, p2: IPosition, d1: IDimension, d2: IDimension) : boolean {
        let mlx = p1.x;
        let mly = p1.y;
        let mrx = p1.x + d1.width;
        let mry = p1.y + d1.height;
        let nlx = p2.x;
        let nly = p2.y;
        let nrx = p2.x + d2.width;
        let nry = p2.y + d2.height;
        if (mlx > nrx || nlx > mrx) {
            return false;
        }
        if (mry < nly || nry < mly) {
            return false;
        }
        return true;
    }

    public static getDimensionByClass(type: LivingType | StaticType): IDimension {
        switch(type) {
            case LivingType.HUMAN:
            case LivingType.RABBIT:
            case LivingType.WOLF:
            case LivingType.BEAR:
                return { width: 30, height: 30 };
            case StaticType.GRASS:
                return { width: 20, height: 20 };
            case StaticType.CLOUD:
            case StaticType.FOREST:
            default:
                return { width: -1, height: -1 };
        }
    }

    public static createEntityTag(entity: Entity): void {
        Entity.nameTagContainer = document.createElement('div');
        Entity.nameTagContainer.style.left = '45%';
        Entity.nameTagContainer.style.top = '10px';
        Entity.nameTagContainer.id = 'entity-name-tag';
        Entity.nameTagContainer.innerHTML = Entity.getEntityTypeName(entity.type);
        entity.parentContainer.appendChild(Entity.nameTagContainer);
    }

    public static removeEntityTag(entity: Entity): void {
        entity.parentContainer.removeChild(Entity.nameTagContainer);
    }

    public static getEntityTypeName(entity: EntityType): string {
        switch(entity) {
            case LivingType.HUMAN:
                return 'Human';
            case LivingType.RABBIT:
                return 'Rabbit';
            case LivingType.WOLF:
                return 'Wolf';
            case LivingType.BEAR:
                return 'Bear';
            case StaticType.CLOUD:
                return 'Cloud';
            case StaticType.GRASS:
                return 'Grass';
            case StaticType.FOREST:
                return 'Forest';                    
        }

    }

    public abstract update(): void;
    protected abstract _render(): void;

}