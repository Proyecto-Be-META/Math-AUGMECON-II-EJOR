/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
  ListIndividual,
  TerminationCondition,
  List,
  MaxGenerations,
  GeneRelocationMutation,
  FitnessFunction,
  Population
} from 'genetics-js';
import { ProblemInstance } from '../../instance';
import { RouteIndividual } from '../../models/RouteIndevidual';
import { BaseNode } from '../../node';
import { isCapacityRestrictionSatisfied } from '../../utils/isCapacityRestrictionSatisfied';
import { BaseAlgorithm } from '../base/BaseAlgorithm';
import { getTime } from '../components/fitness/FitnessFunction';
import { constructiveInitialIndividualGenerator } from '../components/initializer/ConstructiveInitializer';

/**
 * Type for the termination condition of the Random Search algorithm.
 */
type TerminationConditionRS = TerminationCondition<
  RouteIndividual,
  List<BaseNode>
>;

/**
 * ## Random Search
 * Class that implements a simple Random Search algorithm to prove the well
 * functioning of the List Individuals and the operators related to them.
 */
export class RandomSearch
  implements BaseAlgorithm<RouteIndividual, List<BaseNode>> {
  /**
   * Termination condition of the algorithm.
   */
  protected _terminationCondition: TerminationConditionRS;

  /**
   * Mutation operator.
   */
  protected _mutator: GeneRelocationMutation<BaseNode>;

  /**
   * Population of individuals. In this case it only has one individual.
   */
  protected _population: Population<RouteIndividual, List<BaseNode>>;

  /**
   * Constructor of the class. It instanciates the needed properties to
   * create the algorithm.
   * @param maxGenerations Number of generations until the algorithm stops
   */
  constructor(
    maxGenerations = 25,
    protected _initialSolution?: RouteIndividual
  ) {
    this._terminationCondition = new MaxGenerations(maxGenerations);
    this._mutator = new GeneRelocationMutation();
    this._population = new Population();
  }

  /**
   * Calculates the fitness value of the individual. In order to achieve this,
   * it adds the arrival time to each of the customers and the applies a
   * penalty function.
   * @param individual Individual to calculate the fitness
   * @param instance Instance of the problem to solve
   * @returns Fitness value of the individual
   */
  protected fitnessFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getTime;

  /**
   * Calculates the best solution. It first creates an initial solution, and
   * then mutates it and replace the current one if it has a lower fitness
   * value until the maximum number of generations is reached.
   * @param instance Problem instance
   * @param fleetSize Number of vehicles of the fleet
   * @returns Best individual found so far
   */
  public solve(instance: ProblemInstance, fleetSize: number): RouteIndividual[] {
    let currentGeneration = 0;
    let currentIndividual: RouteIndividual = constructiveInitialIndividualGenerator(
      instance,
      fleetSize
    );
    if (this._initialSolution) {
      currentIndividual = this._initialSolution;
    } else {
      while (
        !isCapacityRestrictionSatisfied(
          currentIndividual,
          instance.vehicleCapacity,
          instance
        )
      ) {
        currentIndividual = constructiveInitialIndividualGenerator(
          instance,
          fleetSize
        );
      }
    }
    let currentFitness: number = this.fitnessFunction(
      currentIndividual,
      instance
    );

    while (
      !this._terminationCondition.isSatisfied(
        this._population,
        currentGeneration
      )
    ) {
      const newIndividual: RouteIndividual = new ListIndividual([]);
      newIndividual.deepCopy(currentIndividual);
      this._mutator.mutate(newIndividual, 1.0, 1);
      const newFitness = this.fitnessFunction(newIndividual, instance);
      if (newFitness < currentFitness) {
        currentIndividual = newIndividual;
        currentFitness = newFitness;
      }
      currentGeneration++;
    }
    return [currentIndividual];
  }
}
