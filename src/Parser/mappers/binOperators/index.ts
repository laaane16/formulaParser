import {
  BOOLEAN_NODE_TYPE,
  LITERAL_NODE_TYPE,
  NUMBER_NODE_TYPE,
} from '../../../constants/nodeTypes';
import { ValidBinOperatorsNames, Operator } from './types';

// TODO: write tests
// null in returnType means all types are valid
// array in operand type means all types in array are valid in any combination
export const allBinOperators: Record<ValidBinOperatorsNames, Operator[]> = {
  PLUS: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} + ${right}`,
      sqlFn: (left, right) => `${left} + ${right}`,
    },
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: LITERAL_NODE_TYPE,
      jsFn: (left, right) => `${left} + ${right}`,
      sqlFn: (left, right) => `CONCAT(${left}, ${right})`,
    },
    {
      operandType: [LITERAL_NODE_TYPE, NUMBER_NODE_TYPE],
      returnType: LITERAL_NODE_TYPE,
      jsFn: (left, right) => `String(${left}) + String(${right})`,
      sqlFn: (left, right) => `CONCAT(${left}::text, ${right}::text)`,
    },
  ],
  CONCATENATION: [
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: LITERAL_NODE_TYPE,
      jsFn: (left, right) => `${left} + ${right}`,
      sqlFn: (left, right) => `CONCAT(${left}, ${right})`,
    },
  ],
  MINUS: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} - ${right}`,
      sqlFn: (left, right) => `${left} - ${right}`,
    },
  ],
  MULTIPLY: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} * ${right}`,
      sqlFn: (left, right) => `${left} * ${right}`,
    },
  ],
  DIVISION: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} / ${right}`,
      sqlFn: (left, right) => `${left} / ${right}`,
      jsSafeFn: (left, right) =>
        ` (function(){if (${right} === 0) throw ''; ${left} / ${right}})()`,
      sqlSafeFn: (left, right) =>
        `CASE WHEN ${right} != 0 THEN (${left} / ${right}) ELSE 0 END`,
      filterError: (_, right) => `${right} != 0`,
    },
  ],
  REMAINDER: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} % ${right}`,
      sqlFn: (left, right) => `${left} % ${right}`,
      jsSafeFn: (left, right) =>
        `(function(){if (${right} === 0) throw ''; ${left} % ${right}})()`,
      sqlSafeFn: (left, right) =>
        `CASE WHEN ${right} != 0 THEN (${left} % ${right}) ELSE 0 END`,
      filterError: (_, right) => `${right} != 0`,
    },
  ],
  POWER: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} ^ ${right}`,
      sqlFn: (left, right) => `${left} ^ ${right}`,
    },
  ],
  EQUAL: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} == ${right}`,
      sqlFn: (left, right) => `${left} = ${right}`,
    },
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} == ${right}`,
      sqlFn: (left, right) => `${left} = ${right}`,
    },
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `String(${left}) == String(${right})`,
      sqlFn: (left, right) => `${left}::text = ${right}::text`,
    },
  ],
  NOT_EQUAL: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} != ${right}`,
      sqlFn: (left, right) => `${left} != ${right}`,
    },
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} != ${right}`,
      sqlFn: (left, right) => `${left} != ${right}`,
    },
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `String(${left}) != String(${right})`,
      sqlFn: (left, right) => `${left}::text != ${right}::text`,
    },
  ],
  GREATER: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} > ${right}`,
      sqlFn: (left, right) => `${left} > ${right}`,
    },
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} > ${right}`,
      sqlFn: (left, right) => `${left} > ${right}`,
    },
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `String(${left}) > String(${right})`,
      sqlFn: (left, right) => `${left}::text > ${right}::text`,
    },
  ],
  GREATER_OR_EQUAL: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} >= ${right}`,
      sqlFn: (left, right) => `${left} >= ${right}`,
    },
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} >= ${right}`,
      sqlFn: (left, right) => `${left} >= ${right}`,
    },
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `String(${left}) >= String(${right})`,
      sqlFn: (left, right) => `${left}::text >= ${right}::text`,
    },
  ],
  LESS: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} < ${right}`,
      sqlFn: (left, right) => `${left} < ${right}`,
    },
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} < ${right}`,
      sqlFn: (left, right) => `${left} < ${right}`,
    },
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `String(${left}) < String(${right})`,
      sqlFn: (left, right) => `${left}::text < ${right}::text`,
    },
  ],
  LESS_OR_EQUAL: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} <= ${right}`,
      sqlFn: (left, right) => `${left} <= ${right}`,
    },
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} <= ${right}`,
      sqlFn: (left, right) => `${left} <= ${right}`,
    },
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `String(${left}) <= String(${right})`,
      sqlFn: (left, right) => `${left}::text <= ${right}::text`,
    },
  ],
  AND: [
    {
      operandType: BOOLEAN_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} && ${right}`,
      sqlFn: (left, right) => `${left} AND ${right}`,
    },
  ],
  OR: [
    {
      operandType: BOOLEAN_NODE_TYPE,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} || ${right}`,
      sqlFn: (left, right) => `${left} OR ${right}`,
    },
  ],
};
