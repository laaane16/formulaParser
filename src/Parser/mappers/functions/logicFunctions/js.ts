import { IFormatterFunc } from '../types';
import { ValidLogicFunctionsNamesWithSafe } from './types';

export const logicFunctionsToJsMap: Record<
  ValidLogicFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  ISEMPTY: ([arg]) => `((${arg}) === null || (${arg}) === '')`,
  // IFEMPTY: ([consequent, alternate]) => ``,
};
