import { IFormatterFunc } from '../types';
import { ValidBpiumFunctionsNamesWithSafe } from './types';

export const bpiumFunctionstoSqlMap: Record<
  ValidBpiumFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  RECORDID: () => '"dbId"',
  CATALOGID: (_, bpium) => `'${bpium?.catalogId ?? null}'`,
};
