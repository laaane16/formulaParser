import { ValidKeywordFunctionsNames } from './types';

export const keywordFunctionsToJsMap: Record<
  ValidKeywordFunctionsNames,
  (args: string[]) => string
> = {
  ISNULL: ([arg]) =>
    `(function(){if (${arg} === null) {return true}else {return false}})()`,
};
