import { NodeTypesValues } from '../../../constants/nodeTypes';

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
// | 'OR'
// | 'AND';

type IFormatterFunc = (left: string, right: string) => string;

export interface IOperator {
  returnType: NodeTypesValues;
  operandType: NodeTypesValues | null;
  jsFn: IFormatterFunc;
  sqlFn: IFormatterFunc;
}
