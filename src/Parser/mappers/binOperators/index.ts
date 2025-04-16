import { ValidBinOperatorsNames, IOperator } from './types';

export const allBinOperators: Record<ValidBinOperatorsNames, IOperator> = {
  PLUS: {
    needTypeCheck: true,
    jsFn: (left, right) => `${left} + ${right}`,
    sqlFn: (left, right) => `${left} + ${right}`,
  },
  MINUS: {
    needTypeCheck: true,
    jsFn: (left, right) => `${left} - ${right}`,
    sqlFn: (left, right) => `${left} - ${right}`,
  },
  MULTIPLY: {
    needTypeCheck: true,
    jsFn: (left, right) => `${left} * ${right}`,
    sqlFn: (left, right) => `${left} * ${right}`,
  },
  DIVISION: {
    needTypeCheck: true,
    jsFn: (left, right) => `${left} / ${right}`,
    sqlFn: (left, right) => `${left} / ${right}`,
  },
  REMAINDER: {
    needTypeCheck: true,
    jsFn: (left: string, right: string) => `${left} % ${right}`,
    sqlFn: (left: string, right: string) => `${left} % ${right}`,
  },
  POWER: {
    needTypeCheck: true,
    jsFn: (left: string, right: string) => `${left} ^ ${right}`,
    sqlFn: (left: string, right: string) => `${left} ^ ${right}`,
  },
  EQUAL: {
    needTypeCheck: false,
    jsFn: (left: string, right: string) => `${left} == ${right}`,
    sqlFn: (left: string, right: string) => `${left} = ${right}`,
  },
  NOT_EQUAL: {
    needTypeCheck: false,
    jsFn: (left: string, right: string) => `${left} != ${right}`,
    sqlFn: (left: string, right: string) => `${left} != ${right}`,
  },
  GREATER: {
    // maybe not need
    needTypeCheck: true,
    jsFn: (left: string, right: string) => `${left} > ${right}`,
    sqlFn: (left: string, right: string) => `${left} > ${right}`,
  },
  GREATER_OR_EQUAL: {
    // maybe not need
    needTypeCheck: true,
    jsFn: (left: string, right: string) => `${left} >= ${right}`,
    sqlFn: (left: string, right: string) => `${left} >= ${right}`,
  },
  LESS: {
    // maybe not need
    needTypeCheck: true,
    jsFn: (left: string, right: string) => `${left} < ${right}`,
    sqlFn: (left: string, right: string) => `${left} < ${right}`,
  },
  LESS_OR_EQUAL: {
    // maybe not need
    needTypeCheck: true,
    jsFn: (left: string, right: string) => `${left} <= ${right}`,
    sqlFn: (left: string, right: string) => `${left} <= ${right}`,
  },
};
