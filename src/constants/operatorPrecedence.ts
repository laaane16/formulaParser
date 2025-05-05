export const operatorPrecedence: Record<string, number> = {
  POWER: 5, // ^
  MULTIPLY: 4, // *
  DIVISION: 4, // /
  REMAINDER: 4, // %
  CONCATENATION: 3, // &
  PLUS: 2, // +
  MINUS: 2, // -
  GREATER: 2, // >
  GREATER_OR_EQUAL: 2, // >=
  LESS: 2, // <
  LESS_OR_EQUAL: 2, // <=
  EQUAL: 1, // ==
  NOT_EQUAL: 1, // !=
  AND: 0, // &&
  OR: 0, // ||
};
