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
        {
          type: [NUMBER_NODE_TYPE],
          required: false,
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
        {
          type: [NUMBER_NODE_TYPE],
          required: false,
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.FLOOR,
      sqlFn: numberFunctionsToSqlMap.FLOOR,
    },
  ],
  ROUND: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
        {
          type: [NUMBER_NODE_TYPE],
          required: false,
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.ROUND,
      sqlFn: numberFunctionsToSqlMap.ROUND,
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
      jsSafeFn: numberFunctionsToJsMap.SAFEMOD,
      sqlSafeFn: numberFunctionsToSqlMap.SAFEMOD,
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

  SQRT: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.SQRT,
      sqlFn: numberFunctionsToSqlMap.SQRT,
      jsSafeFn: numberFunctionsToJsMap.SAFESQRT,
      sqlSafeFn: numberFunctionsToSqlMap.SAFESQRT,
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
  TONUMBER: [
    {
      args: [{ type: [] }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.TONUMBER,
      sqlFn: numberFunctionsToSqlMap.TONUMBER,
      jsSafeFn: numberFunctionsToJsMap.SAFETONUMBER,
      sqlSafeFn: numberFunctionsToSqlMap.SAFETONUMBER,
    },
  ],
  SIN: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.SIN,
      sqlFn: numberFunctionsToSqlMap.SIN,
    },
  ],
  COS: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.COS,
      sqlFn: numberFunctionsToSqlMap.COS,
    },
  ],
  TAN: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.TAN,
      sqlFn: numberFunctionsToSqlMap.TAN,
    },
  ],
  COT: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.COT,
      sqlFn: numberFunctionsToSqlMap.COT,
    },
  ],
  ASIN: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.ASIN,
      sqlFn: numberFunctionsToSqlMap.ASIN,
    },
  ],
  ACOS: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.ACOS,
      sqlFn: numberFunctionsToSqlMap.ACOS,
    },
  ],
  ATAN: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.ATAN,
      sqlFn: numberFunctionsToSqlMap.ATAN,
    },
  ],
  ACOT: [
    {
      args: [
        {
          type: [NUMBER_NODE_TYPE],
        },
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.ACOT,
      sqlFn: numberFunctionsToSqlMap.ACOT,
    },
  ],
  PI: [
    {
      args: [],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.PI,
      sqlFn: numberFunctionsToSqlMap.PI,
    },
  ],
  LN: [
    {
      args: [{ type: [NUMBER_NODE_TYPE] }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.LN,
      sqlFn: numberFunctionsToSqlMap.LN,
    },
  ],
  LOG: [
    {
      args: [{ type: [NUMBER_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.LOG,
      sqlFn: numberFunctionsToSqlMap.LOG,
    },
  ],
  LOG10: [
    {
      args: [{ type: [NUMBER_NODE_TYPE] }],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.LOG10,
      sqlFn: numberFunctionsToSqlMap.LOG10,
    },
  ],
  FIXED: [
    {
      args: [
        { type: [NUMBER_NODE_TYPE] },
        { type: [NUMBER_NODE_TYPE], required: false },
      ],
      returnType: [LITERAL_NODE_TYPE],
      jsFn: numberFunctionsToJsMap.FIXED,
      sqlFn: numberFunctionsToSqlMap.FIXED,
    },
  ],
};
