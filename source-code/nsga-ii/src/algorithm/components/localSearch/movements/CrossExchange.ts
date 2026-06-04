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

export const crossExchange: LocalSearchMovement = (
  individual: RouteIndividual
) => {
  const newIndividual = new ListIndividual<BaseNode>([]);
  newIndividual.deepCopy(individual);

  // It is required two different routes with, at least, one client each
  if (RouteIndividual.getNumberRoutesWithMinNumberNodes(newIndividual, 2) < 2) {
    return newIndividual;
  }

  const routeIndexRange = new NumericRange(0, newIndividual.length() - 1);
  let firstRouteIndex = -1;
  let firstNodeIndexFirstRoute = -1;
  let secondNodeIndexFirstRoute = -1;

  while (firstRouteIndex === -1) {
    firstRouteIndex = Generator.generateInteger(routeIndexRange);
    if (newIndividual.get(firstRouteIndex).length() < 2) {
      firstRouteIndex = -1;
    } else if (newIndividual.get(firstRouteIndex).length() === 2) {
      firstNodeIndexFirstRoute = 1;
      secondNodeIndexFirstRoute = 1;
    } else {
      firstNodeIndexFirstRoute = Generator.generateInteger(
        new NumericRange(1, newIndividual.get(firstRouteIndex).length() - 1)
      );
      secondNodeIndexFirstRoute = Generator.generateInteger(
        new NumericRange(1, newIndividual.get(firstRouteIndex).length() - 1)
      );
    }
  }

  if (secondNodeIndexFirstRoute < firstNodeIndexFirstRoute) {
    const aux = secondNodeIndexFirstRoute;
    secondNodeIndexFirstRoute = firstNodeIndexFirstRoute;
    firstNodeIndexFirstRoute = aux;
  }

  let secondRouteIndex = -1;
  let firstNodeIndexSecondRoute = -1;
  let secondNodeIndexSecondRoute = -1;

  while (secondRouteIndex === -1) {
    secondRouteIndex = Generator.generateInteger(routeIndexRange);
    if (secondRouteIndex === firstRouteIndex) {
      secondRouteIndex = -1;
    } else if (newIndividual.get(secondRouteIndex).length() < 2) {
      secondRouteIndex = -1;
    } else if (newIndividual.get(secondRouteIndex).length() === 2) {
      firstNodeIndexSecondRoute = 1;
      secondNodeIndexSecondRoute = 1;
    } else {
      firstNodeIndexSecondRoute = Generator.generateInteger(
        new NumericRange(1, newIndividual.get(secondRouteIndex).length() - 1)
      );
      secondNodeIndexSecondRoute = Generator.generateInteger(
        new NumericRange(1, newIndividual.get(secondRouteIndex).length() - 1)
      );
    }
  }
  
  if (secondNodeIndexSecondRoute < firstNodeIndexSecondRoute) {
    const aux = secondNodeIndexSecondRoute;
    secondNodeIndexSecondRoute = firstNodeIndexSecondRoute;
    firstNodeIndexSecondRoute = aux;
  }
  
  const nodesToMoveFirstRoute = [];
  const nodesToMoveSecondRoute = [];
  const numberOfNodestoMoveFirstRoute = secondNodeIndexFirstRoute - firstNodeIndexFirstRoute + 1;
  const numberOfNodestoMoveSecondRoute = secondNodeIndexSecondRoute - firstNodeIndexSecondRoute + 1;

  while (nodesToMoveFirstRoute.length < numberOfNodestoMoveFirstRoute) {
    nodesToMoveFirstRoute.push(
      newIndividual.get(firstRouteIndex).get(firstNodeIndexFirstRoute)
    );
    newIndividual.get(firstRouteIndex).erase(firstNodeIndexFirstRoute);
  }

  while (nodesToMoveSecondRoute.length < numberOfNodestoMoveSecondRoute) {
    nodesToMoveSecondRoute.push(
      newIndividual.get(secondRouteIndex).get(firstNodeIndexSecondRoute)
    );
    newIndividual.get(secondRouteIndex).erase(firstNodeIndexSecondRoute);
  }
  
  nodesToMoveFirstRoute.reverse().forEach((node) => {
    newIndividual.get(secondRouteIndex).insert(firstNodeIndexSecondRoute, node);
  });

  nodesToMoveSecondRoute.reverse().forEach((node) => {
    newIndividual.get(firstRouteIndex).insert(firstNodeIndexFirstRoute, node);
  });
  
  return newIndividual;
};
