import { Parser } from '../../../../src';

describe('arrays funcs executing', () => {
  const variables = {
    status: {
      name: 'status',
      id: '3',
      type: 'dropdown',
    },
  };

  const values = {
    status: [
      { id: '123', dbId: 123, name: 'Завершено' },
      { id: '124', dbId: 124, name: 'Открыто' },
    ],
  };

  const valuesWithDublicate = {
    status: [
      ...values.status,
      { id: '124', dbId: 124, name: 'В процессе' },
      { id: '125', dbId: 125, name: 'Открыто' },
    ],
  };

  test('INDEX with primitive arr', () => {
    const parser = new Parser('INDEX([1,2,3], 0)');
    expect(parser.runJs(parser.toJs())).toBe(1);
  });
  test('INDEX with primitive arr with unexpected positive idx', () => {
    const parser = new Parser('INDEX([1,2,3], 5)');
    expect(parser.runJs(parser.toJs())).toBe(null);
  });
  test('INDEX with primitive arr with unexpected negative idx', () => {
    const parser = new Parser('INDEX([1,2,3], -1)');
    expect(parser.runJs(parser.toJs())).toBe(null);
  });

  test('INDEX with items arr', () => {
    const parser = new Parser('INDEX({status}, 0)', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe('Завершено');
  });
  test('INDEX with items arr with unexpected positive idx', () => {
    const parser = new Parser('INDEX({status}, 5)', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe(null);
  });
  test('INDEX with items arr with unexpected negative idx', () => {
    const parser = new Parser('INDEX({status}, -1)', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe(null);
  });
  test('INDEX with items arr and attr', () => {
    const parser = new Parser('INDEX({status}, 0, "id")', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe('123');
  });
  test('INDEX with items arr with unexpected positive idx and attr', () => {
    const parser = new Parser('INDEX({status}, 5, "id")', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe(null);
  });
  test('INDEX with items arr with unexpected negative idx and attr', () => {
    const parser = new Parser('INDEX({status}, -1, "id")', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe(null);
  });
  test('INDEX with items arr with unexpected attr', () => {
    const parser = new Parser('INDEX({status}, 0, "idsadas")', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe(null);
  });

  test('ID', () => {
    const parser = new Parser('ID({status})', variables);
    expect(parser.runJs(parser.toJs(), values)).toEqual(['123', '124']);
  });

  test('NAME', () => {
    const parser = new Parser('NAME({status})', variables);
    expect(parser.runJs(parser.toJs(), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });

  test('COUNT with items', () => {
    const parser = new Parser('COUNT({status})', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe(2);
  });
  test('COUNT with nested arrays', () => {
    const parser = new Parser('COUNT([["1,2,3"], ["1"], ["2"]])', variables);
    expect(parser.runJs(parser.toJs(), values)).toBe(3);
  });

  test('UNIQUE with primitive arr', () => {
    const parser = new Parser('UNIQUE([1,2,3,3,2,1,1/0])');
    expect(parser.runJs(parser.toJs(true))).toEqual([1, 2, 3, null]);
  });
  test('UNIQUE with items arr', () => {
    const parser = new Parser('UNIQUE({status})', variables);
    expect(parser.runJs(parser.toJs(), valuesWithDublicate)).toEqual([
      'Завершено',
      'Открыто',
      'В процессе',
    ]);
  });
  test('UNIQUE with items arr with attr', () => {
    const parser = new Parser('UNIQUE({status}, "id")', variables);
    expect(parser.runJs(parser.toJs(), valuesWithDublicate)).toEqual([
      '123',
      '124',
      '125',
    ]);
  });
  test('UNIQUE with items arr with unexpected attr', () => {
    const parser = new Parser('UNIQUE({status}, "asdasd")', variables);
    expect(parser.runJs(parser.toJs(), valuesWithDublicate)).toEqual(null);
  });

  test('SLICE with primitive arr', () => {
    const parser = new Parser('SLICE([1,2,3], 1)');
    expect(parser.runJs(parser.toJs(true))).toEqual([2, 3]);
  });
  test('SLICE with primitive arr with end', () => {
    const parser = new Parser('SLICE([1,2,3], 1, 3)');
    expect(parser.runJs(parser.toJs(true))).toEqual([2, 3]);
  });
  test('SLICE with primitive arr with end and start equality', () => {
    const parser = new Parser('SLICE([1,2,3], 1, 1)');
    expect(parser.runJs(parser.toJs(true))).toEqual([]);
  });
  test('SLICE with primitive arr with negative start', () => {
    const parser = new Parser('SLICE([1,2,3], -1)');
    expect(parser.runJs(parser.toJs(true))).toEqual(null);
  });
  test('SLICE with primitive arr with larger end', () => {
    const parser = new Parser('SLICE([1,2,3], 1, 6)');
    expect(parser.runJs(parser.toJs(true))).toEqual([2, 3]);
  });
  test('SLICE with primitive arr with end smaller start', () => {
    const parser = new Parser('SLICE([1,2,3], 2, 1)');
    expect(parser.runJs(parser.toJs(true))).toEqual([]);
  });

  test('SLICE with items arr', () => {
    const parser = new Parser('SLICE({status}, 0)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });
  test('SLICE with items arr with end', () => {
    const parser = new Parser('SLICE({status}, 0, 2)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });
  test('SLICE with items arr with end and start equality', () => {
    const parser = new Parser('SLICE({status}, 1, 1)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([]);
  });
  test('SLICE with items arr with negative start', () => {
    const parser = new Parser('SLICE({status}, -1)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(null);
  });
  test('SLICE with items arr with larger end', () => {
    const parser = new Parser('SLICE({status}, 1, 6)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(['Открыто']);
  });
  test('SLICE with items arr with end smaller start', () => {
    const parser = new Parser('SLICE({status}, 2, 1)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([]);
  });

  test('SLICE with items arr and attr', () => {
    const parser = new Parser('SLICE({status}, 0, 2, "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(['123', '124']);
  });
  test('SLICE with items arr with end and attr', () => {
    const parser = new Parser('SLICE({status}, 0, 2, "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(['123', '124']);
  });
  test('SLICE with items arr with end and start equality', () => {
    const parser = new Parser('SLICE({status}, 1, 1, "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([]);
  });
  test('SLICE with items arr with negative start', () => {
    const parser = new Parser('SLICE({status}, -1, 0, "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toBe(null);
  });
  test('SLICE with items arr with larger end', () => {
    const parser = new Parser('SLICE({status}, 1, 6, "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(['124']);
  });
  test('SLICE with items arr with end smaller start', () => {
    const parser = new Parser('SLICE({status}, 2, 1, "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([]);
  });
  test('SLICE with items arr and unexpected attr', () => {
    const parser = new Parser('SLICE({status}, 0, 2, "idasdsad")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toBe(null);
  });

  test('FIND with primitive arr', () => {
    const parser = new Parser('FIND([1,2,3], 1)');
    expect(parser.runJs(parser.toJs(true))).toBe(1);
  });
  test('FIND with primitive arr when item dont includes', () => {
    const parser = new Parser('FIND([1,2,3], 4)');
    expect(parser.runJs(parser.toJs(true))).toBe(null);
  });
  test('FIND with items arr', () => {
    const parser = new Parser('FIND({status}, "Завершено")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toBe('Завершено');
  });
  test('FIND with items arr and attr', () => {
    const parser = new Parser('FIND({status}, "123", "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toBe('123');
  });
  test('FIND with items arr and attr', () => {
    const parser = new Parser('FIND({status}, "Открыто", "name")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toBe('Открыто');
  });
  test('FIND with items arr and unexpected attr', () => {
    const parser = new Parser(
      'FIND({status}, "Открыто", "nameasdsa")',
      variables,
    );
    expect(parser.runJs(parser.toJs(true), values)).toBe(null);
  });
  test('FIND with items arr and item dont icludes', () => {
    const parser = new Parser('FIND({status}, "126")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toBe(null);
  });

  test('FILTER with primitive arr', () => {
    const parser = new Parser('FILTER([1,2,3], 1)');
    expect(parser.runJs(parser.toJs(true))).toEqual([2, 3]);
  });
  test('FILTER with primitive arr when item dont includes', () => {
    const parser = new Parser('FILTER([1,2,3], 4)');
    expect(parser.runJs(parser.toJs(true))).toEqual([1, 2, 3]);
  });
  test('FILTER with items arr', () => {
    const parser = new Parser('FILTER({status}, "Завершено")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(['Открыто']);
  });
  test('FILTER with items arr and attr', () => {
    const parser = new Parser('FILTER({status}, "123", "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(['124']);
  });
  test('FILTER with items arr and attr', () => {
    const parser = new Parser('FILTER({status}, "Открыто", "name")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(['Завершено']);
  });
  test('FILTER with items arr and unexpected attr', () => {
    const parser = new Parser(
      'FILTER({status}, "Открыто", "nameasdsa")',
      variables,
    );
    expect(parser.runJs(parser.toJs(true), values)).toBe(null);
  });
  test('FILTER with items arr and item dont icludes', () => {
    const parser = new Parser('FILTER({status}, "В процессе")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });

  test('SORT with num arr', () => {
    const parser = new Parser('SORT([2,6,4])', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([2, 4, 6]);
  });
  test('SORT with num arr posi mode', () => {
    const parser = new Parser('SORT([2,6,4], 1)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([2, 4, 6]);
  });
  test('SORT with num arr negative mode', () => {
    const parser = new Parser('SORT([2,6,4], -1)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([6, 4, 2]);
  });
  test('SORT with num arr unexpected mode', () => {
    const parser = new Parser('SORT([2,6,4], -2)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([2, 4, 6]);
  });
  test('SORT with date arr', () => {
    const parser = new Parser(
      'SORT([DATE(1000, 12, 12), DATE(200, 12, 12)])',
      variables,
    );
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      '0200-12-12 00:00:00+02',
      '1000-12-12 00:00:00+02',
    ]);
  });
  test('SORT with date arr posi mode', () => {
    const parser = new Parser(
      'SORT([DATE(1000, 12, 12), DATE(200, 12, 12)], 1)',
      variables,
    );
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      '0200-12-12 00:00:00+02',
      '1000-12-12 00:00:00+02',
    ]);
  });
  test('SORT with date arr negative mode', () => {
    const parser = new Parser(
      'SORT([DATE(1000, 12, 12), DATE(200, 12, 12)], -1)',
      variables,
    );
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      '1000-12-12 00:00:00+02',
      '0200-12-12 00:00:00+02',
    ]);
  });
  test('SORT with date arr unexpected mode', () => {
    const parser = new Parser(
      'SORT([DATE(1000, 12, 12), DATE(200, 12, 12)], -2)',
      variables,
    );
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      '0200-12-12 00:00:00+02',
      '1000-12-12 00:00:00+02',
    ]);
  });
  test('SORT with items arr', () => {
    const parser = new Parser('SORT({status})', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });
  test('SORT with items arr posi mode', () => {
    const parser = new Parser('SORT({status}, 1)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });
  test('SORT with items arr negative mode', () => {
    const parser = new Parser('SORT({status}, -1)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Открыто',
      'Завершено',
    ]);
  });
  test('SORT with items arr unexpected mode', () => {
    const parser = new Parser('SORT({status}, -2)', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });
  test('SORT with items arr and attr', () => {
    const parser = new Parser('SORT({status}, 1, "name")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });
  test('SORT with items arr posi mode and attr', () => {
    const parser = new Parser('SORT({status}, 1, "name")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });
  test('SORT with items arr negative mode and attr', () => {
    const parser = new Parser('SORT({status}, -1, "name")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Открыто',
      'Завершено',
    ]);
  });
  test('SORT with items arr unexpected mode and attr', () => {
    const parser = new Parser('SORT({status}, -2, "name")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual([
      'Завершено',
      'Открыто',
    ]);
  });
  test('SORT with items arr and attr', () => {
    const parser = new Parser('SORT({status}, 1, "id")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(['123', '124']);
  });
  test('SORT with items arr and unexpected attr', () => {
    const parser = new Parser('SORT({status}, 1, "nameasdasd")', variables);
    expect(parser.runJs(parser.toJs(true), values)).toEqual(null);
  });

  // test('FLATTEN', () => {
  //   const parser = new Parser('FLATTEN([[1,2,3],[1,2,3]])', variables);
  //   expect(parser.runJs(parser.toJs(true), values)).toEqual([1, 2, 3, 1, 2, 3]);
  // });
  // test('FLATTEN with 3 nesting arrs', () => {
  //   const parser = new Parser('FLATTEN([[[1,2,3]],[[1,2,3]]])', variables);
  //   expect(parser.runJs(parser.toJs(true), values)).toEqual([1, 2, 3, 1, 2, 3]);
  // });
  // test('FLATTEN with nested arrs with items', () => {
  //   const parser = new Parser('FLATTEN([{status}, {status}])', variables);
  //   expect(parser.runJs(parser.toJs(true), values)).toEqual([
  //     'Завершено',
  //     'Открыто',
  //     'Завершено',
  //     'Открыто',
  //   ]);
  // });
  // test('FLATTEN with nested arrs with items and attr', () => {
  //   const parser = new Parser(
  //     'FLATTEN([{status}, {status}], "name")',
  //     variables,
  //   );
  //   expect(parser.runJs(parser.toJs(true), values)).toEqual([
  //     'Завершено',
  //     'Открыто',
  //     'Завершено',
  //     'Открыто',
  //   ]);
  // });
  // test('FLATTEN with nested arrs with items and attr', () => {
  //   const parser = new Parser('FLATTEN([{status}, {status}], "id")', variables);
  //   expect(parser.runJs(parser.toJs(true), values)).toEqual([
  //     '123',
  //     '124',
  //     '123',
  //     '124',
  //   ]);
  // });
  // test('FLATTEN with nested arrs with items and unexpected attr', () => {
  //   const parser = new Parser(
  //     'FLATTEN([{status}, {status}], "asdasdas")',
  //     variables,
  //   );
  //   expect(parser.runJs(parser.toJs(true), values)).toEqual(null);
  // });
});
