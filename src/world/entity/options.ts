import { Bear } from "./bear.js";
import { Cloud } from "./cloud.js";
import { Entity, EntityType } from "./entity.js";
import { Forest } from "./forest.js";
import { Grass } from "./grass.js";
import { Human } from "./human.js";
import { Rabbit } from "./rabbit.js";
import { Wolf } from "./wolf.js";

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