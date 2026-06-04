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

export const arcExchange: LocalSearchMovement = (
  individual: RouteIndividual
) => {
  const newIndividual = new ListIndividual<BaseNode>([]);
  newIndividual.deepCopy(individual);

  // It is required, at least, one route with three clients
  // (a minimum of two edges between clients)
  if (RouteIndividual.getNumberRoutesWithMinNumberNodes(newIndividual, 4) < 1) {
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

  while (secondClientIndex === -1 || 
    (firstRouteIndex === secondRouteIndex &&
      firstClientIndex === secondClientIndex)) {
    
    secondRouteIndex = Generator.generateInteger(routeIndexRange);

    if (newIndividual.get(secondRouteIndex).length() <= 2) {
      secondClientIndex = -1;
    } else {
      secondClientIndex =
        newIndividual.get(secondRouteIndex).length() === 3
          ? 1
          : Generator.generateInteger(
              new NumericRange(1, newIndividual.get(secondRouteIndex).length() - 2)
            );
    }
  }
  
  const secondArcNodes = [
    newIndividual.get(secondRouteIndex).get(secondClientIndex),
    newIndividual.get(secondRouteIndex).get(secondClientIndex + 1)
  ];

  if (firstRouteIndex === secondRouteIndex) {
    newIndividual
      .get(firstRouteIndex)
      .swapWith(firstClientIndex + 1, secondArcNodes[0]);
    newIndividual
      .get(secondRouteIndex)
      .swapWith(secondClientIndex, firstArcNodes[1]);
    const nodesToReverse = [];
    const currentClientIndex =
      (firstClientIndex < secondClientIndex
        ? firstClientIndex
        : secondClientIndex) + 2;
    let limitClientIndex =
      firstClientIndex > secondClientIndex
        ? firstClientIndex 
        : secondClientIndex;
    let numberNodesToReverse = limitClientIndex - currentClientIndex;
    if (numberNodesToReverse > 1) {
      while (numberNodesToReverse) {
        nodesToReverse.push(
          newIndividual.get(firstRouteIndex).get(currentClientIndex)
        );
        newIndividual.get(firstRouteIndex).erase(currentClientIndex);
        numberNodesToReverse--;
      }
      nodesToReverse.reverse().forEach((node, index) => {
        newIndividual
          .get(firstRouteIndex)
          .insert(currentClientIndex + index, node);
      });
    }
  } else {
    newIndividual
      .get(firstRouteIndex)
      .swapWith(firstClientIndex + 1, secondArcNodes[1]);
    newIndividual
      .get(secondRouteIndex)
      .swapWith(secondClientIndex + 1, firstArcNodes[1]);

    const nodesToSwapFirstRoute = [];
    let currentClientIndex = firstClientIndex + 2;
    while (currentClientIndex < newIndividual.get(firstRouteIndex).length()) {
      nodesToSwapFirstRoute.push(
        newIndividual.get(firstRouteIndex).get(currentClientIndex)
      );
      newIndividual.get(firstRouteIndex).erase(currentClientIndex);
    }

    const nodesToSwapSecondRoute = [];
    currentClientIndex = secondClientIndex + 2;
    while (currentClientIndex < newIndividual.get(secondRouteIndex).length()) {
      nodesToSwapSecondRoute.push(
        newIndividual.get(secondRouteIndex).get(currentClientIndex)
      );
      newIndividual.get(secondRouteIndex).erase(currentClientIndex);
    }
    
    nodesToSwapFirstRoute.forEach((node) => {
      newIndividual.get(secondRouteIndex).pushBack(node);
    });

    nodesToSwapSecondRoute.forEach((node) => {
      newIndividual.get(firstRouteIndex).pushBack(node);
    });

  }

  return newIndividual;
};
