import {
  BaseCrossover,
  CrossoverParams,
  List,
  ListIndividual,
  NumericRange
} from 'genetics-js';
import { Generator } from 'genetics-js/lib/generator/utils/Generator';
import { ProblemInstance } from '../../../instance';
import { RouteIndividual } from '../../../models/RouteIndevidual';
import { BaseNode, ClientNode, DepotNode } from '../../../node';

export type OnePointCrossoverParams = CrossoverParams<
  RouteIndividual,
  List<BaseNode>
>;

export class OnePointCrossover extends BaseCrossover<
  RouteIndividual,
  List<BaseNode>,
  OnePointCrossoverParams
> {
  protected depotNodes: DepotNode[];
  protected clientNodes: ClientNode[];
  protected remainingNodesFirstChild: Set<number>;
  protected remainingNodesSecondChild: Set<number>;
  protected crossoverIndex: number;

  constructor() {
    super();
    this.depotNodes = [];
    this.clientNodes = [];
    this.remainingNodesFirstChild = new Set<number>();
    this.remainingNodesSecondChild = new Set<number>();
    this.crossoverIndex = -1;
  }

  protected checkInitialIndex(
    initialIndex: number,
    firstParent: RouteIndividual,
    secondParent: RouteIndividual
  ): void {
    if (
      initialIndex >= firstParent.length() ||
      initialIndex >= secondParent.length()
    ) {
      throw new Error('Initial index must be in range of the individual');
    }
  }

  crossWith(
    firstParent: RouteIndividual,
    secondParent: RouteIndividual,
    params: OnePointCrossoverParams
  ): [RouteIndividual, RouteIndividual] {
    this.checkParents(firstParent, secondParent);
    
    //console.log('First parent:', firstParent.toString());
    //console.log('Second parent:', secondParent.toString());

    const numberRoutes = firstParent.length();
    const numberClients = this.clientNodes.length;
    const childGenotypes: [List<BaseNode>[], List<BaseNode>[]] = [[], []];

    this.clientNodes.forEach((node) => {
      this.remainingNodesFirstChild.add(node.id);
      this.remainingNodesSecondChild.add(node.id);
    });

    this.crossoverIndex = Generator.generateInteger(
      new NumericRange(0, numberRoutes + numberClients)
    );

    // console.log('Crossover index:', this.crossoverIndex);

    // First part of each child

    let currentIndex = 0;
    let newRoute: List<BaseNode>;
    for (let i = 0; i < firstParent.length(); i++) {
      for (let j = 0; j < firstParent.get(i).length(); j++) {
        if (currentIndex < this.crossoverIndex) {
          const node = firstParent.get(i).get(j);
          if (node instanceof DepotNode) {
            newRoute = new List();
          } else {
            this.remainingNodesFirstChild.delete(node.id);
          }
          newRoute!.pushBack(node);
          currentIndex++;
        } else {
          break;
        }
      }
      if (newRoute!) {
        childGenotypes[0].push(newRoute);
      }
      if (currentIndex >= this.crossoverIndex) {
        break;
      }
    }

    currentIndex = 0;
    for (let i = 0; i < secondParent.length(); i++) {
      for (let j = 0; j < secondParent.get(i).length(); j++) {
        if (currentIndex < this.crossoverIndex) {
          const node = secondParent.get(i).get(j);
          if (node instanceof DepotNode) {
            newRoute = new List();
          }
          if (node instanceof ClientNode) {
            this.remainingNodesSecondChild.delete(node.id);
          }
          newRoute!.pushBack(node);
          currentIndex++;
        } else {
          break;
        }
      }
      if (newRoute!) {
        childGenotypes[1].push(newRoute!);
      }
      if (currentIndex >= this.crossoverIndex) {
        break;
      }
    }

    //console.log('First child current routes:', childGenotypes[0].length);
    //console.log('Second child current routes:', childGenotypes[1].length);
    //console.log('First child remaining clients:', this.remainingNodesFirstChild.size);
    //console.log('Second child remaining clients:', this.remainingNodesSecondChild.size);

    // Second part of each child
    currentIndex = 0;
    for (let i = 0; i < firstParent.length(); i++) {
      for (let j = 0; j < firstParent.get(i).length(); j++) {
        if (currentIndex >= this.crossoverIndex) {
          const node = firstParent.get(i).get(j);
          if (node instanceof ClientNode) {
            if (this.remainingNodesSecondChild.has(node.id)) {
              childGenotypes[1][childGenotypes[1].length - 1].pushBack(node);
              this.remainingNodesSecondChild.delete(node.id);
            }
          } else {
            if (childGenotypes[1].length < numberRoutes) {
              newRoute = new List();
              newRoute.pushBack(node);
              childGenotypes[1].push(newRoute);
            }
          }
        } else {
          currentIndex++;
        }
      }
    }
    
    currentIndex = 0;
    for (let i = 0; i < secondParent.length(); i++) {
      for (let j = 0; j < secondParent.get(i).length(); j++) {
        if (currentIndex >= this.crossoverIndex) {
          const node = secondParent.get(i).get(j);
          if (node instanceof ClientNode) {
            if (this.remainingNodesFirstChild.has(node.id)) {
              childGenotypes[0][childGenotypes[0].length - 1].pushBack(node);
              this.remainingNodesFirstChild.delete(node.id);
            }
          } else {
            if (childGenotypes[0].length < numberRoutes) {
              newRoute = new List();
              newRoute.pushBack(node);
              childGenotypes[0].push(newRoute);
            }
          }
        } else {
          currentIndex++;
        }
      }
    }
    
    //console.log('First child current routes:', childGenotypes[0].length);
    //console.log('Second child current routes:', childGenotypes[1].length);
    //console.log('First child remaining clients:', this.remainingNodesFirstChild.size);
    //console.log('Second child remaining clients:', this.remainingNodesSecondChild.size);

    // Completing the number of total routes for both children.
    // Depots are assigned randomly

    const depotRange = new NumericRange(0, this.depotNodes.length - 1);

    while (childGenotypes[0].length < numberRoutes) {
      newRoute = new List();
      const depotIndex = Generator.generateInteger(depotRange);
      newRoute.pushBack(this.depotNodes[depotIndex]);
      childGenotypes[0].push(newRoute);
    }
    
    while (childGenotypes[1].length < numberRoutes) {
      newRoute = new List();
      const depotIndex = Generator.generateInteger(depotRange);
      newRoute.pushBack(this.depotNodes[depotIndex]);
      childGenotypes[1].push(newRoute);
    }

    //console.log('First child current routes:', childGenotypes[0].length);
    //console.log('Second child current routes:', childGenotypes[1].length);
    //console.log('First child remaining clients:', this.remainingNodesFirstChild.size);
    //console.log('Second child remaining clients:', this.remainingNodesSecondChild.size);

    // Inserting remaining clients in random routes for both children

    const routeRange = new NumericRange(0, childGenotypes[0].length - 1);

    this.remainingNodesFirstChild.forEach((client) => {
      const routeIndex = Generator.generateInteger(routeRange);
      childGenotypes[0][routeIndex].pushBack(this.clientNodes[client]);
    });
    
    this.remainingNodesSecondChild.forEach((client) => {
      const routeIndex = Generator.generateInteger(routeRange);
      childGenotypes[1][routeIndex].pushBack(this.clientNodes[client]);
    });
    
    // Constructing new indivuals starting from their genotypes
    const firstChild = new params.individualConstructor(childGenotypes[0]);
    const secondChild = new params.individualConstructor(childGenotypes[1]);
    
    //console.log('First child:', firstChild.toString());
    //console.log('Second child:', secondChild.toString());

    return [
      firstChild,
      secondChild
    ];
  }

  public cross(
    firstParent: RouteIndividual,
    secondParent: RouteIndividual,
    engine = Generator.DEFAULT_ENGINE,
    instance: ProblemInstance
  ): Array<RouteIndividual> {
    this.depotNodes = instance.depotNodes;
    this.clientNodes = instance.clientNodes;
    const crossoverResult = this.crossWith(firstParent, secondParent, {
      engine,
      individualConstructor: ListIndividual
    });

    return crossoverResult;
  }

  protected getGenotypeValues(
    firstParent: RouteIndividual,
    secondParent: RouteIndividual,
    params: OnePointCrossoverParams,
    index: number
  ): {
    first: List<BaseNode>;
    second: List<BaseNode>;
  } {
    const first = new List<BaseNode>();
    const second = new List<BaseNode>();

    return {
      first,
      second,
    }
  };
}
