export type ValidArrayFunctionsNamesWithExtra =
  'INDEX' |
  'INDEXFORITEMS'|
  'ID' |
  'NAME' |
  'COUNT' |
  // 'FLATTEN' |
  // 'FLATTENFORITEMS' |
  'UNIQUE' |
  'UNIQUEFORITEMS' |
  'SLICE' |
  'SLICEFORITEMS'|
  'FIND' |
  'FINDFORITEMS' |
  'FILTER' |
  'FILTERFORITEMS' |
  'SORT' |
  'SORTNUMBERS' |
  'SORTDATES' |
  'SORTFORITEMS'


export type ValidArrayFunctionsNames = Exclude<ValidArrayFunctionsNamesWithExtra,
  'INDEXFORITEMS' |
  'UNIQUEFORITEMS'|
  'SLICEFORITEMS' |
  'FINDFORITEMS' |
  'FILTERFORITEMS'|
  'SORTFORITEMS' |
  'SORTDATES' |
  'SORTNUMBERS' |
  'FLATTENFORITEMS'>
