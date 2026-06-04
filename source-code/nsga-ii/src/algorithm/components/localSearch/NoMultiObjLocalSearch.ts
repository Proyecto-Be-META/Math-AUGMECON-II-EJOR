/*
 * @license
 * Copyright (c) 2022 Eduardo Segredo
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ListIndividual } from "genetics-js";
import { BaseNode } from "../../../node";
import { PopulationItem } from "../population/Population";
import { BaseMultiObjLocalSearch } from "./BaseMultiObjLocalSearch";

export class NoMultiObjLocalSearch implements BaseMultiObjLocalSearch {
  public improve(individual: PopulationItem): PopulationItem[] {
    let copyIndividual = new ListIndividual<BaseNode>([]);
    copyIndividual.deepCopy(individual.individual);

    return new Array<PopulationItem>({
      individual: copyIndividual,
      obj: [...individual.obj],
      fitness: individual.fitness,
      infeasibilityDegree: individual.infeasibilityDegree,
    });
  }
}