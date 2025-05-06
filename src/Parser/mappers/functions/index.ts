import { dateFunctions } from './dateFunctions';
import { textFunctions } from './textFunctions';
import { numberFunctions } from './numberFunctions';

import { ValidFunctionsNames, VariableFunction } from './types';

export const allFunctions: Record<ValidFunctionsNames, VariableFunction> = {
  ...textFunctions,
  ...numberFunctions,
  ...dateFunctions,
};
