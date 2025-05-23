import { FormulaError } from './exceptions';

export const validateResultJs = (result: unknown) => {
  if (typeof result === 'number' && (isNaN(result) || !isFinite(result))) {
    FormulaError.invalidJsResult(result);
  }

  if (result === undefined) {
    FormulaError.invalidJsResult(String(result));
  }
};
