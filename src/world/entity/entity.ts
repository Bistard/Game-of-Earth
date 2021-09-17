import { IPosition } from "../../common/UI/domNode.js";

export type AnimalType = 'Human' | 'Rabbit' | 'Wolf' | 'Bear';
export type StaticType = 'Grass' | 'Cloud';

export type EntityType = AnimalType | StaticType;

export interface IEntity {

    readonly type: EntityType;
    readonly position: IPosition;

}

export class Entity implements IEntity {

    readonly type: EntityType;
    readonly position: IPosition;

    constructor(type: EntityType, position: IPosition) {
        this.type = type;
        this.position = position;
    }

}