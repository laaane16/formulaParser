import { ValidArrayFunctionsNamesWithExtra } from './types';
import { IFormatterFunc } from '../types';

/**
 * In functions with the FORITEMS prefix, we always know that instead of arr,
 * a column with statuses or checkboxes is passed — the user won't be able to reproduce such a type manually.
 * Also, any function (including IF) that works with such fields returns either an array of IDs or an array of titles,
 * which does not correspond to the ArrayWithItems type.
 * Therefore, we are free from the limitations of dynamically obtained arguments (code snippets in the arguments).
 */

export const prepareColumn = (column: string) =>
  column.slice(0, column.length - 1);
export const getArrayWithNames = (column: string) => {
  const preparedColumn = prepareColumn(column);

  return `(SELECT ARRAY_AGG(${preparedColumn}_names".name) FROM UNNEST(${column}) ${preparedColumn}_name" JOIN ${preparedColumn}_names" on ${preparedColumn}_names".id = ${preparedColumn}_name")`;
};

export const arrayFunctionsToSqlMap: Record<
  ValidArrayFunctionsNamesWithExtra,
  IFormatterFunc
> = {
  INDEX: ([arr, idx]) =>
    `(CASE WHEN (${idx}) >= 0 THEN (${arr})[(${idx}) + 1] ELSE NULL END)`,
  INDEXFORITEMS: ([arr, idx, attr]) =>
    attr
      ? `(CASE (${attr}) WHEN 'id' THEN (CASE WHEN (${idx}) >= 0 THEN (${arr})[(${idx}) + 1] ELSE NULL END) WHEN 'name' THEN (CASE WHEN (${idx}) >= 0 THEN (${getArrayWithNames(arr)})[(${idx}) + 1] ELSE NULL END) ELSE NULL END)`
      : `(CASE WHEN (${idx}) >= 0 THEN (${getArrayWithNames(arr)})[(${idx}) + 1] ELSE NULL END)`,

  ID: ([arr]) => `${arr}`,

  NAME: ([arr]) => `${getArrayWithNames(arr)}`,

  COUNT: ([arr]) => `ARRAY_LENGTH(${arr}, 1)`,

  UNIQUE: ([arr]) => `ARRAY(SELECT DISTINCT UNNEST(${arr}))`,
  UNIQUEFORITEMS: ([arr, attr]) =>
    attr
      ? `(CASE (${attr}) WHEN 'id' THEN ARRAY(SELECT DISTINCT UNNEST(${arr})) WHEN 'name' THEN ARRAY(SELECT DISTINCT UNNEST(${getArrayWithNames(arr)})) ELSE NULL END)`
      : `ARRAY(SELECT DISTINCT UNNEST(${getArrayWithNames(arr)}))`,

  SLICE: ([arr, from, to]) =>
    to
      ? `(CASE WHEN ((${from}) >= 0 AND (${to}) >= 0) THEN (${arr})[((${from}) + 1):(${to})] ELSE NULL END)`
      : `(CASE WHEN ((${from}) >= 0) THEN (${arr})[((${from}) + 1):ARRAY_LENGTH(${arr}, 1)] ELSE NULL END)`,
  SLICEFORITEMS: ([arr, from, to, attr]) => {
    console.log(arr, from, to, attr);
    return to
      ? attr
        ? `(CASE (${attr}) WHEN 'id' THEN (CASE WHEN ((${from}) >= 0 AND (${to}) >= 0) THEN (${arr})[((${from}) + 1):(${to})] ELSE NULL END) WHEN 'name' THEN (CASE WHEN ((${from}) >= 0 AND (${to}) >= 0) THEN (${getArrayWithNames(arr)})[((${from}) + 1):(${to})] ELSE NULL END) ELSE NULL END)`
        : `(CASE WHEN ((${from}) >= 0 AND (${to}) >= 0) THEN (${getArrayWithNames(arr)})[((${from}) + 1):(${to})] ELSE NULL END)`
      : attr
        ? `(CASE (${attr}) WHEN 'id' THEN (CASE WHEN ((${from}) >= 0) THEN (${arr})[((${from}) + 1):ARRAY_LENGTH(${arr}, 1)] ELSE NULL END) WHEN 'name' THEN (CASE WHEN ((${from}) >= 0) THEN (${getArrayWithNames(arr)})[((${from}) + 1):ARRAY_LENGTH(${arr}, 1)] ELSE NULL END) ELSE NULL END)`
        : `(CASE WHEN ((${from}) >= 0) THEN (${getArrayWithNames(arr)})[((${from}) + 1):ARRAY_LENGTH(${arr}, 1)] ELSE NULL END)`;
  },

  FIND: ([arr, value]) => `(${arr})[ARRAY_POSITION(${arr}, ${value})]`,
  FINDFORITEMS: ([arr, value, attr]) =>
    attr
      ? `(CASE (${attr}) WHEN 'id' THEN (${arr})[ARRAY_POSITION(${arr}, ${value})] WHEN 'name' THEN (${getArrayWithNames(arr)})[ARRAY_POSITION(${getArrayWithNames(arr)}, ${value})] ELSE NULL END)`
      : `(${getArrayWithNames(arr)})[ARRAY_POSITION(${getArrayWithNames(arr)}, ${value})]`,

  FILTER: ([arr, value]) => `ARRAY_REMOVE(${arr}, ${value})`,
  FILTERFORITEMS: ([arr, value, attr]) =>
    attr
      ? `(CASE (${attr}) WHEN 'id' THEN ARRAY_REMOVE(${arr}, ${value}) WHEN 'name' THEN ARRAY_REMOVE(${getArrayWithNames(arr)}, ${value}) ELSE NULL END)`
      : `ARRAY_REMOVE(${getArrayWithNames(arr)}, ${value})`,

  SORT: ([arr, mode]) =>
    mode
      ? `(CASE (${mode}) WHEN -1 THEN ARRAY(SELECT UNNEST(${arr}) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(${arr}) ORDER BY 1) END)`
      : `ARRAY(SELECT UNNEST(${arr}) ORDER BY 1)`,

  SORTDATES: ([arr, mode]) =>
    mode
      ? `(CASE (${mode}) WHEN -1 THEN ARRAY(SELECT UNNEST(${arr}) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(${arr}) ORDER BY 1) END)`
      : `ARRAY(SELECT UNNEST(${arr}) ORDER BY 1)`,
  SORTNUMBERS: ([arr, mode]) =>
    mode
      ? `(CASE (${mode}) WHEN -1 THEN ARRAY(SELECT UNNEST(${arr}) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(${arr}) ORDER BY 1) END)`
      : `ARRAY(SELECT UNNEST(${arr}) ORDER BY 1)`,
  SORTFORITEMS: ([arr, mode, attr]) =>
    mode
      ? attr
        ? `(CASE (${attr}) WHEN 'id' THEN (CASE (${mode}) WHEN -1 THEN ARRAY(SELECT UNNEST(${arr}) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(${arr}) ORDER BY 1) END) WHEN 'name' THEN (CASE (${mode}) WHEN -1 THEN ARRAY(SELECT UNNEST(${getArrayWithNames(arr)}) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(${getArrayWithNames(arr)}) ORDER BY 1) END) ELSE NULL END)`
        : `(CASE (${mode}) WHEN -1 THEN ARRAY(SELECT UNNEST(${getArrayWithNames(arr)}) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(${getArrayWithNames(arr)}) ORDER BY 1) END)`
      : attr
        ? `(CASE (${attr}) WHEN 'id' THEN ARRAY(SELECT UNNEST(${arr}) ORDER BY 1) WHEN 'name' THEN ARRAY(SELECT UNNEST(${getArrayWithNames(arr)}) ORDER BY 1) ELSE NULL END)`
        : `ARRAY(SELECT UNNEST(${getArrayWithNames(arr)}) ORDER BY 1)`,

  //     FLATTEN: ([arr]) => `ARRAY(SELECT UNNEST(${arr}))`,
  //     FLATTENFORITEMS: ([arr, attr]) =>
  //     attr ?
  //       `(CASE (${attr}) WHEN 'id' THEN ARRAY(SELECT UNNEST(${arr})) WHEN 'name' ARRAY(SELECT UNNEST(${getArrayWithNames(arr)})) ELSE NULL END)`:
  //       `ARRAY(SELECT UNNEST(${getArrayWithNames(arr)}))`
};
