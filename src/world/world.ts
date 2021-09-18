import { Browser } from "../browser/browser.js";
import { IPosition } from "../common/UI/domNode.js";
import { Entity, EntityType } from "./entity/entity.js";
import { Bear } from "./entity/bear.js";
import { Human } from "./entity/human.js";
import { Rabbit } from "./entity/rabbit.js";
import { Wolf } from "./entity/wolf.js";
import { Grass } from "./entity/grass.js"
import { Cloud } from "./entity/cloud.js"
import { Forest } from "./entity/forest.js"

enum TimeElapseRate {
    ONE = 1,
    TWO,
    THREE
}

export class World {

    private static readonly INIT_TOTAL_ENTITY_COUNT = 40;

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
        
        this.printWorldInformation();
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

        // entityCounts[i]: i'th entity count
        const entityCounts: number[] = [];
        
        let total = 0;
        for (let i = 0; i < Entity.TOTAL_ENTITY_TYPE; i++) {
            const rate = Math.random();
            total += rate;
            entityCounts.push(rate);
        } 
        
        for (let i = 0; i < Entity.TOTAL_ENTITY_TYPE; i++) {
            entityCounts[i] = Math.floor((entityCounts[i]! / total) * World.INIT_TOTAL_ENTITY_COUNT + 0.5);
        }

        const instantiations = [Human, Rabbit, Wolf, Bear, Grass, Cloud, Forest];
        for (let i = 0; i < entityCounts.length; i++) {

            for(let j = 0; j < entityCounts[i]!; j++) {
                new instantiations[i]!(
                    this._parentContainer, 
                    {x: Browser.size.width * Math.random(), y: Browser.size.height * Math.random()}
                );
            }

        }

    }

    public createEntity(position: IPosition, type: EntityType): void {
        // do stuff here
    }

    public printWorldInformation(): void {

        console.log('World.entities: ', World.entities);

        console.log('World.state: ', World.state);
        
    }

}