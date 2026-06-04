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

export const exchange: LocalSearchMovement = (individual: RouteIndividual) => {
  const newIndividual = new ListIndividual<BaseNode>([]);
  newIndividual.deepCopy(individual);

  const routeIndexRange = new NumericRange(0, newIndividual.length() - 1);
  let firstRouteIndex = Generator.generateInteger(routeIndexRange);
  let secondRouteIndex = firstRouteIndex;

  while (secondRouteIndex === firstRouteIndex) {
    secondRouteIndex = Generator.generateInteger(routeIndexRange);
  }

  let firstClientIndex;
  let secondClientIndex;

  // Both routes have, at least, one client, so clients are exchanged
  if (newIndividual.get(firstRouteIndex).length() > 1 &&
      newIndividual.get(secondRouteIndex).length() > 1) {
    firstClientIndex = newIndividual.get(firstRouteIndex).length() === 2
        ? 1
        : Generator.generateInteger(
            new NumericRange(1, newIndividual.get(firstRouteIndex).length() - 1)
          );

    secondClientIndex = newIndividual.get(secondRouteIndex).length() === 2
        ? 1
        : Generator.generateInteger(
            new NumericRange(1, newIndividual.get(secondRouteIndex).length() - 1)
          );
  // Any of both routes have no clients, so depots are exchanged
  } else {
    firstClientIndex = 0;
    secondClientIndex = 0;
  }

  const firstClientNode = newIndividual
    .get(firstRouteIndex)
    .get(firstClientIndex);

  const secondClientNode = newIndividual
    .get(secondRouteIndex)
    .get(secondClientIndex);

  newIndividual
    .get(firstRouteIndex)
    .swapWith(firstClientIndex, secondClientNode);

  newIndividual
    .get(secondRouteIndex)
    .swapWith(secondClientIndex, firstClientNode);

  return newIndividual;
};
