type IFunc = (...args: string[]) => string;

export const ifStatementMap: Record<string, IFunc> = {
  jsFn: (
    test: string,
    consequent: string,
    alternate: string,
    type?: string,
  ) => {
    if (!type) {
      return `(function(){let test = (${test});let consequent = (${consequent}); let alternate = (${alternate});if (consequent !== null && test !== null && alternate !== null){if (test){return consequent}else{return alternate}}return null})()`;
    }
    return `(function(){let test = (${test});let consequent = (${consequent}); let alternate = (${alternate});if (consequent !== null && test !== null && alternate !== null){if (test){return ${type}(consequent)}else{return ${type}(alternate)}}return null})()`;
  },
  sqlFn: (
    test: string,
    consequent: string,
    alternate: string,
    type?: string,
  ) => {
    if (!type) {
      return `(CASE WHEN (${test}) THEN (${consequent})::text ELSE (${alternate})::text END)`;
    }
    return `(CASE WHEN (${test}) THEN (${consequent})::text ELSE (${alternate})::text END)::${type}`;
  },
};
