// CREATED_TIME()
// LAST_MODIFIED
//   | 'SET_LOCALE'
//   | 'SET_TIMEZONE'
//   | 'TIMESTR'
//   | 'TO_NOW'
//   | 'FROM_NOW'
//   | 'DATESTR'
//   | 'WORKDAY'
//   | 'WORKDAY_DIFF'

export type ValidDateFunctionsNamesWithSafe =
  | 'DATE'
  | 'SAFE_DATE'
  | 'DATEADD'
  | 'SAFE_DATEADD'
  | 'SAFE_DATETIME_DIFF'
  | 'DATETIME_DIFF'
  // | 'DATETIME_FORMAT'
  // | 'DATETIME_PARSE'
  | 'DAY'
  | 'HOUR'
  | 'IS_AFTER'
  | 'IS_BEFORE'
  | 'IS_SAME'
  | 'MINUTE'
  | 'MONTH'
  | 'NOW'
  | 'SECOND'
  | 'TODAY'
  | 'WEEKDAY'
  | 'WEEKNUM'
  | 'YEAR';

export type ValidDateFunctionsNames = Exclude<
  ValidDateFunctionsNamesWithSafe,
  'SAFE_DATEADD' | 'SAFE_DATETIME_DIFF' | 'SAFE_DATE'
>;
