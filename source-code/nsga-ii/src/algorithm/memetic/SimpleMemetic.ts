/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
  List,
  IndividualsSelectionParams,
  FitnessFunction,
  NumericRange,
  BaseCrossover,
} from 'genetics-js';
import {
  ListMutationParams,
} from 'genetics-js/lib/mutation/list/UniformListMutation';
import { ProblemInstance } from '../../instance';
import { BaseNode } from '../../node';
import { BaseAlgorithm } from '../base/BaseAlgorithm';
import { Generator } from 'genetics-js/lib/generator/utils/Generator';
import { BaseRouteCrossoverParams } from '../components';
import { BaseLocalSearch } from '../components/localSearch/BaseLocalSearch';
import { getTime, getDistance } from '../components/fitness/FitnessFunction';
import { InitialIndividualGenerator } from '../components/initializer/InitialIndividualGenerator';
import { RouteIndividual } from '../../models/RouteIndevidual';
import { Population, PopulationItem } from '../components/population/Population';
import { TerminationCondition } from '../components/termination-condition/TerminationCondition';
import { getInfeasibilityDegree } from '../components/fitness/InfeasibilityDegree';
import { MaxTime } from '../components/termination-condition/MaxTime';
import { MaxGenerations } from '../components/termination-condition/MaxGenerations';
import { MaxNumberEvaluations } from '../components/termination-condition/MaxNumberEvaluations';
import { performance } from 'perf_hooks';

export interface SimpleMemeticParams<
  SParams extends IndividualsSelectionParams,
  CParams extends BaseRouteCrossoverParams,
  MParams extends ListMutationParams
> {
  populationSize: number;
  offspringSize: number;
  crossover: BaseCrossover<RouteIndividual, List<BaseNode>, BaseRouteCrossoverParams>;
  crossoverParams: CParams;
  crossoverRate: number;
  terminationCondition: TerminationCondition;
  replacement: 'Gen-Elit' | 'RW' | 'DBI';
  localSearch: BaseLocalSearch;
  obj: number;
  individualGenerator: InitialIndividualGenerator;
}

export class SimpleMemetic<
  SParams extends IndividualsSelectionParams,
  CParams extends BaseRouteCrossoverParams,
  MParams extends ListMutationParams
> implements BaseAlgorithm<RouteIndividual, List<BaseNode>> {
  private population: Population;
  private currentGeneration: number;
  private currentTime: number;
  private static currentEvaluation: number;

  public static increaseCurrentEvaluation() {
    SimpleMemetic.currentEvaluation++;
  }

  constructor(private params: SimpleMemeticParams<SParams, CParams, MParams>) {
    this.population = new Population();
    this.currentGeneration = 0;
    this.currentTime = 0;
    SimpleMemetic.currentEvaluation = 0;
  }

  /**
   * Calculates the fitness value of the individual. In order to achieve this,
   * it adds the arrival time to each of the customers and then applies a
   * penalty function.
   * @param individual Individual to calculate the fitness
   * @param instance Instance of the problem to solve
   * @returns Fitness value of the individual
   */
  protected timeFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getTime;
  
  protected distFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getDistance;

  protected infeasibilityDegree = getInfeasibilityDegree;

  private initialPopulationGenerator(
    instance: ProblemInstance,
    fleetSize: number
  ): void {
    while (this.population.getPopulationSize() < this.params.populationSize) {
      const newIndividual = this.params.individualGenerator(instance, fleetSize);
      const newObj = [this.timeFunction(newIndividual), this.distFunction(newIndividual)];
      const newFitness = newObj[this.params.obj];
      const newInfeasibilityDegree = this.infeasibilityDegree(newIndividual, instance);

      const newPopulationItem = this.params.localSearch.improve({
        individual: newIndividual,
        obj: newObj,
        fitness: newFitness,
        infeasibilityDegree: newInfeasibilityDegree
      }, instance, this.params.obj);

      this.population.pushIndividual(newPopulationItem);
    }
  }

  private binaryTournament() {
    const parentRange = new NumericRange(0, this.population.getPopulationSize() - 1);
    const firstCandidateIndex = Generator.generateInteger(parentRange);
    let secondCandidateIndex = Generator.generateInteger(parentRange);

    if (
      this.population.getPopulationItem(firstCandidateIndex).infeasibilityDegree ===
      this.population.getPopulationItem(secondCandidateIndex).infeasibilityDegree
    ) {
      if (
        this.population.getPopulationItem(firstCandidateIndex).fitness <
        this.population.getPopulationItem(secondCandidateIndex).fitness
      ) {
        return firstCandidateIndex;
      }
      return secondCandidateIndex;
    } else if (
      this.population.getPopulationItem(firstCandidateIndex).infeasibilityDegree <
      this.population.getPopulationItem(secondCandidateIndex).infeasibilityDegree
    ) {
      return firstCandidateIndex;
    }
    return secondCandidateIndex;
  }

  private generateOffspring(
    instance: ProblemInstance
  ): Population {
    const crossoverAppRange = new NumericRange(0, 1);
    const offspring = new Population();

    while (offspring.getPopulationSize() < this.params.offspringSize) {
      let firstParentIndex = 0;
      let secondParentIndex = 0;

      while (firstParentIndex === secondParentIndex) {
        firstParentIndex = this.binaryTournament();
        secondParentIndex = this.binaryTournament();
      }

      // console.log(`Crossover between parent ${firstParentIndex} and ${secondParentIndex}`);

      let firstOffspring: PopulationItem;
      let secondOffspring: PopulationItem;
      const vcross = Generator.generateFloating(crossoverAppRange);

      if (vcross <= this.params.crossoverRate) {
        const crossoverResult = this.params.crossover.cross(
          this.population.getPopulationItem(firstParentIndex).individual,
          this.population.getPopulationItem(secondParentIndex).individual,
          this.params.crossoverParams.engine,
          instance
        );

        // console.log('First offspring:', crossoverResult[0].toString());
        // console.log('Second offspring:', crossoverResult[1].toString());

        let time = this.timeFunction(crossoverResult[0]);
        let dist = this.distFunction(crossoverResult[0]);
        firstOffspring = this.params.localSearch.improve({
          individual: crossoverResult[0],
          obj: [time, dist],
          fitness: this.params.obj?dist:time,
          infeasibilityDegree: this.infeasibilityDegree(crossoverResult[0], instance)
        }, instance, this.params.obj);

        time = this.timeFunction(crossoverResult[1]);
        dist = this.distFunction(crossoverResult[1]);
        secondOffspring = this.params.localSearch.improve({
          individual: crossoverResult[1],
          obj: [time, dist],
          fitness: this.params.obj?dist:time,
          infeasibilityDegree: this.infeasibilityDegree(crossoverResult[1], instance)
        }, instance, this.params.obj);
      } else {
        firstOffspring = this.params.localSearch.improve(
          this.population.getPopulationItem(firstParentIndex),
          instance,
          this.params.obj,
        );

        secondOffspring = this.params.localSearch.improve(
          this.population.getPopulationItem(secondParentIndex),
          instance,
          this.params.obj,
        );
      }
      
      // console.log('First offspring:', firstOffspring.individual.toString());
      // console.log('Second offspring:', secondOffspring.individual.toString());

      offspring.pushIndividual(firstOffspring);
      if (offspring.getPopulationSize() < this.params.offspringSize) {
        offspring.pushIndividual(secondOffspring);
      }
    }
    return offspring;
  }

  private isStoppingCriterionSatisfied() {
    if (this.params.terminationCondition instanceof MaxGenerations) {
      return this.params.terminationCondition.isSatisfied(this.currentGeneration);
    } else if (this.params.terminationCondition instanceof MaxTime) {
      return this.params.terminationCondition.isSatisfied(this.currentTime);
    } else if (this.params.terminationCondition instanceof MaxNumberEvaluations) {
      return this.params.terminationCondition.isSatisfied(SimpleMemetic.currentEvaluation);
    }
  }

  public solve(instance: ProblemInstance, fleetSize: number): RouteIndividual[] {
    const t0 = performance.now();
    this.initialPopulationGenerator(instance, fleetSize);

    // console.log('Initial population');
    // this.population.getPopulationItems().forEach((individual) => {
      // console.log(individual.individual.toString());
      // console.log(individual.infeasibilityDegree);
      // console.log(individual.fitness);
    // });

    while (!this.isStoppingCriterionSatisfied()) {
      const offspring = this.generateOffspring(instance);

      // console.log('Offspring');
      // offspring.getPopulationItems().forEach((individual) => {
        // console.log(individual.individual.toString());
        // console.log(individual.infeasibilityDegree);
        // console.log(individual.fitness);
      // });

      switch (this.params.replacement) {
        case 'Gen-Elit':
          this.population.replaceGenWithElit(offspring);
          break;
        case 'RW':
          this.population.replaceWorst(offspring);
          break;
        case 'DBI':
          this.population.replaceDBI(offspring);
          break;
      }
      
      // console.log('Replacement');
      // this.population.getPopulationItems().forEach((individual) => {
        // console.log(individual.individual.toString());
        // console.log(individual.infeasibilityDegree);
        // console.log(individual.fitness);
      // });

      var t1 = performance.now() - t0;
      this.currentTime = t1 / 1000.0;
      this.currentGeneration++;

      if (this.currentGeneration % 10 === 0) {
        console.log('Current generation:', this.currentGeneration);
        console.log('Current evaluation:', SimpleMemetic.currentEvaluation);
        console.log('Current time (s):', this.currentTime);
        this.population.getPopulationItems().forEach((populationItem) => {
          console.log(
            `${populationItem.obj[0]} - ${populationItem.obj[1]} - ${populationItem.infeasibilityDegree} - ${populationItem.distanceMetric! >= 0? populationItem.distanceMetric:-1}`
          );
        });
        console.log('Best individual fitness: ', this.population.getFittestPopulationItem().fitness);
        console.log('');
      }
    }

    console.log('Current generation:', this.currentGeneration);
    console.log('Current evaluation:', SimpleMemetic.currentEvaluation);
    console.log('Current time (s):', this.currentTime);
    this.population.getPopulationItems().forEach((populationItem) => {
      console.log(
        `${populationItem.obj[0]} - ${populationItem.obj[1]} - ${populationItem.infeasibilityDegree} - ${populationItem.distanceMetric! >= 0? populationItem.distanceMetric:-1}`
      );
    });
    console.log('Best individual fitness: ', this.population.getFittestPopulationItem().fitness);
    console.log('');

    return [this.population.getFittestPopulationItem().individual];
  }
}
