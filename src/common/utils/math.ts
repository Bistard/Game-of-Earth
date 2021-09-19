
import { IPosition, IVector } from "../UI/domNode.js";

export function calcDistance(pos1: IPosition, pos2: IPosition): number {
    return Math.sqrt((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2);
}

export function getDiagLength(a: number, b: number) : number{
    return Math.sqrt(a**2 + b**2)
}

/**
 * Returns the unit vector of length 1 pointing from (from) to (target).
 */
export function getUnitVec(from: IPosition, target: IPosition): IVector {
    let deltaX = target.x - from.x;
    let deltaY = target.y - from.y;
    let distance = calcDistance(from, target);
    return { dx: deltaX / distance, dy: deltaY / distance };
}

/**
 * Returns the unit vector of length 1 representing the sum of the IVector Array
 * Intended for when there are multiple preys insight, and deciding the direction of movement
 */
export function getEscapeVec(runDirection: IVector[]): IVector {
    let deltaX: number = 0;
    let deltaY: number = 0;
    for (let i = 0; i < runDirection.length; i++) {
        deltaX += runDirection[i]!.dx;
        deltaY += runDirection[i]!.dy;
    }
    let normCoeff = calcDistance({ x: 0, y: 0 }, { x: deltaX, y: deltaY });
    return { dx: deltaX / normCoeff, dy: deltaY / normCoeff };
}