import {
  LITERAL_NODE_TYPE,
  NUMBER_NODE_TYPE,
} from '../../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { numberFunctionsToJsMap } from './js';
import { numberFunctionsToSqlMap } from './sql';
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
      returnType: [NUMBER_NODE_TYPE],
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
      returnType: [NUMBER_NODE_TYPE],
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
      returnType: [NUMBER_NODE_TYPE],
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
      returnType: [NUMBER_NODE_TYPE],
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
      returnType: [NUMBER_NODE_TYPE],
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
      returnType: [NUMBER_NODE_TYPE],
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
      returnType: [NUMBER_NODE_TYPE],
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
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.SQRT,
      sqlFn: numberFunctionsToSqlMap.SQRT,
      jsSafeFn: numberFunctionsToJsMap.SAFE_SQRT,
      sqlSafeFn: numberFunctionsToSqlMap.SAFE_SQRT,
      filterError: ([num]: string[]) => `${num} != 0`,
    },
  ],
  RANDOM: [
    {
      args: [],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.RANDOM,
      sqlFn: numberFunctionsToSqlMap.RANDOM,
    },
  ],
  SUM: [
    {
      args: [{ type: [NUMBER_NODE_TYPE], many: true }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.SUM,
      sqlFn: numberFunctionsToSqlMap.SUM,
    },
  ],
  AVERAGE: [
    {
      args: [{ type: [NUMBER_NODE_TYPE], many: true }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.AVERAGE,
      sqlFn: numberFunctionsToSqlMap.AVERAGE,
    },
  ],
  MIN: [
    {
      args: [{ type: [NUMBER_NODE_TYPE], many: true }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.MIN,
      sqlFn: numberFunctionsToSqlMap.MIN,
    },
  ],
  MAX: [
    {
      args: [{ type: [NUMBER_NODE_TYPE], many: true }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.MAX,
      sqlFn: numberFunctionsToSqlMap.MAX,
    },
  ],
  TO_NUMBER: [
    {
      args: [{ type: [LITERAL_NODE_TYPE] }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.TO_NUMBER,
      sqlFn: numberFunctionsToSqlMap.TO_NUMBER,
      jsSafeFn: numberFunctionsToJsMap.SAFE_TO_NUMBER,
      sqlSafeFn: numberFunctionsToSqlMap.SAFE_TO_NUMBER,

      filterError: ([arg]) => `${arg} ~ '^\\d+(\\.\\d+)?$'`,
    },
  ],
};
