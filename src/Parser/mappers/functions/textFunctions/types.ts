export type ValidTextFunctionsNamesWithSafe =
  | 'CONCAT'
  | 'TRIM'
  | 'SAFETRIM'
  | 'SEARCH'
  | 'REPLACE'
  | 'LOWER'
  | 'UPPER'
  | 'REPEAT'
  | 'SUBSTRING'
  | 'LEFT'
  | 'RIGHT'
  | 'LEN'
  // | 'JOIN'
  | 'TOSTRING'
  | 'REGEXMATCH'
  | 'REGEXREPLACE'
  | 'DATETOSTRING';

export type ValidTextFunctionsNames = Exclude<
  ValidTextFunctionsNamesWithSafe,
  'SAFETRIM' | 'DATETOSTRING'
>;
