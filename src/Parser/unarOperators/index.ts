import { NUMBER_NODE_TYPE } from '../../constants/nodeTypes';
import { IOperator, ValidUnarOperatorsNames } from './types';

// empty array in possible types means all types are valid
export const allUnarOperators: Record<ValidUnarOperatorsNames, IOperator> = {
  NOT: {
    possibleTypes: [],
    jsFn: (operand) => `! ${operand}`,
    sqlFn: (operand) => `NOT ${operand}`,
  },
  MINUS: {
    possibleTypes: [NUMBER_NODE_TYPE],
    jsFn: (operand) => `- ${operand}`,
    sqlFn: (operand) => `- ${operand}`,
  },
};
