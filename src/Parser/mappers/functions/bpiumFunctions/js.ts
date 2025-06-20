import { IFormatterFunc } from '../types';
import { ValidBpiumFunctionsNamesWithSafe } from './types';

export const bpiumFunctionsToJsMap: Record<
  ValidBpiumFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  RECORD_ID: (_, bpium) => `${bpium?.recordDbId ?? null}`,
  CATALOG_ID: (_, bpium) => `'${bpium?.catalogId ?? null}'`,
};
