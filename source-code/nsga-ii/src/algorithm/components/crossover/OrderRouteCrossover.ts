import { List } from 'genetics-js';
import { RouteIndividual } from '../../../models/RouteIndevidual';
import { BaseNode } from '../../../node';
import {
  BaseRouteCrossover,
  BaseRouteCrossoverParams
} from './BaseRouteCrossover';

export class OrderRouteCrossover extends BaseRouteCrossover {
  getGenotypeValues(
    firstParent: RouteIndividual,
    secondParent: RouteIndividual,
    params: BaseRouteCrossoverParams,
    index: number
  ): {
    first: List<BaseNode>;
    second: List<BaseNode>;
  } {
    const firstChildRoute: List<BaseNode> = new List();
    const secondChildRoute: List<BaseNode> = new List();

    secondChildRoute.pushBack(firstParent.get(index).get(0));
    firstParent.get(index).forEach((node) => {
      for (let i = 0; i < this.remainingNodesSecondChild.length; i++) {
        if (node.isEqual(this.remainingNodesSecondChild[i])) {
          secondChildRoute.pushBack(this.remainingNodesSecondChild[i]);
          this.remainingNodesSecondChild.splice(i, 1);
          break;
        }
      }
    });

    firstChildRoute.pushBack(secondParent.get(index).get(0));
    secondParent.get(index).forEach((node) => {
      for (let i = 0; i < this.remainingNodesFirstChild.length; i++) {
        if (node.isEqual(this.remainingNodesFirstChild[i])) {
          firstChildRoute.pushBack(this.remainingNodesFirstChild[i]);
          this.remainingNodesFirstChild.splice(i, 1);
          break;
        }
      }
    });

    return {
      first: firstChildRoute,
      second: secondChildRoute
    };
  }

  getStaticRouteGenotypeValues(
    firstParent: RouteIndividual,
    secondParent: RouteIndividual,
    index: number
  ): {
    first: List<BaseNode>;
    second: List<BaseNode>;
  } {
    const firstChildRoute: List<BaseNode> = new List();
    const secondChildRoute: List<BaseNode> = new List();

    firstChildRoute.pushBack(firstParent.get(index).get(0));
    firstParent.get(index).forEach((node) => {
      for (let i = 0; i < this.remainingNodesFirstChild.length; i++) {
        if (node.isEqual(this.remainingNodesFirstChild[i])) {
          firstChildRoute.pushBack(this.remainingNodesFirstChild[i]);
          this.remainingNodesFirstChild.splice(i, 1);
          break;
        }
      }
    });

    secondChildRoute.pushBack(secondParent.get(index).get(0));
    secondParent.get(index).forEach((node) => {
      for (let i = 0; i < this.remainingNodesSecondChild.length; i++) {
        if (node.isEqual(this.remainingNodesSecondChild[i])) {
          secondChildRoute.pushBack(this.remainingNodesSecondChild[i]);
          this.remainingNodesSecondChild.splice(i, 1);
          break;
        }
      }
    });

    return {
      first: firstChildRoute,
      second: secondChildRoute
    };
  }
}
