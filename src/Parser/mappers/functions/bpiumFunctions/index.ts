import {
  LITERAL_NODE_TYPE,
  NUMBER_NODE_TYPE,
} from '../../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { bpiumFunctionsToJsMap } from './js';
import { bpiumFunctionstoSqlMap } from './sql';
import { ValidBpiumFunctionsNames } from './types';

export const bpiumFunctions: Record<
  ValidBpiumFunctionsNames,
  VariableFunction
> = {
  RECORD_ID: [
    {
      args: [],
      returnType: [NUMBER_NODE_TYPE],
      jsFn: bpiumFunctionsToJsMap.RECORD_ID,
      sqlFn: bpiumFunctionstoSqlMap.RECORD_ID,
    },
  ],
  CATALOG_ID: [
    {
      args: [],
      returnType: [LITERAL_NODE_TYPE],
      jsFn: bpiumFunctionsToJsMap.CATALOG_ID,
      sqlFn: bpiumFunctionstoSqlMap.CATALOG_ID,
    },
  ],
};
