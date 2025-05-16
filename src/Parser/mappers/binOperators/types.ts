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
  | 'LESS_OR_EQUAL'
  | 'OR'
  | 'AND'
  | 'CONCATENATION';

type IFormatterFunc = (left: string, right: string) => string;

interface BaseOperator {
  returnType: NodeTypesValues;
  operandType: NodeTypesValues | NodeTypesValues[] | null;
  jsFn: IFormatterFunc;
  sqlFn: IFormatterFunc;
}
interface SafeOperator extends BaseOperator {
  jsSafeFn: IFormatterFunc;
  sqlSafeFn: IFormatterFunc;
}

export type Operator = BaseOperator | SafeOperator;

export function isSafeOperator(op: Operator): op is SafeOperator {
  return 'jsSafeFn' in op && 'sqlSafeFn' in op;
}
