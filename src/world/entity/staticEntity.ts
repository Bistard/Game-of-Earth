import { Entity, StaticType } from "./entity.js";
import { IPosition } from "../../common/UI/domNode.js";

export abstract class  StaticEntity extends Entity {
    constructor(type: StaticType, position: IPosition, parentContainer: HTMLElement, container: HTMLElement) {
        super(type, position, parentContainer, container);

    }
}