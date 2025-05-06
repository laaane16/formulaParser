import { keywordFunctionsToSqlMap } from '../../../../src/Parser/mappers/functions/keywordFunctions/sql';

describe('textFunctionsToJsMap', () => {
  test('ISNULL', () => {
    const result = keywordFunctionsToSqlMap.ISNULL(['null']);
    expect(result).toBe('null IS NULL');
  });
});
