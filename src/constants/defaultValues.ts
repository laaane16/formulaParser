import { FORMATS } from './formats';
import {
  NUMBER_NODE_TYPE,
  LITERAL_NODE_TYPE,
  DATE_NODE_TYPE,
} from './nodeTypes';
import { ObjectValues } from '../types';

const baseDefaultValues: Record<string, unknown> = {
  [NUMBER_NODE_TYPE]: 0,
  [LITERAL_NODE_TYPE]: "''",
};

type DefaultKeys = ObjectValues<typeof FORMATS>;
type DefaultValues = Record<string, unknown>;

export const defaultValues: Record<DefaultKeys, DefaultValues> = {
  [FORMATS.JS]: {
    ...baseDefaultValues,
    [DATE_NODE_TYPE]: 'null',
  },
  [FORMATS.SQL]: {
    ...baseDefaultValues,
    [DATE_NODE_TYPE]: 'NULL',
  },
};
