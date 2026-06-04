import {
  checkAllClientsWereVisited,
  isCapacityRestrictionSatisfied,
  ProblemInstance
} from '../../..';
import { RouteIndividual } from '../../../models/RouteIndevidual';

/**
 * If the individual isn't feasible, it increases the infeasibility degree so it
 * isn't selected in the next generation.
 * @param individual Individual to apply the penalty function
 * @param instance Problem instance
 * @returns Infeasibility degree
 */
export function getInfeasibilityDegree(
  individual: RouteIndividual,
  instance: ProblemInstance
): number {
  const demandNotSatisfied = isCapacityRestrictionSatisfied(
    individual,
    instance.vehicleCapacity,
    instance
  );
  let infeasibilityDegree = demandNotSatisfied * Math.pow(10, 3);

  const numberClientsNotVisited = checkAllClientsWereVisited(instance, individual);
  infeasibilityDegree += (numberClientsNotVisited * Math.pow(10, 6));

  return infeasibilityDegree;
}
