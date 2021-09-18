import { IPosition } from "../UI/domNode.js";

export function calcDistance(pos1: IPosition, pos2: IPosition): number {
    return Math.sqrt((pos1.x - pos2.x)^2 + (pos1.y - pos2.y)^2);
}

export function getUnitVec(from: IPosition, target: IPosition) : [number, number] {
    let deltaX = target.x - from.x;
    let deltaY = target.y - from.y;
    let distance = calcDistance(from, target);
    return [deltaX/distance, deltaY/distance];
}