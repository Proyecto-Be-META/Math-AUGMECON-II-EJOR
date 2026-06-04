/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ListIndividual, List, NumericRange } from 'genetics-js';
import { Generator } from 'genetics-js/lib/generator/utils/Generator';
import { ProblemInstance, BaseNode, ClientNode, createList } from '../../..';
import { RouteIndividual } from '../../../models/RouteIndevidual';
import { InitialIndividualGenerator } from './InitialIndividualGenerator';

/**
 * Creates the initial individual of the algorithm adding the client nodes in
 * a random subtour.
 * @param instance Problem instance
 * @param fleetSize Number of vehicles of the fleet
 * @returns Initial individual
 */
export const randomInitialIndividualGenerator: InitialIndividualGenerator = (
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
  const subtourRange = new NumericRange(0, actualSubtours.length - 1);
  for (let i = 0; i < remainingClients.length; i++) {
    const subtourIndex = Generator.generateInteger(subtourRange);
    actualSubtours[subtourIndex].push(remainingClients[i]);
  }

  // Generate lists with subtours
  for (const tour of actualSubtours) {
    const list: List<BaseNode> = createList(tour);
    tourLists.push(list);
  }

  const individual: RouteIndividual = new ListIndividual<BaseNode>(tourLists);
  return individual;
};
