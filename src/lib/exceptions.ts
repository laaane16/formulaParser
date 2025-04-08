export class FormulaError extends Error {
  /**
   * Throws a generic parsing error.
   * @param {string} message - The error message.
   * @throws {FormulaError}
   */
  static parseError(message: string): never {
    throw new FormulaError(`Parse Error: ${message}`);
  }

  /**
   * Throws an error when required parameters are missing.
   * @param {string[]} missedParams - The list of missing parameters.
   * @throws {FormulaError}
   */
  static requiredParamsError(missedParams: string[]): never {
    throw new FormulaError(
      `Missing required parameters: ${missedParams.join(', ')}`,
    );
  }

  /**
   * Throws an error when an unknown token is encountered.
   * @param {string} token - The unexpected token.
   * @throws {FormulaError}
   */
  static unknownTokenError(token: string): never {
    throw new FormulaError(`Unknown token encountered: ${token}`);
  }

  /**
   * Throws an error when an unsupported operation is attempted.
   * @param {string} operation - The unsupported operation.
   * @throws {FormulaError}
   */
  static unsupportedOperationError(operation: string): never {
    throw new FormulaError(`Unsupported operation: ${operation}`);
  }

  /**
   * Throws an error when a field is not found.
   * @param {string} fieldName - The name of the missing field.
   * @throws {FormulaError}
   */
  static fieldNotFoundError(fieldName: string): never {
    throw new FormulaError(`Field not found: ${fieldName}`);
  }

  /**
   * Throws an error when a syntax issue is detected in an expression.
   * @param {string} expression - The invalid expression.
   * @throws {FormulaError}
   */
  static syntaxError(expression: string): never {
    throw new FormulaError(`Syntax error in expression: "${expression}"`);
  }
}
