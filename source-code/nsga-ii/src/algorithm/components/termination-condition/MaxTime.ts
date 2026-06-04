import { TerminationCondition } from './TerminationCondition';

export class MaxTime implements TerminationCondition {
  private maxNumberSeconds = 0;

  constructor(maxNumberSeconds: number) {
    this.maxNumberSeconds = maxNumberSeconds;
  }

  public isSatisfied(currentNumberSeconds: number): boolean {
    return currentNumberSeconds >= this.maxNumberSeconds;
  }
}
