import { DateTime } from 'luxon';
import {
  CHECKBOXES,
  DROPDOWN,
  NUMBER,
  PROGRESS,
  STARS,
  SWITCH,
} from './fieldTypes';
import {
  NUMBER_NODE_TYPE,
  LITERAL_NODE_TYPE,
  BOOLEAN_NODE_TYPE,
  DATE_NODE_TYPE,
  ARRAY_WITH_ITEMS_NODE,
  LITERAL_ARRAY_NODE_TYPE,
} from './nodeTypes';

export const typesMapper = {
  [PROGRESS]: NUMBER,
  [STARS]: NUMBER,
  [SWITCH]: BOOLEAN_NODE_TYPE,
  [DROPDOWN]: ARRAY_WITH_ITEMS_NODE,
  [CHECKBOXES]: ARRAY_WITH_ITEMS_NODE,
};

export const castMapper = {
  [DROPDOWN]: LITERAL_ARRAY_NODE_TYPE,
  [CHECKBOXES]: LITERAL_ARRAY_NODE_TYPE,
};

export const ifTypesMapper: Record<string, string> = {
  [NUMBER_NODE_TYPE + LITERAL_NODE_TYPE]: LITERAL_NODE_TYPE,
  [LITERAL_NODE_TYPE + NUMBER_NODE_TYPE]: LITERAL_NODE_TYPE,

  [BOOLEAN_NODE_TYPE + LITERAL_NODE_TYPE]: LITERAL_NODE_TYPE,
  [LITERAL_NODE_TYPE + BOOLEAN_NODE_TYPE]: LITERAL_NODE_TYPE,

  [LITERAL_NODE_TYPE + DATE_NODE_TYPE]: LITERAL_NODE_TYPE,
  [DATE_NODE_TYPE + LITERAL_NODE_TYPE]: LITERAL_NODE_TYPE,

  [NUMBER_NODE_TYPE + BOOLEAN_NODE_TYPE]: NUMBER_NODE_TYPE,
  [BOOLEAN_NODE_TYPE + NUMBER_NODE_TYPE]: NUMBER_NODE_TYPE,

  [NUMBER_NODE_TYPE + DATE_NODE_TYPE]: LITERAL_NODE_TYPE,
  [DATE_NODE_TYPE + NUMBER_NODE_TYPE]: LITERAL_NODE_TYPE,

  [BOOLEAN_NODE_TYPE + DATE_NODE_TYPE]: LITERAL_NODE_TYPE,
  [DATE_NODE_TYPE + BOOLEAN_NODE_TYPE]: LITERAL_NODE_TYPE,

  [LITERAL_NODE_TYPE + LITERAL_NODE_TYPE]: LITERAL_NODE_TYPE,
  [NUMBER_NODE_TYPE + NUMBER_NODE_TYPE]: NUMBER_NODE_TYPE,
  [DATE_NODE_TYPE + DATE_NODE_TYPE]: DATE_NODE_TYPE,
  [BOOLEAN_NODE_TYPE + BOOLEAN_NODE_TYPE]: BOOLEAN_NODE_TYPE,
};

export const typesMapperJs: Record<string, string> = {
  [LITERAL_NODE_TYPE]: 'String',
  [NUMBER_NODE_TYPE]: 'Number',
  // date returns only in one case which all args are date
  [DATE_NODE_TYPE]: '',
  [BOOLEAN_NODE_TYPE]: 'Boolean',
};

export const typesMapperSql: Record<string, string> = {
  [LITERAL_NODE_TYPE]: 'TEXT',
  [NUMBER_NODE_TYPE]: 'NUMERIC',
  [DATE_NODE_TYPE]: 'TIMESTAMPTZ',
  [BOOLEAN_NODE_TYPE]: 'BOOLEAN',
};

type CastTypeHandler = (res: unknown, validate?: unknown) => unknown;

export const JS_CAST_TYPES: Record<string, CastTypeHandler> = {
  [NUMBER_NODE_TYPE]: (res: unknown) =>
    res === null
      ? null
      : String(res) === 'true'
        ? 1
        : String(res) === 'false'
          ? 0
          : Number(res),
  [LITERAL_NODE_TYPE]: (res: unknown) =>
    res === null
      ? ''
      : Array.isArray(res)
        ? typeof res[0] === 'boolean'
          ? `{${res.map((i) => String(i)[0])}}`
          : typeof res[0] === 'object' && res[0] !== null
            ? `{${res.map((i) => i.id)}}`
            : `{${res}}`
        : String(res),
  [DATE_NODE_TYPE]: (res: unknown): DateTime =>
    DateTime.fromFormat(String(res), 'yyyy-LL-dd HH:mm:ssZZZ'),
  // null -> null
  // 0 | false | '0' | 'false' | 'FAlsE' -> false
  // '' -> false
  // {OTHER VALUE} ->  true
  [BOOLEAN_NODE_TYPE]: (res: unknown) =>
    res === null
      ? null
      : /^(0|false)$/i.test(String(res))
        ? false
        : String(res) !== ''
          ? true
          : false,
  [LITERAL_ARRAY_NODE_TYPE]: (res, filter) => {
    if (Array.isArray(filter)) {
      const [ids, names] = filter;
      if (Array.isArray(ids) && Array.isArray(names)) {
        if (Array.isArray(res)) {
          let preparedRes = res.map((i) => String(i));
          if (typeof res[0] === 'object' && res[0] !== null) {
            preparedRes = res.map((i) => i.id);
          }

          let includesCount = 0;

          const firstResItem = String(preparedRes[0]);
          const attr: 'id' | 'name' | null = ids.includes(firstResItem)
            ? 'id'
            : names.includes(firstResItem)
              ? 'name'
              : null;
          if (attr === null) {
            return [];
          }
          includesCount++;
          const possibleFormat = attr === 'id' ? ids : names;

          for (let i = 1; i < preparedRes.length; i++) {
            const item = String(preparedRes[i]);

            if (possibleFormat.includes(item)) {
              includesCount++;
              continue;
            }
            return [];
          }

          if (includesCount === preparedRes.length) {
            if (attr === 'id') {
              return Array.from(new Set(preparedRes));
            }

            return Array.from(
              new Set(
                preparedRes.map((i) => ids[names.findIndex((j) => j === i)]),
              ),
            );
          }
        }
      }

      return [];
    }

    throw new Error('filter should be array');
  },
};

export const SQL_CAST_TYPES: Record<string, CastTypeHandler> = {
  [NUMBER_NODE_TYPE]: (res) =>
    `(CASE WHEN (${res})::text ~ '^[-]*\\d+(\\.\\d+)?$' THEN (${res})::text::numeric WHEN (${res})::text ~ 'true' THEN 1 WHEN (${res})::text ~ 'false' THEN 0 ELSE NULL END)`,
  [LITERAL_NODE_TYPE]: (res) =>
    `(CASE WHEN (${res}) IS NULL THEN NULL ELSE (${res})::text END)`,
  [DATE_NODE_TYPE]: (res) =>
    `(CASE WHEN (${res})::text ~ '^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?(Z|[+-]\\d{2}(:\\d{2}:\\d{2})?)$' THEN (${res})::text::timestamptz ELSE NULL END)`,
  // null -> null
  // 0 | false | '0' | 'false' | 'FAlsE' -> false
  // '' -> false
  // {OTHER VALUE} ->  true
  [BOOLEAN_NODE_TYPE]: (res) =>
    `(CASE WHEN (${res}) IS NULL THEN NULL WHEN (${res})::text ~* '^(false|0|)$' THEN FALSE ELSE TRUE END)`,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  [LITERAL_ARRAY_NODE_TYPE]: (res, [ids, names, fieldTitle]) =>
    `(CASE WHEN ((${res})::TEXT ~ '^\\{.*\\}$' AND PG_TYPEOF((${res})::TEXT::TEXT[])::TEXT = 'text[]')
      THEN (CASE WHEN ((${res})::TEXT::TEXT[] <@ ARRAY[${ids.map((i: unknown) => `'${i}'`)}]) THEN (${res})::TEXT::TEXT[]
        WHEN ((${res})::TEXT::TEXT[] <@ ARRAY[${names.map((i: unknown) => `'${i}'`)}]) THEN (SELECT array_agg(id) FROM (SELECT id FROM ${fieldTitle} WHERE name = ANY((${res})::TEXT::TEXT[])))
        ELSE ARRAY[]::TEXT[] END)
      ELSE ARRAY[]::TEXT[] END)`,
};
