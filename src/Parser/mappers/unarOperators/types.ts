import { NodeTypesValues } from '../../constants/nodeTypes';

export type ValidUnarOperatorsNames = 'NOT' | 'MINUS';

type IFormatterFunc = (operand: string) => string;

export interface IOperator {
  possibleTypes: NodeTypesValues[];
  jsFn: IFormatterFunc;
  sqlFn: IFormatterFunc;
}
