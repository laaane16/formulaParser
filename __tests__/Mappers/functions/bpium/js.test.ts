import { bpiumFunctionsToJsMap } from '../../../../src/Parser/mappers/functions/bpiumFunctions/js';

const bpiumValues = {
  recordDbId: 1000,
  catalogId: '$processes',
};

describe('bpiumFunctionsToJsMap', () => {
  test('RECORD_ID', () => {
    expect(bpiumFunctionsToJsMap.RECORD_ID([], bpiumValues)).toBe('1000');
  });
  test('CATALOG_ID', () => {
    expect(bpiumFunctionsToJsMap.CATALOG_ID([], bpiumValues)).toBe(
      "'$processes'",
    );
  });
});
