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

        let totalLeft = World.INIT_TOTAL_ENTITY_COUNT;
        const arr : number[] = [];
        let sum = 0;
        for(let i = 0; i < 7; i++){
            let temp = Math.random();
            sum += temp;
            arr.push(temp);
        } 
        for(let i = 0; i < 7; i++){
            arr[i] = Math.floor(arr[i]! / sum * World.INIT_TOTAL_ENTITY_COUNT + 0.5);
        }
        for(let i = 0; i < arr[0]!; i++){
            new Human(this._parentContainer, 
                {x: Browser.size.width * Math.random(), y: Browser.size.height * Math.random()})
        }
        for(let i = 0; i < arr[1]!; i++){
            new Rabbit(this._parentContainer, 
                {x: Browser.size.width * Math.random(), y: Browser.size.height * Math.random()})
        }
        for(let i = 0; i < arr[2]!; i++){
            new Wolf(this._parentContainer, 
                {x: Browser.size.width * Math.random(), y: Browser.size.height * Math.random()})
        }
        for(let i = 0; i < arr[3]!; i++){
            new Bear(this._parentContainer, 
                {x: Browser.size.width * Math.random(), y: Browser.size.height * Math.random()})
        }
        for(let i = 0; i < arr[4]!; i++){
            new Grass(this._parentContainer, 
                {x: Browser.size.width * Math.random(), y: Browser.size.height * Math.random()})
        }
        for(let i = 0; i < arr[5]!; i++){
            new Cloud(this._parentContainer, 
                {x: Browser.size.width * Math.random(), y: Browser.size.height * Math.random()})
        }
        for(let i = 0; i < arr[6]!; i++){
            new Forest(this._parentContainer, 
                {x: Browser.size.width * Math.random(), y: Browser.size.height * Math.random()})
        }

        new Human(this._parentContainer, {x: 100, y: 100}); // DEBUG
        new Rabbit(this._parentContainer, {x: 200, y: 200}); // DEBUG
        new Wolf(this._parentContainer, {x: 300, y: 300}); // DEBUG
        new Bear(this._parentContainer, {x: 400, y: 400}); // DEBUG

    }

    public createEntity(position: IPosition, type: EntityType): void {
        // do stuff here
    }

}