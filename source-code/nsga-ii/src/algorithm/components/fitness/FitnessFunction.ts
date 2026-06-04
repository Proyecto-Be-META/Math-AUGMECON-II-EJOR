import { FitnessFunction, List } from 'genetics-js';
import { RouteIndividual } from '../../../models/RouteIndevidual';
import { BaseNode } from '../../../node';
import { euclideanDistance } from '../../../utils';
import { SimpleMemetic } from '../../memetic/SimpleMemetic';
import { NSGAII } from '../../nsga/NSGAII';

export const getTime: FitnessFunction<
  RouteIndividual,
  List<BaseNode>
> = (individual: RouteIndividual) => {
  const arrivalTimes: number[] = [];

  individual.forEach((list) => {
    let previousNode: BaseNode;
    let routeTime = 0;

    list.forEach((node) => {
      if (previousNode !== undefined) {
        routeTime += euclideanDistance(previousNode, node);
      }
      previousNode = node;
      arrivalTimes.push(routeTime);
    });
  });
  
  const time = arrivalTimes.reduce((total, current) => total + current);

  SimpleMemetic.increaseCurrentEvaluation();
  NSGAII.increaseCurrentEvaluation();
  return time;
};

export const getDistance: FitnessFunction<
  RouteIndividual,
  List<BaseNode>
> = (individual: RouteIndividual) => {

  const distances: number[] = [];

  individual.forEach((list) => {
    let previousNode: BaseNode;
    let routeDist = 0;

    list.forEach((node) => {
      if (previousNode !== undefined) {
        routeDist += euclideanDistance(previousNode, node);
      }
      previousNode = node;
    });

    distances.push(routeDist);
  });
  
  const dist = distances.reduce((total, current) => total + current);

  // It is not required to increase the number of evaluations
  // since getTime is responsible for that task and is always
  // called together with this method
  return dist;
};
