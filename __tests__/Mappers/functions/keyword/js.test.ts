import { keywordFunctionsToJsMap } from '../../../../src/Parser/mappers/functions/keywordFunctions/js';

describe('textFunctionsToJsMap', () => {
  test('ISNULL', () => {
    const result = keywordFunctionsToJsMap.ISNULL(['null']);
    expect(result).toBe(
      '(function(){if (null === null) {return true}else {return false}})()',
    );
  });
});
