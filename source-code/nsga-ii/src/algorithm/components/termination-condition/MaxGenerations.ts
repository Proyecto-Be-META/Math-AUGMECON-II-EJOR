import { TerminationCondition } from './TerminationCondition';

export class MaxGenerations implements TerminationCondition {
  private maxGenerations = 0;

  constructor(maxGenerations: number) {
    this.maxGenerations = maxGenerations;
  }

  public isSatisfied(currentGenerations: number): boolean {
    return currentGenerations >= this.maxGenerations;
  }
}
