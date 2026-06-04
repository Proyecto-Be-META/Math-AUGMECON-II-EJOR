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
import { PopulationItem } from '../population/Population';
import { BaseLocalSearch } from './BaseLocalSearch';

export type LocalSearchMovement = (
  individual: RouteIndividual
) => RouteIndividual;

export class MultiMovementLocalSearch implements BaseLocalSearch {
  constructor(
    private movements: Array<LocalSearchMovement>,
    private neighborhoodSize: number
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
    obj: number,
  ): PopulationItem | undefined {
    for (let i = 0; i < this.neighborhoodSize; i++) {
      const neighbor = this.movements[movementIndex](individual.individual);
      const neighborObj = [this.timeFunction(neighbor), this.distFunction(neighbor)];
      const neighborFitness = neighborObj[obj];
      const neighborInfeasibilityDegree = getInfeasibilityDegree(neighbor, instance);
      if (
        this.isNewIndividualBetter(
          individual,
          {
            individual: neighbor,
            obj: neighborObj,
            fitness: neighborFitness,
            infeasibilityDegree: neighborInfeasibilityDegree
          }
        )
      ) {
        return {
          individual: neighbor,
          obj: neighborObj,
          fitness: neighborFitness,
          infeasibilityDegree: neighborInfeasibilityDegree
        }
      }
    }
  }

  private isNewIndividualBetter(
    bestIndividual: PopulationItem,
    newIndividual: PopulationItem 
  ): boolean {
    if (
      newIndividual.infeasibilityDegree < bestIndividual.infeasibilityDegree
    ) {
      return true;
    } else if (
      newIndividual.infeasibilityDegree === bestIndividual.infeasibilityDegree
    ) {
      return newIndividual.fitness < bestIndividual.fitness;
    }
    return false;
  }

  public improve(
    individual: PopulationItem,
    instance: ProblemInstance,
    obj: number
  ): PopulationItem {
    let bestIndividual = new ListIndividual<BaseNode>([]);
    bestIndividual.deepCopy(individual.individual);
    let bestObj = [...individual.obj];
    let bestFitness = individual.fitness;
    let bestInfeasibilityDegree = individual.infeasibilityDegree;

    var improvement = true;
    while (improvement) {
      improvement = false;
      for (let movementIndex = 0; movementIndex < this.movements.length; movementIndex++) {
        var neighbor = this.generateNeighbor(
          movementIndex, {
            individual: bestIndividual,
            obj: bestObj,
            fitness: bestFitness,
            infeasibilityDegree: bestInfeasibilityDegree,
          }, instance, obj);
        while (neighbor) {
          improvement = true;
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
            }, instance, obj);
        }
      }
    }
    return {
      individual: bestIndividual,
      obj: bestObj,
      fitness: bestFitness,
      infeasibilityDegree: bestInfeasibilityDegree,
    };
  }
}
