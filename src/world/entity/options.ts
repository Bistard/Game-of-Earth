import { Bear } from "./bear.js";
import { Cloud } from "./cloud.js";
import { Entity, EntityType } from "./entity.js";
import { Forest } from "./forest.js";
import { Grass } from "./grass.js";
import { Human } from "./human.js";
import { Rabbit } from "./rabbit.js";
import { Wolf } from "./wolf.js";

export interface ICheckSurroundOptions {

    /**
     * if return the closest entity
     */
    shortest: boolean,

    /**
     * determine which entity is need to be filtered
     */
    filter: (entities: EntityType[]) => boolean,
    
}

export interface ISurroundEntities {

    shortest?: {
        human?: Human,
        rabbit?: Rabbit,
        wolf?: Wolf,
        bear?: Bear,
        grass?: Grass,
        cloud?: Cloud,
        forest?: Forest,
    }

    surround: {
        human?: Human[],
        rabbit?: Rabbit[],
        wolf?: Wolf[],
        bear?: Bear[],
        grass?: Grass[],
        cloud?: Cloud[],
        forest?: Forest[],
    }

}