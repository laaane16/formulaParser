import { stringifyAstToSql } from '../helpers/stringifyAstToSql';
import { IVar } from '../../src/main';

const fields: Record<string, IVar> = {
  'Поле 1': {
    id: '1',
    type: 'number',
  },
  'Поле 2': {
    id: '2',
    type: 'number',
  },
  'Поле 3': {
    id: '2',
    type: 'string',
  },
};

describe('bin operator node to sql', () => {
  test('plus', () => {
    const code = '1 + 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 + 1');
  });

  test('plus can work with different types', () => {
    const code = `1 + "test"`;
    const result = stringifyAstToSql(code);

    expect(result).toBe(`CONCAT(1::varchar(255), 'test'::varchar(255))`);
  });

  test('minus', () => {
    const code = '1 - 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 - 1');
  });

  test('multiply', () => {
    const code = '1 * 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 * 1');
  });

  test('division', () => {
    const code = '1 / 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 / 1');
  });

  test('remainder', () => {
    const code = '1 % 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 % 1');
  });

  test('power', () => {
    const code = '1 ^ 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 ^ 1');
  });

  test('equal', () => {
    const code = '1 == 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 = 1');
  });

  test('equal can`t work with different types', () => {
    const code = '1 == ""';
    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when == on the position 2',
    );
  });

  test('not equal', () => {
    const code = '1 != 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 != 1');
  });

  test('not equal can`t work with different types', () => {
    const code = '1 != ""';
    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when != on the position 2',
    );
  });

  test('greater', () => {
    const code = '1 > 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 > 1');
  });

  test('greater or equal', () => {
    const code = '1 >= 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 >= 1');
  });

  test('less', () => {
    const code = '1 < 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 < 1');
  });

  test('less or equal', () => {
    const code = '1 <= 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 <= 1');
  });

  test('binary operators can work with if', () => {
    const code = 'IF(2 > 1, 1, 0) + IF(2 < 1, 1, 0)';
    const result = stringifyAstToSql(code);

    expect(result).toBe(
      'CASE WHEN 2 > 1 THEN 1 ELSE 0 END + CASE WHEN 2 < 1 THEN 1 ELSE 0 END',
    );
  });

  test('binary operators can work with valid vars, which has equal types', () => {
    const code = '{{Поле 2}} + {{Поле 2}}';
    const result = stringifyAstToSql(code, fields);

    expect(result).toBe("$$VARIABLES['Поле 2'] + $$VARIABLES['Поле 2']");
  });

  // test('and', () => {
  //   const code = '1 && 1';
  //   const result = stringifyAstToSql(code);

  //   expect(result).toBe('1 AND 1');
  // });

  // test('or', () => {
  //   const code = '1 || 1';
  //   const result = stringifyAstToSql(code);

  //   expect(result).toBe('1 OR 1');
  // });
});

// describe('bin operator node to js', () => {
//   test('plus', () => {
//     const code = '1 + 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 + 1');
//   });

//   test('minus', () => {
//     const code = '1 - 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 - 1');
//   });

//   test('multiply', () => {
//     const code = '1 * 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 * 1');
//   });

//   test('division', () => {
//     const code = '1 / 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 / 1');
//   });

//   test('remainder', () => {
//     const code = '1 % 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 % 1');
//   });

//   test('power', () => {
//     const code = '1 ^ 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 ^ 1');
//   });

//   test('equal', () => {
//     const code = '1 == 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 = 1');
//   });

//   test('not equal', () => {
//     const code = '1 != 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 != 1');
//   });

//   test('greater', () => {
//     const code = '1 > 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 > 1');
//   });

//   test('greater or equal', () => {
//     const code = '1 >= 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 >= 1');
//   });

//   test('less', () => {
//     const code = '1 < 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 < 1');
//   });

//   test('less or equal', () => {
//     const code = '1 <= 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 <= 1');
//   });

//   test('and', () => {
//     const code = '1 && 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 AND 1');
//   });

//   test('or', () => {
//     const code = '1 || 1';
//     const result = stringifyAstToSql(code);

//     expect(result).toBe('1 OR 1');
//   });
// });

describe('bin operator node errors', () => {
  // test('plus can`t work with different types', () => {
  //   const code = '1 + ""';

  //   expect(() => stringifyAstToSql(code)).toThrow(
  //     'Unexpected type of data when + on the position 2',
  //   );
  // });

  test('plus can`t work with vats which has different types', () => {
    const code = '{{Поле 3}} + {{Поле 2}}';

    expect(() => stringifyAstToSql(code, fields)).toThrow(
      'Unexpected type of data when + on the position 11',
    );
  });

  test('binary operators can`t work with IfStatementNode if it may returns different types', () => {
    const code = 'IF(2 > 1, "", 0) + 1';

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when + on the position 17',
    );
  });
});
