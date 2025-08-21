export const UNIT = {
  s: 'second',
  min: 'minute',
  h: 'hour',
  d: 'day',
  w: 'week',
  mon: 'month',
  y: 'year',
};

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
export const DATE_FORMAT = '"yyyy-LL-dd HH:mm:ssZZZ"';

const withSingleQuotes = (str: string) => "'" + str + "'";

// from luxon to postgres format
export const LUXON_EQUALITY_PSQL = {
  S: withSingleQuotes('S'),
  SSS: withSingleQuotes('SSS'),
  u: withSingleQuotes('u'),
  uu: withSingleQuotes('uu'),
  uuu: withSingleQuotes('uuu'),
  s: withSingleQuotes('s'),
  ss: withSingleQuotes('ss'),
  m: withSingleQuotes('m'),
  mm: withSingleQuotes('mm'),
  h: withSingleQuotes('h'),
  hh: withSingleQuotes('hh'),
  H: withSingleQuotes('H'),
  Z: withSingleQuotes('Z'),
  ZZ: withSingleQuotes('ZZ'),
  ZZZ: withSingleQuotes('ZZZ'),
  ZZZZ: withSingleQuotes('ZZZZ'),
  ZZZZZ: withSingleQuotes('ZZZZZ'),
  z: withSingleQuotes('z'),
  a: withSingleQuotes('a'),
  d: withSingleQuotes('d'),
  dd: withSingleQuotes('dd'),
  c: withSingleQuotes('c'),
  E: withSingleQuotes('E'),
  ccc: withSingleQuotes('ccc'),
  EEE: withSingleQuotes('EEE'),
  cccc: withSingleQuotes('cccc'),
  EEEE: withSingleQuotes('EEEE'),
  ccccc: withSingleQuotes('ccccc'),
  EEEEE: withSingleQuotes('EEEEE'),
  L: withSingleQuotes('L'),
  M: withSingleQuotes('M'),
  LL: withSingleQuotes('LL'),
  // MM: withSingleQuotes('MM'),
  LLL: withSingleQuotes('LLL'),
  MMM: withSingleQuotes('MMM'),
  LLLL: withSingleQuotes('LLLL'),
  MMMM: withSingleQuotes('MMMM'),
  LLLLL: withSingleQuotes('LLLLL'),
  MMMMM: withSingleQuotes('MMMMM'),
  y: withSingleQuotes('y'),
  yy: withSingleQuotes('yy'),
  yyyy: withSingleQuotes('yyyy'),
  G: withSingleQuotes('G'),
  GG: withSingleQuotes('GG'),
  GGGGG: withSingleQuotes('GGGGG'),
  kk: withSingleQuotes('kk'),
  kkkkk: withSingleQuotes('kkkkk'),
  // W: withSingleQuotes('W'),
  // WW: withSingleQuotes('WW'),
  ii: withSingleQuotes('ii'),
  iiii: withSingleQuotes('iiii'),
  n: withSingleQuotes('n'),
  nn: withSingleQuotes('nn'),
  o: withSingleQuotes('o'),
  ooo: withSingleQuotes('ooo'),
  q: withSingleQuotes('q'),
  qq: withSingleQuotes('qq'),
  // D: withSingleQuotes('D'),
  // DD: withSingleQuotes('DD'),
  // DDD: withSingleQuotes('DDD'),
  DDDD: withSingleQuotes('DDDD'),
  t: withSingleQuotes('t'),
  tt: withSingleQuotes('tt'),
  ttt: withSingleQuotes('ttt'),
  tttt: withSingleQuotes('tttt'),
  T: withSingleQuotes('T'),
  TT: withSingleQuotes('TT'),
  TTT: withSingleQuotes('TTT'),
  TTTT: withSingleQuotes('TTTT'),
  f: withSingleQuotes('f'),
  ff: withSingleQuotes('ff'),
  fff: withSingleQuotes('fff'),
  ffff: withSingleQuotes('ffff'),
  F: withSingleQuotes('F'),
  FF: withSingleQuotes('FF'),
  FFF: withSingleQuotes('FFF'),
  FFFF: withSingleQuotes('FFFF'),
  X: withSingleQuotes('X'),
  x: withSingleQuotes('x'),

  // Hours
  HH: 'hh',
  HH12: 'hh',
  HH24: 'HH',

  // Minutes / Seconds
  MI: 'mm',
  SS: 'ss',
  MS: 'SSS',

  // Meridiem
  AM: 'a',
  PM: 'a',
  am: 'a',
  pm: 'a',
  'A.M.': 'a',
  'P.M.': 'a',
  'a.m.': 'a',
  'p.m.': 'a',

  // Years
  YYYY: 'yyyy',
  YY: 'yy',
  IYYY: 'kkkk',
  IY: 'kk',

  // Era
  BC: 'G',
  AD: 'G',
  bc: 'G',
  ad: 'G',
  'B.C.': 'G',
  'A.D.': 'G',
  'b.c.': 'G',
  'a.d.': 'G',

  // Months
  Month: 'LLLL',
  Mon: 'LLL',
  MM: 'LL',
  Q: 'q',

  // Days
  Day: 'cccc',
  Dy: 'ccc',
  DDD: 'ooo',
  DD: 'dd',
  D: 'c',
  W: 'W',

  // Time zones
  TZ: 'ZZZ',
  tz: 'zzz',
  TZH: 'HH',
  TZM: 'mm',
  OF: 'ZZ',
};

export const PSQL_EQUALITY_LUXON = [
  'US',
  'FF1',
  'FF2',
  'FF3',
  'FF4',
  'FF5',
  'FF6',
  'SSSS',
  'SSSSS',
  'Y,YYY',
  'YYY',
  'IYY',
  'Y',
  'I',
  'MONTH',
  'month',
  'MON',
  'mon',
  'DAY',
  'day',
  'DY',
  'dy',
  'IDDD',
  'ID',
  'WW',
  'IW',
  'CC',
  'J',
  'RM',
  'rm',
];
