/*;
 * @license
 * Copyright (c) 2022 Eduardo Segredo.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
  List,
  FitnessFunction,
  NumericRange,
  BaseCrossover,
} from 'genetics-js';

import { ProblemInstance } from '../../instance';
import { BaseNode } from '../../node';
import { BaseAlgorithm } from '../base/BaseAlgorithm';
import { Generator } from 'genetics-js/lib/generator/utils/Generator';
import { BaseRouteCrossoverParams } from '../components';
import { BaseMultiObjLocalSearch } from '../components/localSearch/BaseMultiObjLocalSearch';
import { getTime, getDistance } from '../components/fitness/FitnessFunction';
import { InitialIndividualGenerator } from '../components/initializer/InitialIndividualGenerator';
import { RouteIndividual } from '../../models/RouteIndevidual';
import { Population, PopulationItem } from '../components/population/Population';
import { TerminationCondition } from '../components/termination-condition/TerminationCondition';
import { getInfeasibilityDegree } from '../components/fitness/InfeasibilityDegree';
import { MaxTime } from '../components/termination-condition/MaxTime';
import { MaxGenerations } from '../components/termination-condition/MaxGenerations';
import { MaxNumberEvaluations } from '../components/termination-condition/MaxNumberEvaluations';
import { shuffle } from '../components/crossover/utils';
import { performance } from 'perf_hooks';

export interface NSGAIIParams<
  CParams extends BaseRouteCrossoverParams,
> {
  populationSize: number;
  offspringSize: number;
  crossover: BaseCrossover<RouteIndividual, List<BaseNode>, BaseRouteCrossoverParams>;
  crossoverParams: CParams;
  crossoverRate: number;
  terminationCondition: TerminationCondition;
  localSearch: BaseMultiObjLocalSearch;
  individualGenerator: InitialIndividualGenerator;
}

export enum Dominances {
  FIRST_DOMINATES,
  SECOND_DOMINATES,
  NON_DOMINANCES_EQUALS,
  NON_DOMINANCES_NOT_EQUALS
};

export class NSGAII<
  CParams extends BaseRouteCrossoverParams,
> implements BaseAlgorithm<RouteIndividual, List<BaseNode>> {
  private population: Population;
  private currentGeneration: number;
  private currentTime: number;
  private static currentEvaluation: number;

  public static increaseCurrentEvaluation() {
    NSGAII.currentEvaluation++;
  }

  constructor(private params: NSGAIIParams<CParams>) {
    this.population = new Population();
    this.currentGeneration = 0;
    this.currentTime = 0;
    NSGAII.currentEvaluation = 0;
  }

  /**
   * Calculates the fitness value of the individual. In order to achieve this,
   * it adds the arrival time to each of the customers and then applies a
   * penalty function.
   * @param individual Individual to calculate the fitness
   * @param instance Instance of the problem to solve
   * @returns Fitness value of the individual
   */
  private timeFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getTime;
  
  private distFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getDistance;

  private infeasibilityDegree = getInfeasibilityDegree;

  private static printPopulation(pop: Population) {
    pop.getPopulationItems().forEach((popItem) => {
      console.log(popItem.id, popItem.infeasibilityDegree, popItem.obj[0], popItem.obj[1], popItem.fitness);
    });
  }

  public static getNonDominatedSolutions(pop: Population): Population {
    const candidates = pop.getPopulationItems();
    const nonDominated = new Array<PopulationItem>();
    
    candidates.forEach((candidate) => {
      let insert = true;
      let i = 0;

      while (i < nonDominated.length) {
        const result = this.dominanceTest(nonDominated[i], candidate);

        if ((result === Dominances.FIRST_DOMINATES) || (result === Dominances.NON_DOMINANCES_EQUALS)) {
          insert = false;
          break;
        }

        if (result === Dominances.SECOND_DOMINATES) {
          nonDominated[i] = nonDominated[nonDominated.length - 1];
          nonDominated.pop();
        } else {
          i++;
        }
      }

      if (insert) {
        nonDominated.push(candidate);
      }
    });

    const nonDominatedPop = new Population();
    nonDominated.forEach((popItem) => {
      nonDominatedPop.pushIndividual(popItem);
    });
    return nonDominatedPop;
  }

  public solve(instance: ProblemInstance, fleetSize: number): RouteIndividual[] {
    const t0 = performance.now();
    this.initialPopulationGenerator(instance, fleetSize);
    //console.log('After initialization');
    //NSGAII.printPopulation(this.population);

    while (!this.isStoppingCriterionSatisfied()) {
      if (this.currentGeneration === 0) {
        this.rankPopulation();
        //console.log('After ranking in the first generation');
        //NSGAII.printPopulation(this.population);
      }

      this.createChildPop(instance);
      //console.log('After creating children');
      //NSGAII.printPopulation(this.population);

      this.rankCrowdingPopulation();
      //console.log('After ranking and local crowding');
      //NSGAII.printPopulation(this.population);

      var t1 = performance.now() - t0;
      this.currentTime = t1 / 1000.0;
      this.currentGeneration++;

      if (this.currentGeneration % 10 === 0) {
        console.log('Current generation:', this.currentGeneration);
        console.log('Current evaluation:', NSGAII.currentEvaluation);
        console.log('Current time (s):', this.currentTime);
        NSGAII.printPopulation(this.population);
        console.log('');
      }
    }

    console.log('Current generation:', this.currentGeneration);
    console.log('Current evaluation:', NSGAII.currentEvaluation);
    console.log('Current time (s):', this.currentTime);
    NSGAII.printPopulation(this.population);
    console.log('');

    const solPop = NSGAII.getNonDominatedSolutions(this.population);
    console.log('Non dominated solutions:', solPop.getPopulationSize());
    NSGAII.printPopulation(solPop);
    console.log('');

    const solution = new Array<RouteIndividual>();
    solPop.getPopulationItems().forEach((popItem) => {
      solution.push(popItem.individual);
    });

    return solution;
  }

  private isStoppingCriterionSatisfied() {
    if (this.params.terminationCondition instanceof MaxGenerations) {
      return this.params.terminationCondition.isSatisfied(this.currentGeneration);
    } else if (this.params.terminationCondition instanceof MaxTime) {
      return this.params.terminationCondition.isSatisfied(this.currentTime);
    } else if (this.params.terminationCondition instanceof MaxNumberEvaluations) {
      return this.params.terminationCondition.isSatisfied(NSGAII.currentEvaluation);
    }
  }

  private initialPopulationGenerator(
    instance: ProblemInstance,
    fleetSize: number
  ): void {
    while (this.population.getPopulationSize() < this.params.populationSize) {
      const newIndividual = this.params.individualGenerator(instance, fleetSize);
      const newObj = [this.timeFunction(newIndividual), this.distFunction(newIndividual)];
      const newFitness = 0;
      const newInfeasibilityDegree = this.infeasibilityDegree(newIndividual, instance);

      const newPopulationItems = this.params.localSearch.improve({
        individual: newIndividual,
        obj: newObj,
        fitness: newFitness,
        infeasibilityDegree: newInfeasibilityDegree
      }, instance);

      newPopulationItems.forEach((popItem) => {
        if (this.population.getPopulationSize() < this.params.populationSize) {
          this.population.pushIndividual(popItem);
        }
      });
    }
  }

  private createChildPop(instance: ProblemInstance) {
    const crossoverAppRange = new NumericRange(0, 1);
    const popSize = this.params.populationSize;
    let a1 = new Array<number>();
    let a2 = new Array<number>();
	
  	// Generates an array with numbers from 0 to popSize - 1 (twice)
	  for (let i = 0; i < popSize; i++) {
      a1.push(i);
      a2.push(i);
  	}

    a1 = shuffle(a1);
    a2 = shuffle(a2);
    const indexes = [...a1, ...a2];

    // Creates the offspring
  	for (let i = 0; i <= (popSize * 2) - ((popSize * 2) % 4); i += 4) {
  		// Selection
  		const ind1 = indexes[i % (popSize * 2)];
  		const ind2 = indexes[(i + 1) % (popSize * 2)];
      const ind3 = indexes[(i + 2) % (popSize * 2)];
	  	const ind4 = indexes[(i + 3) % (popSize * 2)];

  		// Binary tournament. Supposes that the parent
      // population is sorted by rank and crowding distance
      let firstParentIndex: number;
      let secondParentIndex: number;

	  	if (ind1 < ind2) {
        firstParentIndex = ind1;
  		} else{
        firstParentIndex = ind2;
  		}
  		
	  	if (ind3 < ind4) {
        secondParentIndex = ind3;
  		} else{
        secondParentIndex = ind4;
  		}

  		// Crossover
      const vcross = Generator.generateFloating(crossoverAppRange);
      let firstOffsprings: PopulationItem[];
      let secondOffsprings: PopulationItem[];

      if (vcross <= this.params.crossoverRate) {
        const crossoverResult = this.params.crossover.cross(
          this.population.getPopulationItem(firstParentIndex).individual,
          this.population.getPopulationItem(secondParentIndex).individual,
          this.params.crossoverParams.engine,
          instance
        );

        let time = this.timeFunction(crossoverResult[0]);
        let dist = this.distFunction(crossoverResult[0]);
        firstOffsprings = this.params.localSearch.improve({
          individual: crossoverResult[0],
          obj: [time, dist],
          fitness: 0,
          infeasibilityDegree: this.infeasibilityDegree(crossoverResult[0], instance)
        }, instance);

        time = this.timeFunction(crossoverResult[1]);
        dist = this.distFunction(crossoverResult[1]);
        secondOffsprings = this.params.localSearch.improve({
          individual: crossoverResult[1],
          obj: [time, dist],
          fitness: 0,
          infeasibilityDegree: this.infeasibilityDegree(crossoverResult[1], instance)
        }, instance);
      } else {
        firstOffsprings = this.params.localSearch.improve(
          this.population.getPopulationItem(firstParentIndex),
          instance,
        );

        secondOffsprings = this.params.localSearch.improve(
          this.population.getPopulationItem(secondParentIndex),
          instance,
        );
      }

      firstOffsprings.forEach((offspring) => {
        this.population.pushIndividual(offspring);
      });

      secondOffsprings.forEach((offspring) => {
        this.population.pushIndividual(offspring);
      });
	  }
  }

  public static dominanceTest(ind1: PopulationItem, ind2: PopulationItem): Dominances | undefined {
    if (ind1.infeasibilityDegree < ind2.infeasibilityDegree) {
      return Dominances.FIRST_DOMINATES;
    } else if (ind1.infeasibilityDegree > ind2.infeasibilityDegree) {
      return Dominances.SECOND_DOMINATES;
    } else {
      if ((ind1.obj[0] < ind2.obj[0]) && (ind1.obj[1] < ind2.obj[1])) {
        return Dominances.FIRST_DOMINATES;
      } else if ((ind1.obj[0] > ind2.obj[0]) && (ind1.obj[1] > ind2.obj[1])) {
        return Dominances.SECOND_DOMINATES;
      } else if ((ind1.obj[0] < ind2.obj[0]) && (ind1.obj[1] > ind2.obj[1])) {
        return Dominances.NON_DOMINANCES_NOT_EQUALS;
      } else if ((ind1.obj[0] > ind2.obj[0]) && (ind1.obj[1] < ind2.obj[1])) {
        return Dominances.NON_DOMINANCES_NOT_EQUALS;
      } else if (ind1.obj[0] === ind2.obj[0]) {
        if (ind1.obj[1] < ind2.obj[1]) {
          return Dominances.FIRST_DOMINATES;
        } else if (ind1.obj[1] > ind2.obj[1]) {
          return Dominances.SECOND_DOMINATES;
        } else {
          return Dominances.NON_DOMINANCES_EQUALS;
        }
      } else if (ind1.obj[1] === ind2.obj[1]) {
        if (ind1.obj[0] < ind2.obj[0]) {
          return Dominances.FIRST_DOMINATES;
        } else if (ind1.obj[0] > ind2.obj[0]) {
          return Dominances.SECOND_DOMINATES;
        } else {
          return Dominances.NON_DOMINANCES_EQUALS;
        }
      }
   	}
  }

  // Classifies population p in fronts. When at least minN has been classified, the remaining are not classified
  private fastNonDominatedSort(p: Population, minClassified: number){
    let fronts = new Array<Population>();
    let notClassified = new Population();
	  let differentsInFront0 = 0;
	  let classified = 0;

    let dominates = new Array<Array<number>>(); //dominates[i] --> individuals dominated by individual i
    for (let i = 0; i < p.getPopulationSize(); i++) {
      dominates.push(new Array<number>());
    }

    let dominatedBy = new Array<number>(p.getPopulationSize()); //dominatedBy[i] --> i is dominated by the said number of individuals
    dominatedBy.fill(0);

    let inserted = new Array<boolean>(p.getPopulationSize()); //inserted[i] --> true: individual i has been inserted in a front
    inserted.fill(false);

	  //Assigns an identifier to individuals
    let id = 0;
    p.getPopulationItems().forEach((individual) => {
      individual.id = id++;
    });

	  //Calculates the first front 
    let equals = new Array<number>(p.getPopulationSize());
    equals.fill(1);
    fronts.push(new Population());

	  for (let i = 0; i < p.getPopulationSize(); i++) {
		  for (let j = i + 1; j < p.getPopulationSize(); j++) {
			  let dominanceInfo = NSGAII.dominanceTest(p.getPopulationItem(i), p.getPopulationItem(j));
  			if (dominanceInfo === Dominances.FIRST_DOMINATES) {
	  			dominates[i].push(j);
		  		dominatedBy[j]++;
  			} else if (dominanceInfo === Dominances.SECOND_DOMINATES) {
	  			dominates[j].push(i);
		  		dominatedBy[i]++;
  			} else if (dominanceInfo === Dominances.NON_DOMINANCES_EQUALS) {
  				equals[i]++;
  				equals[j]++;
  			}
	  	}

		  if (dominatedBy[i] === 0) {
  			fronts[0].pushIndividual(p.getPopulationItem(i));
	  		inserted[i] = true;
		  	classified++;
  		}
  	}

    //console.log('Dominates:', dominates);
    //console.log('Dominated by:', dominatedBy);
    //console.log('Inserted:,', inserted);

	  // Calculates different elements
    let count = new Map<number, number>();
	  for (let i = 0; i < fronts[0].getPopulationSize(); i++) {
      const index = equals[fronts[0].getPopulationItem(i).id!]
      count.set(index, count.get(index) ? (count.get(index)! + 1) : 1);
	  }

  	// Dividiendo el numero de elementos que indican que tienen n iguales, por n
	  // y sumando obtenemos el numero de elementos diferentes
    count.forEach((value, key) => {
      differentsInFront0 += (value / key);
    });
	
  	// Calculates the remaining fronts
	  while((fronts[fronts.length - 1].getPopulationSize() !== 0) && (classified < minClassified)) {
		  fronts.push(new Population());
      let fi = fronts[fronts.length - 2];
	  	for (let i = 0; i < fi.getPopulationSize(); i++) {
		  	for (let j = 0; j < dominates[fi.getPopulationItem(i).id!].length; j++) {
			  	dominatedBy[dominates[fi.getPopulationItem(i).id!][j]]--;
				  if (dominatedBy[dominates[fi.getPopulationItem(i).id!][j]] === 0) {
					  fronts[fronts.length - 1].pushIndividual(p.getPopulationItem(dominates[fi.getPopulationItem(i).id!][j]));
  					inserted[dominates[fi.getPopulationItem(i).id!][j]] = true;
	  				classified++;
		  		}
			  }
  		}
	  }

  	if (fronts[fronts.length - 1].getPopulationSize() === 0) {
      fronts.pop();
  	}

	  for (let i = 0; i < p.getPopulationSize(); i++) {
  		if (!inserted[i]) {
	  		notClassified.pushIndividual(p.getPopulationItem(i));
		  }
	  }

    return {
      fronts: fronts,
      notClassified: notClassified,
      differentsInFront0: differentsInFront0
    }
  }

  private crowOrder(pop: Population) {
    let difference: number;
    let individuals = pop.getPopulationItems();
	
  	// Clear the fitness of the individuals
    individuals.forEach((ind) => {
      ind.fitness = 0;
    });
      
  	// Calculate the distances (for each objective)
  	for (let i = 0; i < individuals[0].obj.length; i++) {
  		let objOrder = i;

      individuals.sort((first, second) => {
        if (first.infeasibilityDegree < second.infeasibilityDegree) {
          return -1;
        }
        if (first.infeasibilityDegree > second.infeasibilityDegree) {
          return 1;
        }
        if (first.obj[objOrder] === second.obj[objOrder]) {
          return 0;
        }
        return first.obj[objOrder] < second.obj[objOrder] ? -1 : 1;
      });

  		//En los limites, en caso de igualdad, ponemos el que mayor valor actual tenga de fitness
	  	//Es para tratar un poco mejor las repeticiones 
		  //De todas formas, el algoritmo no se comporta bien frente a las repeticiones
  		//En algunos articulos se elimina de uno en uno, y no todos a la vez, para evitar
	  	//estos problemas (aunque eso conllevaria mas computo)
      
		  for (let j = 1; j < individuals.length; j++) {
        if (individuals[j].obj[i] !== individuals[0].obj[i]) {
          break;
        }

        if (individuals[j].fitness > individuals[0].fitness) {
          const tmp = individuals[0];
          individuals[0] = individuals[j];
          individuals[j] = tmp;
        }
  		}

  		for (let j = individuals.length - 2; j >= 0; j--) {
  			if (individuals[j].obj[i] !== individuals[individuals.length - 1].obj[i]) {
	  			break;
		  	}

  			if (individuals[j].fitness > individuals[individuals.length - 1].fitness) {
	  			const tmp = individuals[individuals.length - 1];
		  		individuals[individuals.length - 1] = individuals[j];
  				individuals[j] = tmp;
	  		}
		  }
		
  		difference = individuals[individuals.length - 1].obj[i] - individuals[0].obj[i];
	  	if (difference === 0)
		  	difference = 1;
  		individuals[0].fitness = Number.MAX_SAFE_INTEGER;
  		individuals[individuals.length - 1].fitness = Number.MAX_SAFE_INTEGER;
  		for (let j = 1; j < individuals.length - 1; j++) {
  			if (individuals[j].fitness !== Number.MAX_SAFE_INTEGER) {
  				individuals[j].fitness = ((individuals[j + 1].obj[i] - individuals[j - 1].obj[i]) / difference) + individuals[j].fitness;
  			}
  		}
  	}
	
	  // Ordenamos por el valor calculado
    individuals.sort((first, second) => {
      if (first.infeasibilityDegree < second.infeasibilityDegree) {
        return -1;
      }
      if (first.infeasibilityDegree > second.infeasibilityDegree) {
        return 1;
      }
      if (first.fitness === second.fitness) {
        return 0;
      }
      return first.fitness > second.fitness ? -1 : 1;
    });

    const newPop = new Population();
    individuals.forEach((individual) => {
      newPop.pushIndividual(individual);
    });

    return newPop;
  }

  private rankPopulation() {
    const result = this.fastNonDominatedSort(this.population, this.params.populationSize);

    let newPop = new Population();
    result.fronts.forEach((front) => {
      front.getPopulationItems().forEach((individual) => {
        newPop.pushIndividual(individual);
      });
    });

    this.population = newPop;
	}

  private rankCrowdingPopulation() {
	  let inserted = 0;

    // Calculates fronts
	  const result = this.fastNonDominatedSort(this.population, this.params.populationSize);

    // result.fronts.forEach((front) => {
    //   console.log(`Front size: ${front.getPopulationSize()}`);
    //   front.getPopulationItems().forEach((individual) => {
    //     console.log(individual.id, individual.infeasibilityDegree, individual.obj[0], individual.obj[1], individual.fitness);
    //   });
    // });

	  // Orders each front using the local crowding distance 
    for (let i = 0; i < result.fronts.length; i++) {
      result.fronts[i] = this.crowOrder(result.fronts[i]);
    }
    
    // result.fronts.forEach((front) => {
    //   console.log(`Front size: ${front.getPopulationSize()}`);
    //   front.getPopulationItems().forEach((individual) => {
    //     console.log(individual.id, individual.infeasibilityDegree, individual.obj[0], individual.obj[1], individual.fitness);
    //   });
    // });

  	//Creates the ordered population
    let newPop = new Population();
  	for (let i = 0; i < result.fronts.length - 1; i++) {
  		for (let j = 0; j < result.fronts[i].getPopulationSize(); j++) {
        newPop.pushIndividual(result.fronts[i].getPopulationItem(j));
  		}
  	}

    this.population = newPop;
	
  	//Last front
  	for (let j = 0; j < result.fronts[result.fronts.length - 1].getPopulationSize(); j++) {
	  	if (this.population.getPopulationSize() < this.params.populationSize) {
        this.population.pushIndividual(result.fronts[result.fronts.length - 1].getPopulationItem(j));
  		} 
  	}

    // this.population.getPopulationItems().forEach((individual) => {
    //   console.log(individual.id, individual.infeasibilityDegree, individual.obj[0], individual.obj[1], individual.fitness);
    // });
  }
}
