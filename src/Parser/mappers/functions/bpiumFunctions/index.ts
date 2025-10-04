import { LITERAL_NODE_TYPE } from '../../../../constants/nodeTypes';
import { VariableFunction } from '../types';

import { bpiumFunctionsToJsMap } from './js';
import { bpiumFunctionstoSqlMap } from './sql';
import { ValidBpiumFunctionsNames } from './types';

export const bpiumFunctions: Record<
  ValidBpiumFunctionsNames,
  VariableFunction
> = {
  RECORDID: [
    {
      args: [],
      returnType: [LITERAL_NODE_TYPE],
      jsFn: bpiumFunctionsToJsMap.RECORDID,
      sqlFn: bpiumFunctionstoSqlMap.RECORDID,
    },
  ],
  CATALOGID: [
    {
      args: [],
      returnType: [LITERAL_NODE_TYPE],
      jsFn: bpiumFunctionsToJsMap.CATALOGID,
      sqlFn: bpiumFunctionstoSqlMap.CATALOGID,
    },
  ],
};
