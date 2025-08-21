import { dateFunctions } from './dateFunctions';
import { textFunctions } from './textFunctions';
import { numberFunctions } from './numberFunctions';
import { bpiumFunctions } from './bpiumFunctions';

import { isSafeFunction, ValidFunctionsNames, VariableFunction } from './types';
import { logicFunctions } from './logicFunctions';

// mutate all js funcs for supporting check nulls in arguments without large string
Object.values({
  ...textFunctions,
  ...numberFunctions,
  ...dateFunctions,
  ...logicFunctions,
  // ...bpiumFunctions,
}).forEach((func) => {
  func.forEach((variant) => {
    if (variant.specialWorkWithNull) {
      return;
    }
    const jsFn = variant.jsFn;

    variant.jsFn = (args, bpiumValues) => {
      const preparedArgs = args.map((_, idx) => `$$ARRAY[${idx}]`);
      const fnBody = jsFn(preparedArgs, bpiumValues);
      return `(function($$ARRAY){ return $$ARRAY.some(i => i === null) ? null : (${fnBody})})([${args}])`;
    };

    if (isSafeFunction(variant)) {
      const jsSafeFn = variant.jsSafeFn;

      variant.jsSafeFn = (args, bpiumValues) => {
        const preparedArgs = args.map((_, idx) => `$$ARRAY[${idx}]`);
        const fnBody = jsSafeFn(preparedArgs, bpiumValues);
        return `(function($$ARRAY){ return $$ARRAY.some(i => i === null) ? null : (${fnBody})})([${args}])`;
      };
    }
  });
});

export const allFunctions: Record<ValidFunctionsNames, VariableFunction> = {
  ...textFunctions,
  ...numberFunctions,
  ...dateFunctions,
  ...logicFunctions,
  // ...bpiumFunctions,
};
