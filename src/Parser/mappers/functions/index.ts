import { dateFunctions } from './dateFunctions';
import { textFunctions } from './textFunctions';
import { numberFunctions } from './numberFunctions';
// import { bpiumFunctions } from './bpiumFunctions';
import { logicFunctions } from './logicFunctions';
import { arrayFunctions } from './arrayFunctions';

import { isSafeFunction, ValidFunctionsNames, VariableFunction } from './types';


export const allFunctions: Record<ValidFunctionsNames, VariableFunction> = {
  ...textFunctions,
  ...numberFunctions,
  ...dateFunctions,
  ...logicFunctions,
  ...arrayFunctions
  // ...bpiumFunctions,
};

// mutate all js funcs for supporting check nulls in arguments without large string
Object.values(allFunctions).forEach((func) => {
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
