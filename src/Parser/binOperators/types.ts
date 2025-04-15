export type ValidBinOperatorsNames =
  | 'PLUS'
  | 'MINUS'
  | 'MULTIPLY'
  | 'DIVISION'
  | 'REMAINDER'
  | 'POWER'
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'GREATER'
  | 'GREATER_OR_EQUAL'
  | 'LESS'
  | 'LESS_OR_EQUAL';

type IFormatterFunc = (left: string, right: string) => string;

export interface IOperator {
  needTypeCheck: boolean;
  jsFn: IFormatterFunc;
  sqlFn: IFormatterFunc;
}
