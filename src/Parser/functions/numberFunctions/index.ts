import NumberNode from '../../../AST/NumberNode';
import { NUMBER_NODE_TYPE } from '../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { numberFunctionsToJsMap } from './jsMapper';
import { numberFunctionsToSqlMap } from './sqlMapper';
import { ValidNumberFunctionsNames } from './types';

// ABS: (args) => '',
// CEIL: (args) => '',
// FLOOR: (args) => '',
// EXP: (args) => '',
// MOD: (args) => '',
// POWER: (args) => '',
// ROUND: (args) => '',
// SQRT: (args) => '',
// RANDOM: (args) => '',

export const numberFunctions: Record<
  ValidNumberFunctionsNames,
  VariableFunction
> = {
  RANDOM: [
    {
      args: [],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.RANDOM,
      sqlFn: numberFunctionsToSqlMap.RANDOM,
    },
  ],
};
