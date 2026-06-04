import { List, ListIndividual, NumericRange } from 'genetics-js';
import { Generator } from 'genetics-js/lib/generator/utils/Generator';
import { ProblemInstance } from '../../../instance';
import { RouteIndividual } from '../../../models/RouteIndevidual';
import { BaseNode, ClientNode } from '../../../node';
import { createList, euclideanDistance } from '../../../utils';
import { InitialIndividualGenerator } from './InitialIndividualGenerator';

/**
 * Type for the data obtained after calculating the regret values.
 */
export type regretData = {
  regretValues: number[];
  tourIndexes: number[];
};

/**
 * Creates the initial individual of the algorithm in a constructive way. To
 * do so, it generates routes with random depots for each vehicle and then
 * adds client nodes to the routes based on the regret value of inserting them.
 * @param instance Problem instance
 * @param fleetSize Number of vehicles of the fleet
 * @returns Initial individual
 */
export const constructiveInitialIndividualGenerator: InitialIndividualGenerator = (
  instance: ProblemInstance,
  fleetSize: number
): RouteIndividual => {
  const actualSubtours: BaseNode[][] = [];
  const tourLists: List<BaseNode>[] = [];
  const remainingClients: ClientNode[] = Array.from(instance.clientNodes);
  const numberOfDepots: number = instance.depotNodes.length;
  const depotRange: NumericRange = new NumericRange(0, numberOfDepots - 1);

  // Initialize subtours with a depot
  for (let i = 0; i < fleetSize; i++) {
    const newTour: BaseNode[] = [];
    const depotIndex: number = Generator.generateInteger(depotRange);
    newTour.push(instance.depotNodes[depotIndex]);
    actualSubtours.push(newTour);
  }

  // Fill subtours
  while (remainingClients.length !== 0) {
    const { regretValues, tourIndexes } = computeRegretValue(
      remainingClients,
      actualSubtours
    );

    let maxRegretValue: number = regretValues[0];
    let maxIndexRegretValue = 0;
    for (let i = 0; i < regretValues.length; i++) {
      const currentRegretValue: number = regretValues[i];
      if (currentRegretValue > maxRegretValue) {
        maxRegretValue = currentRegretValue;
        maxIndexRegretValue = i;
      }
    }

    actualSubtours[tourIndexes[maxIndexRegretValue]].push(
      remainingClients[maxIndexRegretValue]
    );
    remainingClients.splice(maxIndexRegretValue, 1);
  }

  // Generate lists with subtours
  for (const tour of actualSubtours) {
    const list: List<BaseNode> = createList(tour);
    tourLists.push(list);
  }
  const individual: RouteIndividual = new ListIndividual<BaseNode>(tourLists);
  return individual;
};

/**
 * Computes the regret value of inserting each client in every route and
 * calculates which route has the minimun inserting cost for each of them.
 * @param remainingClients Set of clients that aren't included in a route
 * @param subtours Created routes
 * @returns Object containing the regret values and the route with minimum
 * inserting cost for each client
 */
function computeRegretValue(
  remainingClients: ClientNode[],
  subtours: BaseNode[][]
): regretData {
  const data: regretData = {
    regretValues: [],
    tourIndexes: []
  };

  for (const client of remainingClients) {
    let insertingCosts: number[] = [];
    let minInsertionCost: number = euclideanDistance(
      subtours[0][subtours[0].length - 1],
      client
    );

    let minTourIndex = 0;
    for (let i = 1; i < subtours.length; i++) {
      const insertionCost: number = euclideanDistance(
        subtours[i][subtours[i].length - 1],
        client
      );

      insertingCosts.push(insertionCost);

      if (insertionCost < minInsertionCost) {
        minInsertionCost = insertionCost;
        minTourIndex = i;
      }
    }
    data.tourIndexes.push(minTourIndex);

    insertingCosts.sort((a, b) => a - b);
    let regretValue: number;

    if (insertingCosts.length >= 3) {
      regretValue = insertingCosts[2] - insertingCosts[0];
    } else {
      regretValue = insertingCosts[insertingCosts.length - 1] - insertingCosts[0];
    }
    data.regretValues.push(regretValue);
  }
  return data;
}
