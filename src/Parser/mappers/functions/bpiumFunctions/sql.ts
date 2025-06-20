import { IFormatterFunc } from '../types';
import { ValidBpiumFunctionsNamesWithSafe } from './types';

export const bpiumFunctionstoSqlMap: Record<
  ValidBpiumFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  RECORD_ID: () => '"dbId"',
  CATALOG_ID: (_, bpium) => `'${bpium?.catalogId ?? null}'`,
};
