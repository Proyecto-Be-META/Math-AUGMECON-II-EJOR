/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstance } from '../instance';
import { RouteIndividual } from '../models/RouteIndevidual';
import { BaseNode, ClientNode } from '../node';
import { checkAllClientsWereVisited } from './checkAllClientsWereVisited';

/**
 * Checks if the individual is feasible. To do so, it checks if the demand of
 * the clients of each route is lower than the capacity of the vehicles.
 * @param individual Individual to check
 * @param maxCapacity Max capacity of the vehicles
 * @return True if the individual is feasible
 */
export function isCapacityRestrictionSatisfied(
  individual: RouteIndividual,
  maxCapacity: number,
  instance: ProblemInstance
): number {
  let demandNotSatisfied = 0;
  individual.forEach((list) => {
    let routeDemand = 0;
    list.forEach((node) => {
      if (node instanceof ClientNode) {
        routeDemand += node.demand;
      }
    });
    if (routeDemand > maxCapacity) {
      demandNotSatisfied += (routeDemand - maxCapacity);
    }
  });
  return demandNotSatisfied;
}
