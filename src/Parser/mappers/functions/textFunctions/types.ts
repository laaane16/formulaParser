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
  | 'JOIN'
  | 'JOINFORITEMS'
  | 'TOSTRING'
  | 'REGEXMATCH'
  | 'REGEXREPLACE'
  | 'DATETOSTRING'
  | 'BOOLEANARRAYTOSTRING'
  | 'ARRAYWITHITEMSNODETOSTRING';

export type ValidTextFunctionsNames = Exclude<
  ValidTextFunctionsNamesWithSafe,
  | 'SAFETRIM'
  | 'DATETOSTRING'
  | 'JOINFORITEMS'
  | 'BOOLEANARRAYTOSTRING'
  | 'ARRAYWITHITEMSNODETOSTRING'
>;
