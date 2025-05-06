import {
  BOOLEAN_NODE_TYPE,
  NULL_NODE_TYPE,
} from '../../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { keywordFunctionsToJsMap } from './js';
import { keywordFunctionsToSqlMap } from './sql';
import { ValidKeywordFunctionsNames } from './types';

export const keywordFunctions: Record<
  ValidKeywordFunctionsNames,
  VariableFunction
> = {
  ISNULL: [
    {
      args: [{ type: [] }],
      returnType: [BOOLEAN_NODE_TYPE],
      jsFn: keywordFunctionsToJsMap.ISNULL,
      sqlFn: keywordFunctionsToSqlMap.ISNULL,
    },
  ],
};
