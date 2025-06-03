import { DateTime } from 'luxon';
import { NUMBER, PROGRESS, STARS, SWITCH } from './fieldTypes';
import {
  NUMBER_NODE_TYPE,
  LITERAL_NODE_TYPE,
  BOOLEAN_NODE_TYPE,
  DATE_NODE_TYPE,
} from './nodeTypes';

export const typesMapper = {
  [PROGRESS]: NUMBER,
  [STARS]: NUMBER,
  [SWITCH]: BOOLEAN_NODE_TYPE,
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

type CastTypeHandler = (res: unknown) => unknown;

export const JS_CAST_TYPES: Record<string, CastTypeHandler> = {
  [NUMBER_NODE_TYPE]: (res: unknown) => (res === null ? null : Number(res)),
  [LITERAL_NODE_TYPE]: (res: unknown) => (res === null ? null : String(res)),
  [DATE_NODE_TYPE]: (res: unknown): DateTime =>
    DateTime.fromFormat(String(res), 'yyyy-LL-dd HH:mm:ssZZZ'),
  [BOOLEAN_NODE_TYPE]: (res: unknown) => (res === null ? null : Boolean(res)),
};

export const SQL_CAST_TYPES: Record<string, CastTypeHandler> = {
  [NUMBER_NODE_TYPE]: (res) =>
    `(CASE WHEN (${res})::text ~ '^[-]*\\d+(\\.\\d+)?$' THEN (${res})::text::numeric ELSE NULL END)`,
  [LITERAL_NODE_TYPE]: (res) => `(${res})::text`,
  [DATE_NODE_TYPE]: (res) =>
    `(CASE WHEN (${res})::text ~ '^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?(Z|[+-]\\d{2})$' THEN (${res})::text::timestamptz ELSE NULL END)`,
  [BOOLEAN_NODE_TYPE]: (res) =>
    `(CASE WHEN (${res})::text ~* '^(true|false|0|1)$' THEN (${res})::BOOLEAN ELSE NULL END)`,
};
