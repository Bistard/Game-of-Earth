import { IPosition } from "../common/UI/domNode.js";
import { Entity, EntityType } from "./entity/entity.js";
import { Human } from "./entity/human.js";

enum TimeElapseRate {
    ONE = 1,
    TWO,
    THREE
}

export class World {

    private readonly _parentContainer: HTMLElement;

    public static entityID: number = 0;
    public static readonly entities: Entity[] = [];

    public static readonly state = {
        count: {
            rabbit: 0,
            human: 0,
            wolf: 0,
            bear: 0,
            grass: 0,
            cloud: 0,
            tree: 0,
        },

        currTime: 0,
        TimeElapseRate: TimeElapseRate.ONE,
    }

    constructor(parentContainer: HTMLElement) {
        this._parentContainer = parentContainer;
    }

    public run(): void {

        this._initMap();
        
        setInterval(() => {
            this._updateWorld();
        }, 1 / (60 * World.state.TimeElapseRate) * 1000);
        
    }

    /**
     * @description update the game data for 'each frame'.
     */
    private _updateWorld(): void {

        const length = World.entities.length;
        for (let i = 0; i < length; i++) {
            
            const entity = World.entities[i]!;
            entity.update();

        }

    }

    private _initMap(): void {
        
        new Human(this._parentContainer, {x: 0, y: 0}); // DEBUG

    }

    public createEntity(position: IPosition, type: EntityType): void {
        // do stuff here
    }

}