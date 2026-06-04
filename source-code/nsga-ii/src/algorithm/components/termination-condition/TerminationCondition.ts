export interface TerminationCondition {
  isSatisfied(currentValue: number): boolean;
}
