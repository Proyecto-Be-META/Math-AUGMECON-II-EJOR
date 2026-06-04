/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ListIndividual, NumericRange } from 'genetics-js';
import { Generator } from 'genetics-js/lib/generator/utils/Generator';
import { RouteIndividual } from '../../../../models/RouteIndevidual';
import { BaseNode } from '../../../../node';
import { LocalSearchMovement } from '../MultiMovementLocalSearch';

export const arcNodeExchange: LocalSearchMovement = (
  individual: RouteIndividual
) => {
  const newIndividual = new ListIndividual<BaseNode>([]);
  newIndividual.deepCopy(individual);

  // It is required a route with, at least, two clients (one edge), and another with, at least,
  // one client
  if (RouteIndividual.getNumberRoutesWithMinNumberNodes(newIndividual, 3) < 1 ||
      RouteIndividual.getNumberRoutesWithMinNumberNodes(newIndividual, 2) < 2) {
    return newIndividual;
  }
  
  const routeIndexRange = new NumericRange(0, newIndividual.length() - 1);
  let firstRouteIndex = -1;
  let firstClientIndex = -1;

  while (firstClientIndex === -1) {
    firstRouteIndex = Generator.generateInteger(routeIndexRange);
    if (newIndividual.get(firstRouteIndex).length() > 2) {
      firstClientIndex =
        newIndividual.get(firstRouteIndex).length() === 3
          ? 1
          : Generator.generateInteger(
              new NumericRange(1, newIndividual.get(firstRouteIndex).length() - 2)
            );
    }
  }

  const firstArcNodes = [
    newIndividual.get(firstRouteIndex).get(firstClientIndex),
    newIndividual.get(firstRouteIndex).get(firstClientIndex + 1)
  ];

  let secondRouteIndex = -1;
  let secondClientIndex = -1;

  while (secondClientIndex === -1) {
    secondRouteIndex = Generator.generateInteger(routeIndexRange);
    if (newIndividual.get(secondRouteIndex).length() > 1 &&
      secondRouteIndex !== firstRouteIndex) {
      secondClientIndex =
        newIndividual.get(secondRouteIndex).length() === 2
          ? 1
          : Generator.generateInteger(
              new NumericRange(1, newIndividual.get(secondRouteIndex).length() - 1)
            );
    }
  }

  const secondClientNode = newIndividual
    .get(secondRouteIndex)
    .get(secondClientIndex);

  newIndividual
    .get(secondRouteIndex)
    .swapWith(secondClientIndex, firstArcNodes[0]);

  newIndividual
    .get(secondRouteIndex)
    .insert(secondClientIndex + 1, firstArcNodes[1]);

  newIndividual
    .get(firstRouteIndex)
    .swapWith(firstClientIndex, secondClientNode);

  newIndividual.get(firstRouteIndex).erase(firstClientIndex + 1);

  return newIndividual;
};
