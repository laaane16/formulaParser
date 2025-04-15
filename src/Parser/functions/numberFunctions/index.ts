import { NUMBER_NODE_TYPE } from '../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { numberFunctionsToJsMap } from './jsMapper';
import { numberFunctionsToSqlMap } from './sqlMapper';
import { ValidNumberFunctionsNames } from './types';

export const numberFunctions: Record<
  ValidNumberFunctionsNames,
  VariableFunction
> = {
  ABS: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.ABS,
      sqlFn: numberFunctionsToSqlMap.ABS,
    },
  ],
  CEIL: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.CEIL,
      sqlFn: numberFunctionsToSqlMap.CEIL,
    },
  ],
  FLOOR: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.FLOOR,
      sqlFn: numberFunctionsToSqlMap.FLOOR,
    },
  ],
  EXP: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.EXP,
      sqlFn: numberFunctionsToSqlMap.EXP,
    },
  ],
  MOD: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.MOD,
      sqlFn: numberFunctionsToSqlMap.MOD,
    },
  ],
  POWER: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.POWER,
      sqlFn: numberFunctionsToSqlMap.POWER,
    },
  ],
  ROUND: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.ROUND,
      sqlFn: numberFunctionsToSqlMap.RANDOM,
    },
  ],
  SQRT: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.SQRT,
      sqlFn: numberFunctionsToSqlMap.SQRT,
    },
  ],
  RANDOM: [
    {
      args: [],
      returnType: NUMBER_NODE_TYPE,
      jsFn: numberFunctionsToJsMap.RANDOM,
      sqlFn: numberFunctionsToSqlMap.RANDOM,
    },
  ],
};
