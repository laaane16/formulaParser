type IFunc = (...args: string[]) => string;

export const ifStatementMap: Record<string, IFunc> = {
  jsFn: (
    test: string,
    consequent: string,
    alternate: string,
    type?: string,
  ) => {
    if (!type) {
      return `((${consequent}) !== null && (${alternate}) !== null ? (function(){if (${test}){return ${consequent}}else{return ${alternate}}})(): null)`;
    }
    return `((${consequent}) !== null && (${alternate}) !== null ? ${type}((function(){if (${test}){return ${consequent}}else{return ${alternate}}})()): null)`;
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
