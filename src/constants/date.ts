export const UNIT = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
];

type DateFormatsKeys =
  | 'msecond'
  | 'second'
  | 'minute'
  | 'hour12'
  | 'hour24'
  | 'year'
  | 'iweekyear'
  | 'month'
  | 'mon'
  | 'mm'
  | 'day'
  | 'dy'
  | 'ddd'
  | 'dd'
  | 'id'
  | 'week'
  | 'iweek';

type DateFormats = Record<DateFormatsKeys, string>;

// equal in psql
export const DATE_FORMATS_FORMULA: DateFormats = {
  msecond: 'MS',
  second: 'SS',
  minute: 'MI',
  hour12: 'HH',
  hour24: 'HH24',
  year: 'YYYY',
  iweekyear: 'kkkk',
  month: 'Month',
  mon: 'Mon',
  mm: 'MM',
  day: 'Day',
  dy: 'Dy',
  ddd: 'DDD',
  dd: 'DD',
  id: 'ID',
  week: 'WW',
  iweek: 'IW',
};

export const DATE_FORMATS_LUXON: DateFormats = {
  msecond: 'SSS',
  second: 'uu',
  minute: 'mm',
  hour12: 'hh',
  hour24: 'HH',
  year: 'yyyy',
  iweekyear: 'IYYY',
  month: 'LLLL',
  mon: 'LLL',
  mm: 'LL',
  day: 'cccc',
  dy: 'ccc',
  ddd: 'ooo',
  dd: 'dd',
  id: 'c',
  week: 'W',
  iweek: 'WW',
};
