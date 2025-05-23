/**
 * Custom error class for handling formula-related errors.
 */
export class FormulaError extends Error {
  translatingId: string;
  args: unknown[];
  // === LEXER ERRORS ===

  constructor(name: string, translatingId: string, args: unknown[]) {
    super(name);
    this.translatingId = translatingId;
    this.args = args;
  }

  /**
   * Throws an error related to lexical analysis at a specific position.
   * @param {number} position - The position in the expression where the error occurred.
   * @throws {Error}
   */
  static lexerError(position: number): never {
    throw new FormulaError(
      `[LEXER]: On the position ${position} an error has been detected`,
      'lexerError',
      [position],
    );
  }

  /**
   * Throws an error when an unknown token is encountered.
   * @param {number} position - The position of the unknown token.
   * @throws {FormulaError}
   */
  static unknownTokenError(position: number): never {
    throw new FormulaError(
      `Unknown token encountered at the position ${position}`,
      'unknownTokenError',
      [position],
    );
  }

  /**
   * Throws an error when a parenthesis is not closed.
   * @param {number} position - The position of the unclosed parenthesis.
   * @throws {FormulaError}
   */
  static unclosedParenthesis(position: number): never {
    throw new FormulaError(
      `Unclosed parenthesis detected at the position ${position}`,
      'unclosedParenthesis',
      [position],
    );
  }

  // === SYNTAX ERRORS ===

  /**
   * Throws a generic parsing error.
   * @param {string} message - The error message.
   * @throws {FormulaError}
   */
  static parseError(message: string): never {
    throw new FormulaError(`Parse Error: ${message}`, 'parseError', [message]);
  }

  /**
   * Throws an error when a syntax issue is detected in an expression.
   * @param {number} position - The position of the syntax error.
   * @throws {FormulaError}
   */
  static syntaxError(position: number): never {
    throw new FormulaError(
      `Invalid syntax at the position ${position}`,
      'syntaxError',
      [position],
    );
  }

  /**
   * Throws an error when a function argument list is expected but missing.
   * @param {number} position - The position where arguments are expected.
   * @throws {FormulaError}
   */
  static expectedFunctionArguments(position: number): never {
    throw new FormulaError(
      `Expected function argument list at the position ${position}`,
      'expectedFunctionArguments',
      [position],
    );
  }

  /**
   * Throws an error when a conditional operator is empty.
   * @param {number} position - The position of the empty conditional.
   * @throws {FormulaError}
   */
  static emptyConditionalOperator(position: number): never {
    throw new FormulaError(
      `An empty conditional operator at the position ${position}`,
      'emptyConditionalOperator',
      [position],
    );
  }

  /**
   * Throws an error when a required construct is missing.
   * @param {number} position - The position where the construct is expected.
   * @param {string} name - The name of the expected construct.
   * @throws {FormulaError}
   */
  static missingRequiredConstruction(position: number, name: string): never {
    throw new FormulaError(
      `On the position ${position} expected ${name}`,
      'missingRequiredConstruction',
      [position],
    );
  }

  // === SEMANTIC ERRORS ===

  /**
   * Throws an error when required parameters are missing.
   * @param {string[]} missedParams - The list of missing parameters.
   * @throws {FormulaError}
   */
  static requiredParamsError(missedParams: string[]): never {
    throw new FormulaError(
      `Missing required parameters: ${missedParams.join(', ')}`,
      'requiredParamsError',
      [missedParams],
    );
  }

  /**
   * Throws an error when the number of arguments is not as expected.
   * @param {number} position - The position where the unexpected count was found.
   * @throws {FormulaError}
   */
  static unexpectedArgunmentCount(position: number): never {
    throw new FormulaError(
      `An unexpected number of arguments at the position ${position}`,
      'unexpectedArgunmentCount',
      [position],
    );
  }

  /**
   * Throws an error when an invalid function is used.
   * @param {number} position - The position in the formula.
   * @param {string} funcName - The name of the invalid function.
   * @throws {FormulaError}
   */
  static invalidFunction(position: number, funcName: string): never {
    throw new FormulaError(
      `Invalid function ${funcName} at the position ${position}`,
      'invalidFunction',
      [position, funcName],
    );
  }

  /**
   * Throws an error when a field is not found.
   * @param {number} position - The position in the formula.
   * @param {string} fieldName - The name of the missing field.
   * @throws {FormulaError}
   */
  static fieldNotFoundError(position: number, fieldName: string): never {
    throw new FormulaError(
      `Field ${fieldName} not found at the position ${position}`,
      'fieldNotFoundError',
      [position, fieldName],
    );
  }

  /**
   * Throws an error when an operation is performed on unexpected data types.
   * @param {number} position - The position of the operation.
   * @param {string} operator - The operator used.
   * @throws {FormulaError}
   */
  static unexpectedDataType(position: number, operator: string): never {
    throw new FormulaError(
      `Unexpected type of data when ${operator} on the position ${position}`,
      'unexpectedDataType',
      [position, operator],
    );
  }

  /**
   * Throws an error when an unsupported operation is attempted.
   * @param {string} operation - The unsupported operation.
   * @throws {FormulaError}
   */
  static unsupportedOperationError(operation: string): never {
    throw new FormulaError(
      `Unsupported operation: ${operation}`,
      'unsupportedOperationError',
      [operation],
    );
  }

  // === RUNTIME / MAPPING ERRORS ===

  /**
   * Throws an error when mapping from IDs fails due to a missing variable.
   * @param {string} varKey - The variable key that was not found.
   * @throws {FormulaError}
   */
  static mapIdsFromError(varKey: string): never {
    throw new FormulaError(
      `Variable ${varKey} or matching 'from' field not found`,
      'mapIdsFromError',
      [varKey],
    );
  }

  /**
   * Throws an error when mapping to a destination fails due to a missing field.
   * @param {string} varKey - The variable key.
   * @param {unknown} to - The field that was expected on the variable.
   * @throws {Error}
   */
  static mapIdsToError(varKey: string, to: unknown): never {
    throw new FormulaError(
      `Variable ${varKey} doesn't have the '${to}' field`,
      'mapIdsToError',
      [varKey, to],
    );
  }

  /**
   * Throws an error when mapping IDs is impossible due to a formula error.
   * @throws {Error}
   */
  static impossibleMapIds(): never {
    throw new FormulaError(
      'Impossible map identifiers because formula has Error',
      'impossibleMapIds',
      [],
    );
  }

  /**
   * Throws an error when the result of a JS formula is invalid.
   * @param {unknown} result - The invalid result.
   * @throws {Error}
   */
  static invalidJsResult(result: unknown): never {
    throw new FormulaError(
      `JS formula result is invalid: ${result}`,
      'invalidJsResult',
      [result],
    );
  }

  /**
   * Throws an error when required variables are missing from values.
   * @param {unknown[]} missingVariables - The list of missing variables.
   * @throws {Error}
   */
  static missingVarsInValues(missingVariables: unknown[]): never {
    throw new FormulaError(
      `Missing variables in values ${missingVariables.join(', ')}`,
      'missingVarsInValues',
      [missingVariables],
    );
  }
}
