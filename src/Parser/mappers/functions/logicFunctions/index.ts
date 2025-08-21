import { BOOLEAN_NODE_TYPE } from '../../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { logicFunctionsToJsMap } from './js';
import { logicFunctionsToSqlMap } from './sql';
import { ValidLogicFunctionsNames } from './types';

export const logicFunctions: Record<
  ValidLogicFunctionsNames,
  VariableFunction
> = {
  ISEMPTY: [
    {
      args: [
        {
          type: [],
        },
      ],
      returnType: [BOOLEAN_NODE_TYPE],
      jsFn: logicFunctionsToJsMap.ISEMPTY,
      sqlFn: logicFunctionsToSqlMap.ISEMPTY,
      specialWorkWithNull: true,
    },
  ],
  // IFEMPTY: [
  //   {
  //     args: [
  //       {
  //         type: [],
  //       },
  //     ],
  //     returnType: [BOOLEAN_NODE_TYPE],
  //     jsFn: logicFunctionsToJsMap.ISEMPTY,
  //     sqlFn: logicFunctionsToSqlMap.ISEMPTY,
  //     specialWorkWithNull: true,
  //   },
  // ],
};
