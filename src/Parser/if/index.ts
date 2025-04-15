type IFunc = (...args: string[]) => string;

export const ifStatementMap: Record<string, IFunc> = {
  jsFn: (test: string, consequent: string, alternate: string) => {
    return `(function(){if (${test}){return ${consequent}}else{return ${alternate}}})()`;
  },
  sqlFn: (test: string, consequent: string, alternate: string) => {
    return `CASE WHEN ${test} THEN ${consequent} ELSE ${alternate} END`;
  },
};
