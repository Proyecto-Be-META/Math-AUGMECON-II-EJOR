import {
  FitnessFunction,
  List,
  ListIndividual,
  NumericRange
} from 'genetics-js';
import { Generator } from 'genetics-js/lib/generator/utils/Generator';
import { BaseNode } from '../../..';
import { ProblemInstance } from '../../../instance';
import { RouteIndividual } from '../../../models/RouteIndevidual';
import { ClientNode } from '../../../node';
import { getDistance, getTime } from '../fitness/FitnessFunction';
import { getInfeasibilityDegree } from '../fitness/InfeasibilityDegree';
import { PopulationItem } from '../population/Population';
import { BaseLocalSearch } from './BaseLocalSearch';
import { arcExchange } from './movements/ArcExchange';
import { exchange } from './movements/Exchange';

export class IteratedLocalSearch implements BaseLocalSearch {
  constructor(
    // private neighborhoodSize: number,
    private iterations: number,
    private localSearch: BaseLocalSearch
  ) {}

  protected timeFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getTime;
  
  protected distFunction: FitnessFunction<
    RouteIndividual,
    List<BaseNode>
  > = getDistance;

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

  private repairInfeasibleIndividual(
    individual: RouteIndividual,
    instance: ProblemInstance
  ): RouteIndividual {
    const newIndividual = new ListIndividual<BaseNode>([]);
    newIndividual.deepCopy(individual);

    // Detect infeasible routes
    const infeasibleRoutesIndexes: number[] = [];
    const maxCapacity = instance.vehicleCapacity;
    newIndividual.forEach((route, index) => {
      let routeDemand = 0;
      route.forEach((node) => {
        if (node instanceof ClientNode) {
          routeDemand += node.demand;
        }
      });
      if (routeDemand > maxCapacity) infeasibleRoutesIndexes.push(index!);
    });

    // console.log('Number of infeasible routes:', infeasibleRoutesIndexes.length);
    // console.log('Infeasible routes:', infeasibleRoutesIndexes);

    // Select a node from an infeasible route
    const selectedInfeasibleRouteIndex = infeasibleRoutesIndexes.length === 1
      ? 0
      : Generator.generateInteger(
        new NumericRange(0, infeasibleRoutesIndexes.length - 1)
      );

    const selectedInfeasibleRoute = newIndividual.get(
      infeasibleRoutesIndexes[selectedInfeasibleRouteIndex]
    );

    // console.log('Selected infeasible route:', infeasibleRoutesIndexes[selectedInfeasibleRouteIndex]);

    const selectedInfeasibleNodeIndex = Generator.generateInteger(
      new NumericRange(1, selectedInfeasibleRoute.length() - 1)
    );

    const selectedInfeasibleNode = selectedInfeasibleRoute.get(
      selectedInfeasibleNodeIndex
    );
    
    // console.log('Selected infeasible route length before removing node:', newIndividual.get(infeasibleRoutesIndexes[selectedInfeasibleRouteIndex]).length());
    
    // Remove node from the infeasible route
    newIndividual
      .get(infeasibleRoutesIndexes[selectedInfeasibleRouteIndex])
      .erase(selectedInfeasibleNodeIndex);
    
    // console.log('Selected infeasible route length after removing node:', newIndividual.get(infeasibleRoutesIndexes[selectedInfeasibleRouteIndex]).length());

    // Select a route to insert the node
    const emptyRouteIndexes = RouteIndividual.getEmptyRoutesIndexes(newIndividual);
    if (emptyRouteIndexes.length > 0) {
      // console.log('Empty routes:', emptyRouteIndexes);
      const emptyRouteIndex = emptyRouteIndexes.length === 1
        ? emptyRouteIndexes[0]
        : emptyRouteIndexes[Generator.generateInteger(new NumericRange(0, emptyRouteIndexes.length - 1))];
      // console.log('Selected empty route:', emptyRouteIndex);
      // console.log('Empty route length:', newIndividual.get(emptyRouteIndex).length());
      newIndividual.get(emptyRouteIndex).pushBack(selectedInfeasibleNode);
      // console.log('Empty route length after inserting new node:', newIndividual.get(emptyRouteIndex).length());
    } else {
      const feasibleRoutesIndexes = RouteIndividual.getFeasibleRoutesIndexes(
        newIndividual,
        maxCapacity
      );

      // console.log('Feasible routes':, feasibleRoutesIndexes);

      const selectedFeasibleRouteIndex = Generator.generateInteger(
        new NumericRange(0, feasibleRoutesIndexes.length - 1)
      );

      // console.log('Selected feasible route:', feasibleRoutesIndexes[selectedFeasibleRouteIndex])
      // console.log('Selected feasible route length before adding node:', newIndividual.get(feasibleRoutesIndexes[selectedFeasibleRouteIndex]).length());

      newIndividual
        .get(feasibleRoutesIndexes[selectedFeasibleRouteIndex])
        .pushBack(selectedInfeasibleNode);
      
      // console.log('Selected feasible route length after adding node:', newIndividual.get(feasibleRoutesIndexes[selectedFeasibleRouteIndex]).length());
    }
    return newIndividual;
  }

  public improve(
    individual: PopulationItem,
    instance: ProblemInstance,
    obj: number,
  ): PopulationItem {
    var currentIndividual = new ListIndividual<BaseNode>([]);
    currentIndividual.deepCopy(individual.individual);
    let currentObj = [...individual.obj];
    let currentFitness = individual.fitness;
    let currentInfeasibilityDegree = individual.infeasibilityDegree;
    
    // console.log('Initial current individual fitness:', currentFitness);
    // console.log('Initial current individual infeasibility degree:', currentInfeasibilityDegree);

    var bestIndividual = new ListIndividual<BaseNode>([]);
    bestIndividual.deepCopy(currentIndividual);
    var bestObj = [...currentObj];
    var bestFitness = currentFitness;
    var bestInfeasibilityDegree = currentInfeasibilityDegree;
    
    // console.log('Initial best individual fitness:', bestFitness);
    // console.log('Initial best individual infeasibility degree:', bestInfeasibilityDegree);

    for (let i = 0; i < this.iterations; i++) {
      const improvedNeighbor = this.localSearch.improve({
        individual: currentIndividual,
        obj: currentObj,
        fitness: currentFitness,
        infeasibilityDegree: currentInfeasibilityDegree
      }, instance, obj);
   
      // console.log('Improved current individual fitness:', neighborData.fitness);
      // console.log('Improved current infeasibility degree:', neighborData.infeasibilityDegree);

      if (this.isNewIndividualBetter({
        individual: bestIndividual,
        obj: bestObj,
        fitness: bestFitness,
        infeasibilityDegree: bestInfeasibilityDegree
      }, improvedNeighbor)) {
        bestIndividual = improvedNeighbor.individual;
        bestObj = improvedNeighbor.obj;
        bestFitness = improvedNeighbor.fitness;
        bestInfeasibilityDegree = improvedNeighbor.infeasibilityDegree;
      }
    
      // console.log('Best individual fitness:', bestFitness);
      // console.log('Best individual infeasibility degree:', bestInfeasibilityDegree);
    
      // Perturbation
      if (bestInfeasibilityDegree !== 0) {
        // console.log('Repairing!');
        currentIndividual = this.repairInfeasibleIndividual(bestIndividual, instance);
      } else {
        // console.log('Exchanging!');
        currentIndividual = exchange(bestIndividual);
        currentIndividual = arcExchange(currentIndividual);
      }

      currentObj[0] = this.timeFunction(currentIndividual);
      currentObj[1] = this.distFunction(currentIndividual);
      currentFitness = currentObj[0];
      currentInfeasibilityDegree = getInfeasibilityDegree(currentIndividual, instance);

      // console.log('Current individual fitness after perturbation:', currentFitness);
      // console.log('Current individual infeasibility degree after perturbation:', currentInfeasibilityDegree);
    }
      
    return {
      individual: bestIndividual,
      obj: bestObj,
      fitness: bestFitness,
      infeasibilityDegree: bestInfeasibilityDegree
    }
  }
}
