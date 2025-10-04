import { IFormatterFunc } from '../types';
import { ValidBpiumFunctionsNamesWithSafe } from './types';

export const bpiumFunctionsToJsMap: Record<
  ValidBpiumFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  RECORDID: (_, bpium) => `${bpium?.recordDbId ?? '#'}`,
  CATALOGID: (_, bpium) => `'${bpium?.catalogId ?? '#'}'`,
};
