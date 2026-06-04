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

export const orOpt: LocalSearchMovement = (individual: RouteIndividual) => {
  const newIndividual = new ListIndividual<BaseNode>([]);
  newIndividual.deepCopy(individual);

  // It is required, at least, one route with two clients
  if (RouteIndividual.getNumberRoutesWithMinNumberNodes(newIndividual, 3) < 1) {
    return newIndividual;
  }
  
  const routeIndexRange = new NumericRange(0, newIndividual.length() - 1);
  let firstRouteIndex = -1;
  let firstNodeIndexFirstRoute = -1;
  let secondNodeIndexFirstRoute = -1;

  while (firstRouteIndex === -1) {
    firstRouteIndex = Generator.generateInteger(routeIndexRange);
    if (newIndividual.get(firstRouteIndex).length() < 3) {
      firstRouteIndex = -1;
    } else {
      firstNodeIndexFirstRoute = Generator.generateInteger(
        new NumericRange(1, newIndividual.get(firstRouteIndex).length() - 1)
      );
      secondNodeIndexFirstRoute = Generator.generateInteger(
        new NumericRange(1, newIndividual.get(firstRouteIndex).length() - 1)
      );
      while (secondNodeIndexFirstRoute === firstNodeIndexFirstRoute) {
        secondNodeIndexFirstRoute = Generator.generateInteger(
          new NumericRange(1, newIndividual.get(firstRouteIndex).length() - 1)
        );
      }
    }
  }

  if (secondNodeIndexFirstRoute < firstNodeIndexFirstRoute) {
    const aux = secondNodeIndexFirstRoute;
    secondNodeIndexFirstRoute = firstNodeIndexFirstRoute;
    firstNodeIndexFirstRoute = aux;
  }

  let secondRouteIndex = -1;
  let nodeIndexSecondRoute = -1;

  while (nodeIndexSecondRoute === -1) {
    secondRouteIndex = Generator.generateInteger(routeIndexRange);
    if (newIndividual.get(secondRouteIndex).length() === 1) {
      nodeIndexSecondRoute = 1;
    } else {
      nodeIndexSecondRoute = Generator.generateInteger(
        new NumericRange(1, newIndividual.get(secondRouteIndex).length())
      );
      if (
        secondRouteIndex === firstRouteIndex &&
        nodeIndexSecondRoute >= firstNodeIndexFirstRoute &&
        nodeIndexSecondRoute <= secondNodeIndexFirstRoute
      ) {
        nodeIndexSecondRoute = -1;
      }
    }
  }
  
  const nodesToMove = [];
  const numberOfNodesToMove = secondNodeIndexFirstRoute - firstNodeIndexFirstRoute + 1;

  while (nodesToMove.length < numberOfNodesToMove) {
    nodesToMove.push(newIndividual.get(firstRouteIndex).get(firstNodeIndexFirstRoute));
    newIndividual.get(firstRouteIndex).erase(firstNodeIndexFirstRoute);
  }
  
  if ((firstRouteIndex === secondRouteIndex) && (nodeIndexSecondRoute > secondNodeIndexFirstRoute)) {
    nodeIndexSecondRoute -= numberOfNodesToMove;
  }

  nodesToMove.reverse().forEach((node) => {
    newIndividual.get(secondRouteIndex).insert(nodeIndexSecondRoute, node);
  });

  return newIndividual;
};
