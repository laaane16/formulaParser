import { IFormatterFunc } from '../types';
import { ValidBpiumFunctionsNamesWithSafe } from './types';

export const bpiumFunctionstoSqlMap: Record<
  ValidBpiumFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  RECORDID: () => '"dbId"::TEXT',
  CATALOGID: (_, bpium) => `'${bpium?.catalogId ?? '#'}'`,
};
