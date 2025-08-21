import { IFormatterFunc } from '../types';
import { ValidBpiumFunctionsNamesWithSafe } from './types';

export const bpiumFunctionsToJsMap: Record<
  ValidBpiumFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  RECORDID: (_, bpium) => `${bpium?.recordDbId ?? null}`,
  CATALOGID: (_, bpium) => `'${bpium?.catalogId ?? null}'`,
};
