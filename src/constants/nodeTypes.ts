import { TEXT, NUMBER, DATE } from './fieldTypes';

export const BIN_OPERATION_NODE_TYPE = 'BinOperationNode';
export const FUNCTION_NODE_TYPE = 'FunctionNode';
export const LITERAL_NODE_TYPE = TEXT;
export const NUMBER_NODE_TYPE = NUMBER;
export const DATE_NODE_TYPE = DATE;
export const PARENTHESIZED_NODE_TYPE = 'ParenthesizedNode';
export const STATEMENTS_NODE_TYPE = 'StatementsNode';
export const UNAR_OPERATION_NODE_TYPE = 'UnarOperationNode';
export const VARIABLE_NODE_TYPE = 'VariableNode';
export const KEYWORD_NODE_TYPE = 'KeywordNode';

export const UNKNOWN_NODE_TYPE = 'unknown';

export const NODE_TYPES = {
  BIN_OPERATION: BIN_OPERATION_NODE_TYPE,
  KEYWORD: KEYWORD_NODE_TYPE,
  FUNCTION: FUNCTION_NODE_TYPE,
  LITERAL: LITERAL_NODE_TYPE,
  NUMBER: NUMBER_NODE_TYPE,
  DATE: DATE_NODE_TYPE,
  PARENTHESIZED: PARENTHESIZED_NODE_TYPE,
  STATEMENTS: STATEMENTS_NODE_TYPE,
  UNAR_OPERATION: UNAR_OPERATION_NODE_TYPE,
  VARIABLE: VARIABLE_NODE_TYPE,
} as const;

export type NodeTypesValues = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];
