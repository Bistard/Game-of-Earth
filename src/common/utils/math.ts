import { IPosition } from "../UI/domNode.js";

export function calcDistance(pos1: IPosition, pos2: IPosition): number {
    return Math.sqrt((pos1.x - pos2.x)^2 + (pos1.y - pos2.y)^2);
}