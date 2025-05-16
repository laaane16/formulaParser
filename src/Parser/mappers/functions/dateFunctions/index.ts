import { UNIT } from '../../../../constants/date';
import {
  BOOLEAN_NODE_TYPE,
  DATE_NODE_TYPE,
  LITERAL_NODE_TYPE,
  NUMBER_NODE_TYPE,
} from '../../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { dateFunctionsToJsMap } from './js';
import { dateFunctionsToSqlMap } from './sql';
import { ValidDateFunctionsNames } from './types';

export const dateFunctions: Record<ValidDateFunctionsNames, VariableFunction> =
  {
    DATE: [
      {
        args: [
          {
            type: [NUMBER_NODE_TYPE],
          },
          {
            type: [NUMBER_NODE_TYPE],
          },
          {
            type: [NUMBER_NODE_TYPE],
          },
        ],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATE,
        sqlFn: dateFunctionsToSqlMap.DATE,
      },
    ],
    DATEADD: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          }, // date
          { type: [NUMBER_NODE_TYPE] }, // amount
          { type: [LITERAL_NODE_TYPE] }, // unit (e.g., "days", "months")
        ],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATEADD,
        sqlFn: dateFunctionsToSqlMap.DATEADD,
        jsSafeFn: dateFunctionsToJsMap.SAFE_DATEADD,
        sqlSafeFn: dateFunctionsToSqlMap.SAFE_DATEADD,
      },
    ],
    DATETIME_DIFF: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          }, // end date
          { type: [DATE_NODE_TYPE] }, // start date
          { type: [LITERAL_NODE_TYPE] }, // unit
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATETIME_DIFF,
        sqlFn: dateFunctionsToSqlMap.DATETIME_DIFF,
        jsSafeFn: dateFunctionsToJsMap.SAFE_DATETIME_DIFF,
        sqlSafeFn: dateFunctionsToSqlMap.SAFE_DATETIME_DIFF,
      },
    ],
    DATETIME_FORMAT: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
          { type: [LITERAL_NODE_TYPE] }, // format string
        ],
        returnType: [LITERAL_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATETIME_FORMAT,
        sqlFn: dateFunctionsToSqlMap.DATETIME_FORMAT,
      },
    ],
    DATETIME_PARSE: [
      {
        args: [
          // in airtable arg locale last
          {
            type: [LITERAL_NODE_TYPE],
          }, // string
          { type: [LITERAL_NODE_TYPE] }, // format
        ],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATETIME_PARSE,
        sqlFn: dateFunctionsToSqlMap.DATETIME_PARSE,
      },
    ],
    DAY: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DAY,
        sqlFn: dateFunctionsToSqlMap.DAY,
      },
    ],
    HOUR: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.HOUR,
        sqlFn: dateFunctionsToSqlMap.HOUR,
      },
    ],
    IS_AFTER: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [BOOLEAN_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.IS_AFTER,
        sqlFn: dateFunctionsToSqlMap.IS_AFTER,
      },
    ],
    IS_BEFORE: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [BOOLEAN_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.IS_BEFORE,
        sqlFn: dateFunctionsToSqlMap.IS_BEFORE,
      },
    ],
    IS_SAME: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [BOOLEAN_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.IS_SAME,
        sqlFn: dateFunctionsToSqlMap.IS_SAME,
      },
    ],
    MINUTE: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.MINUTE,
        sqlFn: dateFunctionsToSqlMap.MINUTE,
      },
    ],
    MONTH: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.MONTH,
        sqlFn: dateFunctionsToSqlMap.MONTH,
      },
    ],
    NOW: [
      {
        args: [],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.NOW,
        sqlFn: dateFunctionsToSqlMap.NOW,
      },
    ],
    SECOND: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SECOND,
        sqlFn: dateFunctionsToSqlMap.SECOND,
      },
    ],
    TODAY: [
      {
        args: [],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.TODAY,
        sqlFn: dateFunctionsToSqlMap.TODAY,
      },
    ],
    WEEKDAY: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
          { type: [LITERAL_NODE_TYPE], required: false },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.WEEKDAY,
        sqlFn: dateFunctionsToSqlMap.WEEKDAY,
      },
    ],
    WEEKNUM: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
          { type: [LITERAL_NODE_TYPE], required: false },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.WEEKNUM,
        sqlFn: dateFunctionsToSqlMap.WEEKNUM,
      },
    ],
    YEAR: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.YEAR,
        sqlFn: dateFunctionsToSqlMap.YEAR,
      },
    ],
  };
