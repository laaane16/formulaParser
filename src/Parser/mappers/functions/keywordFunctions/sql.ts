import { ValidKeywordFunctionsNames } from './types';

export const keywordFunctionsToSqlMap: Record<
  ValidKeywordFunctionsNames,
  (args: string[]) => string
> = {
  ISNULL: ([arg]) => `${arg} IS NULL`,
};
