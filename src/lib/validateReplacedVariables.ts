import { FIND_VARIABLES_REGEXP } from '../constants/templates';
import { FormulaError } from './exceptions';

export const validateReplacedVariables = (
  formula: string,
  values: Record<string, unknown>,
) => {
  const variableRegex = FIND_VARIABLES_REGEXP;
  const missingVariables: string[] = [];

  let match;
  while ((match = variableRegex.exec(formula)) !== null) {
    const varName = match[1];
    if (!(varName in values)) {
      missingVariables.push(varName);
    }
  }

  if (missingVariables.length > 0) {
    FormulaError.missingVarsInValues(missingVariables);
  }
};
