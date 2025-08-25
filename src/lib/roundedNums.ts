export const roundedJs = (str: string) => `Number((${str}).toFixed(10))`;
export const roundedSql = (str: string) => `ROUND(${str}, 10)`;
