import { IFormatterFunc } from '../types';
import { ValidLogicFunctionsNamesWithSafe } from './types';

export const logicFunctionsToSqlMap: Record<
  ValidLogicFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  ISEMPTY: ([arg]) =>
    `((${arg}) IS NULL OR (${arg})::TEXT = '' OR (${arg})::TEXT = '{}')`,
};
