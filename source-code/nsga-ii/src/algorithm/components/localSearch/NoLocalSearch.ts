/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ListIndividual } from "genetics-js";
import { BaseNode } from "../../../node";
import { PopulationItem } from "../population/Population";
import { BaseLocalSearch } from "./BaseLocalSearch";

export class NoLocalSearch implements BaseLocalSearch {
  public improve(individual: PopulationItem): PopulationItem {
    let copyIndividual = new ListIndividual<BaseNode>([]);
    copyIndividual.deepCopy(individual.individual);
    let copyObj = [...individual.obj];
    let copyFitness = individual.fitness;
    let copyInfeasibilityDegree = individual.infeasibilityDegree;

    return {
      individual: copyIndividual,
      obj: copyObj,
      fitness: copyFitness,
      infeasibilityDegree: copyInfeasibilityDegree,
    };
  }
}
