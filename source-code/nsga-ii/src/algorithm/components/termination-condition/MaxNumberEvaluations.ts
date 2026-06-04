import { TerminationCondition } from './TerminationCondition';

export class MaxNumberEvaluations implements TerminationCondition {
  private maxNumberEvaluations = 0;

  constructor(maxNumberEvaluations: number) {
    this.maxNumberEvaluations = maxNumberEvaluations;
  }

  public isSatisfied(currentNumberEvaluations: number): boolean {
    return currentNumberEvaluations >= this.maxNumberEvaluations;
  }
}
