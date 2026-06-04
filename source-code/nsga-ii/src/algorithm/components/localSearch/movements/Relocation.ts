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

export const relocation: LocalSearchMovement = (
  individual: RouteIndividual
) => {
  const newIndividual = new ListIndividual<BaseNode>([]);
  newIndividual.deepCopy(individual);

  const routeIndexRange = new NumericRange(0, newIndividual.length() - 1);
  let routeIndex = -1;
  let clientIndex = -1;

  while (clientIndex === -1) {
    routeIndex = Generator.generateInteger(routeIndexRange);
    if (newIndividual.get(routeIndex).length() !== 1) {
      clientIndex = newIndividual.get(routeIndex).length() === 2
          ? 1
          : Generator.generateInteger(
              new NumericRange(1, newIndividual.get(routeIndex).length() - 1)
            );
    }
  }

  const clientNode = newIndividual.get(routeIndex).get(clientIndex);
  newIndividual.get(routeIndex).erase(clientIndex);

  let secondRouteIndex = -1;
  let secondClientIndex = -1;

  while (secondClientIndex === -1) {
    secondRouteIndex = Generator.generateInteger(routeIndexRange);
    secondClientIndex =
      newIndividual.get(secondRouteIndex).length() === 1
        ? 1
        : Generator.generateInteger(
            new NumericRange(1, newIndividual.get(secondRouteIndex).length())
          );
    if (secondRouteIndex === routeIndex && secondClientIndex === clientIndex) {
      secondClientIndex = -1;
    }
  }

  newIndividual.get(secondRouteIndex).insert(secondClientIndex, clientNode);
  
  return newIndividual;
};
