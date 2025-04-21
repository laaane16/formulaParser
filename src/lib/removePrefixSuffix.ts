import { FORMULA_TEMPLATES } from '../constants/templates';

// Метод для удаления префиксов и постфиксов
export function removePrefixSuffix(variable: string): string {
  const { PREFIX, POSTFIX } = FORMULA_TEMPLATES;
  if (variable.startsWith(PREFIX) && variable.endsWith(POSTFIX)) {
    return variable.slice(PREFIX.length, -POSTFIX.length);
  }
  return variable;
}
