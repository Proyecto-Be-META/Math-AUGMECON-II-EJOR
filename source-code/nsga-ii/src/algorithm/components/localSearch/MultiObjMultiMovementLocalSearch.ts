/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { FitnessFunction, List, ListIndividual } from 'genetics-js';
import { ProblemInstance } from '../../../instance';
import { RouteIndividual } from '../../../models/RouteIndevidual';
import { BaseNode } from '../../../node';
import { getTime, getDistance } from '../fitness/FitnessFunction';
import { getInfeasibilityDegree } from '../fitness/InfeasibilityDegree';
import { Population, PopulationItem } from '../population/Population';
import { BaseMultiObjLocalSearch } from './BaseMultiObjLocalSearch';
import { NSGAII, Dominances } from '../../nsga/NSGAII';

export type LocalSearchMovement = (
  individual: RouteIndividual
) => RouteIndividual;

export class MultiObjMultiMovementLocalSearch implements BaseMultiObjLocalSearch {
  constructor(
    private movements: Array<LocalSearchMovement>,
  ) {}
  
  protected timeFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getTime;
  
  protected distFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getDistance;

  private generateNeighbor(
    movementIndex: number,
    individual: PopulationItem,
    instance: ProblemInstance,
  ): PopulationItem | undefined {

    const neighborInd = this.movements[movementIndex](individual.individual);
    const newNeighbor: PopulationItem = {
      individual: neighborInd,
      obj: [this.timeFunction(neighborInd), this.distFunction(neighborInd)],
      fitness: 0,
      infeasibilityDegree: getInfeasibilityDegree(neighborInd, instance),
    };

    const dominanceInfo = NSGAII.dominanceTest(individual, newNeighbor);

    if ((dominanceInfo === Dominances.SECOND_DOMINATES) || (dominanceInfo === Dominances.NON_DOMINANCES_NOT_EQUALS)) {
      return newNeighbor;
    }
  }

  public improve(
    individual: PopulationItem,
    instance: ProblemInstance
  ): PopulationItem[] {

    let bestIndividual = new ListIndividual<BaseNode>([]);
    bestIndividual.deepCopy(individual.individual);
    let bestObj = [...individual.obj];
    let bestFitness = individual.fitness;
    let bestInfeasibilityDegree = individual.infeasibilityDegree;
    
    const neighborhood = new Population();
    neighborhood.pushIndividual({
      individual: bestIndividual,
      obj: bestObj,
      fitness: bestFitness,
      infeasibilityDegree: bestInfeasibilityDegree,
    });

    let improvement = true;
    while (improvement) {
      improvement = false;
      for (let movementIndex = 0; movementIndex < this.movements.length; movementIndex++) {
        let neighbor = this.generateNeighbor(
          movementIndex, {
            individual: bestIndividual,
            obj: bestObj,
            fitness: bestFitness,
            infeasibilityDegree: bestInfeasibilityDegree,
          }, instance);
        while (neighbor) {
          improvement = true;
          neighborhood.pushIndividual(neighbor);

          bestIndividual = neighbor.individual;
          bestObj = neighbor.obj;
          bestFitness = neighbor.fitness;
          bestInfeasibilityDegree = neighbor.infeasibilityDegree;

          neighbor = this.generateNeighbor(
            movementIndex, {
              individual: bestIndividual,
              obj: bestObj,
              fitness: bestFitness,
              infeasibilityDegree: bestInfeasibilityDegree,
            }, instance);
        }
      }
    }
    return NSGAII.getNonDominatedSolutions(neighborhood).getPopulationItems();
  }
}