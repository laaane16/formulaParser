import ExpressionNode from '../../../AST/ExpressionNode';
import { ValidTextFunctionsNames } from './types';

export const textFunctionsToSqlMap: Record<
  ValidTextFunctionsNames,
  (args: ExpressionNode[]) => string
> = {
  CONCAT: (args) => {
    return `CONCAT(${args.map((i) => i)})`;
  },
  TRIM: (args) => '',
  SEARCH: (args) => '',
  REPLACE: (args) => '',
  LOWER: (args) => '',
  UPPER: (args) => '',
  REPEAT: (args) => '',
  SUBSTRING: (args) => '',
  LEFT: (args) => '',
  RIGHT: (args) => '',
  LEN: (args) => '',
};
