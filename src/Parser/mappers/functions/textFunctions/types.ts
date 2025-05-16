export type ValidTextFunctionsNamesWithSafe =
  | 'CONCAT'
  | 'TRIM'
  | 'SAFE_TRIM'
  | 'SEARCH'
  | 'REPLACE'
  | 'LOWER'
  | 'UPPER'
  | 'REPEAT'
  | 'SUBSTRING'
  | 'LEFT'
  | 'RIGHT'
  | 'LEN'
  | 'JOIN'
  | 'TO_STRING';

export type ValidTextFunctionsNames = Exclude<
  ValidTextFunctionsNamesWithSafe,
  'SAFE_TRIM'
>;
