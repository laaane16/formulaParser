import { NUMBER_NODE_TYPE, LITERAL_NODE_TYPE } from './nodeTypes';

export const defaultValues: Record<string, unknown> = {
  [NUMBER_NODE_TYPE]: 0,
  [LITERAL_NODE_TYPE]: "''",
};
