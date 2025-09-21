import { ARRAY_WITH_ITEMS_NODE, BOOLEAN_ARRAY_NODE_TYPE, BOOLEAN_NODE_TYPE, DATE_ARRAY_NODE_TYPE, DATE_NODE_TYPE, LITERAL_ARRAY_NODE_TYPE, LITERAL_NODE_TYPE, NESTED_ARRAY_WITH_ITEMS_NODE, NESTED_BOOLEAN_ARRAY_NODE_TYPE, NESTED_DATE_ARRAY_NODE_TYPE, NESTED_LITERAL_ARRAY_NODE_TYPE, NESTED_NUMBER_ARRAY_NODE_TYPE, NUMBER_ARRAY_NODE_TYPE, NUMBER_NODE_TYPE } from '../../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { arrayFunctionsToJsMap } from './js';
import { arrayFunctionsToSqlMap } from './sql';
import { ValidArrayFunctionsNames } from './types';

export const arrayFunctions: Record<ValidArrayFunctionsNames, VariableFunction> = {
  INDEX: [
    {
      args: [
        {type: [LITERAL_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]}
      ],
      returnType: [LITERAL_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.INDEX,
      sqlFn: arrayFunctionsToSqlMap.INDEX
    },
    {
      args: [
        {type: [NUMBER_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]}
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.INDEX,
      sqlFn: arrayFunctionsToSqlMap.INDEX
    },
    {
      args: [
        {type: [DATE_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]}
      ],
      returnType: [DATE_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.INDEX,
      sqlFn: arrayFunctionsToSqlMap.INDEX
    },
    {
      args: [
        {type: [BOOLEAN_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]}
      ],
      returnType: [BOOLEAN_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.INDEX,
      sqlFn: arrayFunctionsToSqlMap.INDEX
    },
    {
      args: [
        {type: [ARRAY_WITH_ITEMS_NODE]},
        {type: [NUMBER_NODE_TYPE]},
        {type: [LITERAL_NODE_TYPE], required: false}
      ],
      returnType: [LITERAL_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.INDEXFORITEMS,
      sqlFn: arrayFunctionsToSqlMap.INDEXFORITEMS
    }
  ],
  ID: [
    {
      args: [
        {type: [ARRAY_WITH_ITEMS_NODE]},
      ],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.ID,
      sqlFn: arrayFunctionsToSqlMap.ID
    }
  ],
  NAME: [
    {
      args: [
        {type: [ARRAY_WITH_ITEMS_NODE]},
      ],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.NAME,
      sqlFn: arrayFunctionsToSqlMap.NAME
    }
  ],
  COUNT: [
    {
      args: [
        {
          type: [
            ARRAY_WITH_ITEMS_NODE,
            LITERAL_ARRAY_NODE_TYPE,
            NUMBER_ARRAY_NODE_TYPE,
            DATE_ARRAY_NODE_TYPE,
            BOOLEAN_ARRAY_NODE_TYPE,
            NESTED_ARRAY_WITH_ITEMS_NODE,
            NESTED_BOOLEAN_ARRAY_NODE_TYPE,
            NESTED_LITERAL_ARRAY_NODE_TYPE,
            NESTED_NUMBER_ARRAY_NODE_TYPE,
            NESTED_DATE_ARRAY_NODE_TYPE,
            NESTED_ARRAY_WITH_ITEMS_NODE
          ]
        }
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.COUNT,
      sqlFn: arrayFunctionsToSqlMap.COUNT
    }
  ],
  UNIQUE: [
    {
      args: [{type: [LITERAL_ARRAY_NODE_TYPE]}],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.UNIQUE,
      sqlFn: arrayFunctionsToSqlMap.UNIQUE
    },
    {
      args: [{type: [NUMBER_ARRAY_NODE_TYPE]}],
      returnType: [NUMBER_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.UNIQUE,
      sqlFn: arrayFunctionsToSqlMap.UNIQUE
    },
    {
      args: [{type: [BOOLEAN_ARRAY_NODE_TYPE]}],
      returnType: [BOOLEAN_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.UNIQUE,
      sqlFn: arrayFunctionsToSqlMap.UNIQUE
    },
    {
      args: [{type: [DATE_ARRAY_NODE_TYPE]}],
      returnType: [DATE_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.UNIQUE,
      sqlFn: arrayFunctionsToSqlMap.UNIQUE
    },
    {
      args: [{type: [ARRAY_WITH_ITEMS_NODE]}, {type: [LITERAL_NODE_TYPE], required: false}],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.UNIQUEFORITEMS,
      sqlFn: arrayFunctionsToSqlMap.UNIQUEFORITEMS
    }
  ],
  SLICE: [
    {
      args: [
        {type: [LITERAL_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false}
      ],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SLICE,
      sqlFn: arrayFunctionsToSqlMap.SLICE
    },
    {
      args: [
        {type: [NUMBER_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false}
      ],
      returnType: [NUMBER_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SLICE,
      sqlFn: arrayFunctionsToSqlMap.SLICE
    },
    {
      args: [
        {type: [DATE_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false}
      ],
      returnType: [DATE_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SLICE,
      sqlFn: arrayFunctionsToSqlMap.SLICE
    },
    {
      args: [
        {type: [BOOLEAN_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false}
      ],
      returnType: [BOOLEAN_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SLICE,
      sqlFn: arrayFunctionsToSqlMap.SLICE
    },
    {
      args: [
        {type: [ARRAY_WITH_ITEMS_NODE]},
        {type: [NUMBER_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false},
        {type: [LITERAL_NODE_TYPE], required: false}
      ],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SLICEFORITEMS,
      sqlFn: arrayFunctionsToSqlMap.SLICEFORITEMS
    }
  ],
  FIND: [
    {
      args: [
        {type: [LITERAL_ARRAY_NODE_TYPE]},
        {type: [LITERAL_NODE_TYPE]},
      ],
      returnType: [LITERAL_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FIND,
      sqlFn: arrayFunctionsToSqlMap.FIND
    },
    {
      args: [
        {type: [NUMBER_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]},
      ],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FIND,
      sqlFn: arrayFunctionsToSqlMap.FIND
    },
    {
      args: [
        {type: [DATE_ARRAY_NODE_TYPE]},
        {type: [DATE_NODE_TYPE]},
      ],
      returnType: [DATE_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FIND,
      sqlFn: arrayFunctionsToSqlMap.FIND
    },
    {
      args: [
        {type: [BOOLEAN_ARRAY_NODE_TYPE]},
        {type: [BOOLEAN_NODE_TYPE]},
      ],
      returnType: [BOOLEAN_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FIND,
      sqlFn: arrayFunctionsToSqlMap.FIND
    },
    {
      args: [
        {type: [ARRAY_WITH_ITEMS_NODE]},
        {type: [LITERAL_NODE_TYPE]},
        {type: [LITERAL_NODE_TYPE], required: false}
      ],
      returnType: [LITERAL_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FINDFORITEMS,
      sqlFn: arrayFunctionsToSqlMap.FINDFORITEMS
    }
  ],
  FILTER: [
    {
      args: [
        {type: [LITERAL_ARRAY_NODE_TYPE]},
        {type: [LITERAL_NODE_TYPE]},
      ],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FILTER,
      sqlFn: arrayFunctionsToSqlMap.FILTER
    },
    {
      args: [
        {type: [NUMBER_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE]},
      ],
      returnType: [NUMBER_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FILTER,
      sqlFn: arrayFunctionsToSqlMap.FILTER
    },
    {
      args: [
        {type: [DATE_ARRAY_NODE_TYPE]},
        {type: [DATE_NODE_TYPE]},
      ],
      returnType: [DATE_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FILTER,
      sqlFn: arrayFunctionsToSqlMap.FILTER
    },
    {
      args: [
        {type: [BOOLEAN_ARRAY_NODE_TYPE]},
        {type: [BOOLEAN_NODE_TYPE]},
      ],
      returnType: [BOOLEAN_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FILTER,
      sqlFn: arrayFunctionsToSqlMap.FILTER
    },
    {
      args: [
        {type: [ARRAY_WITH_ITEMS_NODE]},
        {type: [LITERAL_NODE_TYPE]},
        {type: [LITERAL_NODE_TYPE], required: false}
      ],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.FILTERFORITEMS,
      sqlFn: arrayFunctionsToSqlMap.FILTERFORITEMS
    }
  ],
  SORT: [
      {
      args: [
        {type: [LITERAL_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false},
      ],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SORT,
      sqlFn: arrayFunctionsToSqlMap.SORT
    },
    {
      args: [
        {type: [NUMBER_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false},
      ],
      returnType: [NUMBER_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SORTNUMBERS,
      sqlFn: arrayFunctionsToSqlMap.SORTNUMBERS
    },
    {
      args: [
        {type: [DATE_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false},
      ],
      returnType: [DATE_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SORTDATES,
      sqlFn: arrayFunctionsToSqlMap.SORTDATES
    },
    {
      args: [
        {type: [BOOLEAN_ARRAY_NODE_TYPE]},
        {type: [NUMBER_NODE_TYPE], required: false},
      ],
      returnType: [BOOLEAN_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SORT,
      sqlFn: arrayFunctionsToSqlMap.SORT
    },
    {
      args: [
        {type: [ARRAY_WITH_ITEMS_NODE]},
        {type: [NUMBER_NODE_TYPE], required: false},
        {type: [LITERAL_NODE_TYPE], required: false}
      ],
      returnType: [LITERAL_ARRAY_NODE_TYPE],
      jsFn: arrayFunctionsToJsMap.SORTFORITEMS,
      sqlFn: arrayFunctionsToSqlMap.SORTFORITEMS
    }
  ],
  // FLATTEN: [
  //     {
  //     args: [
  //       {type: [NESTED_LITERAL_ARRAY_NODE_TYPE]},
  //     ],
  //     returnType: [LITERAL_ARRAY_NODE_TYPE],
  //     jsFn: arrayFunctionsToJsMap.FLATTEN,
  //     sqlFn: arrayFunctionsToSqlMap.FLATTEN
  //   },
  //   {
  //     args: [
  //       {type: [NESTED_NUMBER_ARRAY_NODE_TYPE]},
  //     ],
  //     returnType: [NUMBER_ARRAY_NODE_TYPE],
  //     jsFn: arrayFunctionsToJsMap.FLATTEN,
  //     sqlFn: arrayFunctionsToSqlMap.FLATTEN
  //   },
  //   {
  //     args: [
  //       {type: [NESTED_DATE_ARRAY_NODE_TYPE]},
  //     ],
  //     returnType: [DATE_ARRAY_NODE_TYPE],
  //     jsFn: arrayFunctionsToJsMap.FLATTEN,
  //     sqlFn: arrayFunctionsToSqlMap.FLATTEN
  //   },
  //   {
  //     args: [
  //       {type: [NESTED_BOOLEAN_ARRAY_NODE_TYPE]},
  //     ],
  //     returnType: [BOOLEAN_ARRAY_NODE_TYPE],
  //     jsFn: arrayFunctionsToJsMap.FLATTEN,
  //     sqlFn: arrayFunctionsToSqlMap.FLATTEN
  //   },
  //   {
  //     args: [
  //       {type: [NESTED_ARRAY_WITH_ITEMS_NODE]},
  //       {type: [LITERAL_NODE_TYPE], required: false}
  //     ],
  //     returnType: [LITERAL_ARRAY_NODE_TYPE],
  //     jsFn: arrayFunctionsToJsMap.FLATTENFORITEMS,
  //     sqlFn: arrayFunctionsToSqlMap.FLATTENFORITEMS
  //   }
  // ]
}
