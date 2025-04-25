export const validateResultJs = (result: unknown) => {
  if (typeof result === 'number' && (isNaN(result) || !isFinite(result))) {
    throw new Error(`JS formula result is invalid: ${result}`);
  }

  if (result === undefined || result === null) {
    throw new Error(`JS formula result is ${String(result)}`);
  }
};
