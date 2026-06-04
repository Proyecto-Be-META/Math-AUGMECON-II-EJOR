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
import { BaseNode, ClientNode } from '../../../node';
import { shuffle} from './utils';

export type BaseRouteCrossoverParams = CrossoverParams<
  RouteIndividual,
  List<BaseNode>
>;

export abstract class BaseRouteCrossover extends BaseCrossover<
  RouteIndividual,
  List<BaseNode>,
  BaseRouteCrossoverParams
> {
  protected clientNodes: ClientNode[];
  protected remainingNodesFirstChild: ClientNode[];
  protected remainingNodesSecondChild: ClientNode[];
  protected staticRouteIndex: number;

  constructor() {
    super();
    this.clientNodes = [];
    this.remainingNodesFirstChild = [];
    this.remainingNodesSecondChild = [];
    this.staticRouteIndex = -1;
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
    params: BaseRouteCrossoverParams
  ): [RouteIndividual, RouteIndividual] {
    this.checkParents(firstParent, secondParent);

    const numberRoutes = firstParent.length();
    const genotypes: [List<BaseNode>[], List<BaseNode>[]] = [[], []];
    this.remainingNodesFirstChild = Array.from(this.clientNodes);
    this.remainingNodesSecondChild = Array.from(this.clientNodes);
    this.staticRouteIndex = Generator.generateInteger(
      new NumericRange(0, numberRoutes- 1)
    );

    //console.log('Static route index:', this.staticRouteIndex);
    //console.log('First parent:', firstParent.toString());
    //console.log('Second parent:', secondParent.toString());

    // Static Route
    const result = this.getStaticRouteGenotypeValues(
      firstParent,
      secondParent,
      this.staticRouteIndex
    );

    genotypes[0][this.staticRouteIndex] = result.first;
    genotypes[1][this.staticRouteIndex] = result.second;

    for (let i = 0; i < numberRoutes; i++) {
      if (i !== this.staticRouteIndex) {
        const result = this.getGenotypeValues(
          firstParent,
          secondParent,
          params,
          i
        );
        genotypes[0][i] = result.first;
        genotypes[1][i] = result.second;
      }
    }

    // Could be randomised?
    this.remainingNodesFirstChild = shuffle(this.remainingNodesFirstChild);
    this.remainingNodesFirstChild.forEach((node) => {
      const randomRouteIndex = Generator.generateInteger(
        new NumericRange(0, numberRoutes - 1)
      );
      genotypes[0][randomRouteIndex].pushBack(node)
    });

    // Could be randomised?
    this.remainingNodesSecondChild = shuffle(this.remainingNodesSecondChild);
    this.remainingNodesSecondChild.forEach((node) => {
      const randomRouteIndex = Generator.generateInteger(
        new NumericRange(0, numberRoutes - 1)
      );
      genotypes[1][randomRouteIndex].pushBack(node)
    });

    const firstChild = new params.individualConstructor(genotypes[0]);
    const secondChild = new params.individualConstructor(genotypes[1]);
    
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
    this.clientNodes = instance.clientNodes;
    // console.log(this.remainingNodesFirstChild);
    // console.log(this.remainingNodesSecondChild);
    const crossoverResult = this.crossWith(firstParent, secondParent, {
      engine,
      individualConstructor: ListIndividual
    });

    return crossoverResult;
  }

  protected abstract getStaticRouteGenotypeValues(
    firstParent: RouteIndividual,
    secondParent: RouteIndividual,
    index: number
  ): {
    first: List<BaseNode>;
    second: List<BaseNode>;
  };
}
