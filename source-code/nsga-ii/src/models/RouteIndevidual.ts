import { ListIndividual } from 'genetics-js';
import { BaseNode, ClientNode } from '../node';

export type RouteIndividual = ListIndividual<BaseNode>;
export type Edge = [BaseNode, BaseNode];

export const RouteIndividual = {
  hasEmptyRoute: (individual: RouteIndividual): boolean =>
    Boolean(individual.find((route) => route.length() === 1)),
  getNumberRoutesWithMinNumberNodes: (individual: RouteIndividual, minNumberNodes: number) => {
    var numberRoutes = 0;
    individual.forEach((route) => {
      if (route.length() >= minNumberNodes) {
        numberRoutes++;
      }
    });
    return numberRoutes;
  },
  getEmptyRoutesIndexes: (individual: RouteIndividual): number[] => {
    // individual.findIndex((route) => route.length() === 1)!,
    var emptyRoutes: number[] = [];
    individual.forEach((route, index) => {
      if (route.length() === 1) {
        emptyRoutes.push(index!);
      }
    });
    return emptyRoutes;
  },
  getFeasibleRoutesIndexes: (
    individual: RouteIndividual,
    maxCapacity: number
  ): number[] => {
    const feasibleRouteIndexes: number[] = [];
    individual.forEach((route, index) => {
      let routeDemand = 0;
      route.forEach((node) => {
        if (node instanceof ClientNode) {
          routeDemand += node.demand;
        }
      });
      if (routeDemand < maxCapacity) feasibleRouteIndexes.push(index!);
    });
    return feasibleRouteIndexes;
  },
  edgeExists: (individual: RouteIndividual, edge: Edge) => {
    for (let routeIndex = 0; routeIndex < individual.length(); routeIndex++) {
      const route = individual.get(routeIndex);
      var firstNode = route.get(0);

      for (let index = 1; index < route.length(); index++) {
        const secondNode = route.get(index);
        if (firstNode.isEqual(edge[0]) && secondNode.isEqual(edge[1])) {
          return true;
        }
        firstNode = secondNode;
      }
    }
    return false;
  },
  getDistance: (firstInd: RouteIndividual, secondInd: RouteIndividual) => {
    var notCommonEdges = 0;

    firstInd.forEach((route) => {
      var firstNode = route.get(0);
      for (var index = 1; index < route.length(); index++) {
        const secondNode = route.get(index);
        if (!RouteIndividual.edgeExists(secondInd, [firstNode, secondNode])) {
          notCommonEdges++;
        }
        firstNode = secondNode;
      }
    });
    
    secondInd.forEach((route) => {
      var firstNode = route.get(0);
      for (var index = 1; index < route.length(); index++) {
        const secondNode = route.get(index);
        if (!RouteIndividual.edgeExists(firstInd, [firstNode, secondNode])) {
          notCommonEdges++;
        }
        firstNode = secondNode;
      }
    });

    return notCommonEdges;
  }
};
