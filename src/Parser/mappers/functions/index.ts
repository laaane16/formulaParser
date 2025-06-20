import { dateFunctions } from './dateFunctions';
import { textFunctions } from './textFunctions';
import { numberFunctions } from './numberFunctions';
import { bpiumFunctions } from './bpiumFunctions';

import { isSafeFunction, ValidFunctionsNames, VariableFunction } from './types';

export const allFunctions: Record<ValidFunctionsNames, VariableFunction> = {
  ...textFunctions,
  ...numberFunctions,
  ...dateFunctions,
  ...bpiumFunctions,
};

Object.values(allFunctions).forEach((func) => {
  func.forEach((variant) => {
    if (variant.specialWorkWithNull) {
      return;
    }
    const jsFn = variant.jsFn;

    variant.jsFn = (args, bpiumValues) =>
      `[${args}].some((i) => i === null) ? null : (${jsFn(args, bpiumValues)})`;

    if (isSafeFunction(variant)) {
      const jsSafeFn = variant.jsSafeFn;
      variant.jsSafeFn = (args, bpiumValues) =>
        `([${args}].some((i) => i === null) ? null : (${jsSafeFn(args, bpiumValues)}))`;
    }
  });
});
