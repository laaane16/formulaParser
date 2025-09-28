type IFunc = (
  test: string,
  consequent: string,
  alternate: string,
  type?: string,
  withoutCasting?: boolean,
) => string;

export const ifStatementMap: Record<string, IFunc> = {
  jsFn: (test, consequent, alternate, type, withoutCasting = false) => {
    if (!type || withoutCasting) {
      return `(function(){let test = (${test});let consequent = (${consequent}); let alternate = (${alternate});if (consequent !== null && test !== null && alternate !== null){if (test){return consequent}else{return alternate}}return null})()`;
    }
    return `(function(){let test = (${test});let consequent = (${consequent}); let alternate = (${alternate});if (consequent !== null && test !== null && alternate !== null){if (test){return ${type}(consequent)}else{return ${type}(alternate)}}return null})()`;
  },
  sqlFn: (test, consequent, alternate, type, withoutCasting = false) => {
    if (withoutCasting) {
      return `(CASE WHEN (${test}) THEN (${consequent}) ELSE (${alternate}) END)`;
    }

    if (!type) {
      return `(CASE WHEN (${test}) THEN (${consequent})::text ELSE (${alternate})::text END)`;
    }
    return `(CASE WHEN (${test}) THEN (${consequent})::text ELSE (${alternate})::text END)::${type}`;
  },
};
