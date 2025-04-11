import { ValidNumberFunctionsNames } from '../types';

export const numberFunctionsToSqlMap: Record<
  ValidNumberFunctionsNames,
  (args: string[]) => string
> = {
  // ABS: (args) => '',
  // CEIL: (args) => '',
  // FLOOR: (args) => '',
  // EXP: (args) => '',
  // MOD: (args) => '',
  // POWER: (args) => '',
  // ROUND: (args) => '',
  // SQRT: (args) => '',
  RANDOM: (args) => `RANDOM()`,
};
