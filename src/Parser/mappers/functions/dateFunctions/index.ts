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
          {
            type: [NUMBER_NODE_TYPE],
            required: false,
          },
          {
            type: [NUMBER_NODE_TYPE],
            required: false,
          },
          {
            type: [NUMBER_NODE_TYPE],
            required: false,
          },
        ],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATE,
        sqlFn: dateFunctionsToSqlMap.DATE,
        jsSafeFn: dateFunctionsToJsMap.SAFEDATE,
        sqlSafeFn: dateFunctionsToSqlMap.SAFEDATE,
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
        jsSafeFn: dateFunctionsToJsMap.SAFEDATEADD,
        sqlSafeFn: dateFunctionsToSqlMap.SAFEDATEADD,
      },
    ],
    DATESUB: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          }, // date
          { type: [NUMBER_NODE_TYPE] }, // amount
          { type: [LITERAL_NODE_TYPE] }, // unit (e.g., "days", "months")
        ],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATESUB,
        sqlFn: dateFunctionsToSqlMap.DATESUB,
        jsSafeFn: dateFunctionsToJsMap.SAFEDATESUB,
        sqlSafeFn: dateFunctionsToSqlMap.SAFEDATESUB,
      },
    ],
    DATEDIFF: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          }, // end date
          { type: [DATE_NODE_TYPE] }, // start date
          { type: [LITERAL_NODE_TYPE] }, // unit
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATEDIFF,
        sqlFn: dateFunctionsToSqlMap.DATEDIFF,
        jsSafeFn: dateFunctionsToJsMap.SAFEDATEDIFF,
        sqlSafeFn: dateFunctionsToSqlMap.SAFEDATEDIFF,
      },
    ],
    DATEFORMAT: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
          { type: [LITERAL_NODE_TYPE] }, // format string
        ],
        returnType: [LITERAL_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATEFORMAT,
        sqlFn: dateFunctionsToSqlMap.DATEFORMAT,
      },
    ],
    DATEPARSE: [
      {
        args: [
          // in airtable arg locale last
          {
            type: [LITERAL_NODE_TYPE],
          }, // string
          { type: [LITERAL_NODE_TYPE] }, // format
        ],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.DATEPARSE,
        sqlFn: dateFunctionsToSqlMap.DATEPARSE,
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
    QUARTER: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.QUARTER,
        sqlFn: dateFunctionsToSqlMap.QUARTER,
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
    // NOW: [
    //   {
    //     args: [],
    //     returnType: [DATE_NODE_TYPE],
    //     jsFn: dateFunctionsToJsMap.NOW,
    //     sqlFn: dateFunctionsToSqlMap.NOW,
    //   },
    // ],
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
    // TODAY: [
    //   {
    //     args: [],
    //     returnType: [DATE_NODE_TYPE],
    //     jsFn: dateFunctionsToJsMap.TODAY,
    //     sqlFn: dateFunctionsToSqlMap.TODAY,
    //   },
    // ],
    WEEKDAY: [
      {
        args: [
          {
            type: [DATE_NODE_TYPE],
          },
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
        ],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.WEEKNUM,
        sqlFn: dateFunctionsToSqlMap.WEEKNUM,
      },
    ],
    SETYEAR: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETYEAR,
        sqlFn: dateFunctionsToSqlMap.SETYEAR,
      },
    ],
    SETQUARTER: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETQUARTER,
        sqlFn: dateFunctionsToSqlMap.SETQUARTER,
      },
    ],
    SETMONTH: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETMONTH,
        sqlFn: dateFunctionsToSqlMap.SETMONTH,
      },
    ],
    SETDAY: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETDAY,
        sqlFn: dateFunctionsToSqlMap.SETDAY,
      },
    ],
    SETWEEKNUM: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETWEEKNUM,
        sqlFn: dateFunctionsToSqlMap.SETWEEKNUM,
      },
    ],
    SETWEEKDAY: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETWEEKDAY,
        sqlFn: dateFunctionsToSqlMap.SETWEEKDAY,
      },
    ],
    SETTIME: [
      {
        args: [
          { type: [DATE_NODE_TYPE] },
          { type: [NUMBER_NODE_TYPE] },
          { type: [NUMBER_NODE_TYPE] },
          { type: [NUMBER_NODE_TYPE] },
        ],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETTIME,
        sqlFn: dateFunctionsToSqlMap.SETTIME,
      },
    ],
    SETHOUR: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETHOUR,
        sqlFn: dateFunctionsToSqlMap.SETHOUR,
      },
    ],
    SETMINUTE: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETMINUTE,
        sqlFn: dateFunctionsToSqlMap.SETMINUTE,
      },
    ],
    SETSECOND: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [NUMBER_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.SETSECOND,
        sqlFn: dateFunctionsToSqlMap.SETSECOND,
      },
    ],
    STARTOF: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [LITERAL_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.STARTOF,
        sqlFn: dateFunctionsToSqlMap.STARTOF,
      },
    ],
    ENDOF: [
      {
        args: [{ type: [DATE_NODE_TYPE] }, { type: [LITERAL_NODE_TYPE] }],
        returnType: [DATE_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.ENDOF,
        sqlFn: dateFunctionsToSqlMap.ENDOF,
      },
    ],
    TIMESTAMP: [
      {
        args: [{ type: [DATE_NODE_TYPE] }],
        returnType: [NUMBER_NODE_TYPE],
        jsFn: dateFunctionsToJsMap.TIMESTAMP,
        sqlFn: dateFunctionsToSqlMap.TIMESTAMP,
      },
    ],
  };
