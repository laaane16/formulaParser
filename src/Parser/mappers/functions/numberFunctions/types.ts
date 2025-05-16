export type ValidNumberFunctionsNamesWithSafe =
  | 'ABS'
  | 'CEIL'
  | 'FLOOR'
  | 'EXP'
  | 'MOD'
  | 'SAFE_MOD'
  | 'POWER'
  | 'ROUND'
  | 'SQRT'
  | 'SAFE_SQRT'
  | 'RANDOM'
  | 'SUM'
  | 'AVERAGE'
  | 'MIN'
  | 'MAX'
  | 'TO_NUMBER'
  | 'SAFE_TO_NUMBER';

export type ValidNumberFunctionsNames = Exclude<
  ValidNumberFunctionsNamesWithSafe,
  'SAFE_SQRT' | 'SAFE_TO_NUMBER' | 'SAFE_MOD'
>;
