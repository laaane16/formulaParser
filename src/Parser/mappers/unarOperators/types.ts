import { NodeTypesValues } from '../../../constants/nodeTypes';

export type ValidUnarOperatorsNames = 'NOT' | 'MINUS';

type IFormatterFunc = (operand: string) => string;

export interface IOperator {
  types: NodeTypesValues[];
  jsFn: IFormatterFunc;
  sqlFn: IFormatterFunc;
}
