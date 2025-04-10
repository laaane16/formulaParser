import ExpressionNode from '../../AST/ExpressionNode';
import { ValidNumberFunctionsNames } from './types';

export const numberFunctionsToJsMap: Record<
  ValidNumberFunctionsNames,
  (args: ExpressionNode[]) => string
> = {
  // ABS: (args) => '',
  // CEIL: (args) => '',
  // FLOOR: (args) => '',
  // EXP: (args) => '',
  // MOD: (args) => '',
  // POWER: (args) => '',
  // ROUND: (args) => '',
  // SQRT: (args) => '',
  RANDOM: (args) => '',
};
