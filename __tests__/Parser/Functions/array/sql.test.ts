import { Parser } from '../../../../src';

describe('arrays funcs sql querys', () => {
  const variables = {
    status: {
      name: 'status',
      id: '3',
      type: 'dropdown',
    },
  };

  const values = {
    status: 'field5',
  };

  test('sql INDEX with primitive arr', () => {
    const parser = new Parser('INDEX([1,2,3], 0)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN (0) >= 0 THEN (ARRAY[1,2,3])[(0) + 1] ELSE NULL END)',
    );
  });
  test('sql INDEX with primitive arr with unexpected positive idx', () => {
    const parser = new Parser('INDEX([1,2,3], 5)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN (5) >= 0 THEN (ARRAY[1,2,3])[(5) + 1] ELSE NULL END)',
    );
  });
  test('sql INDEX with primitive arr with unexpected negative idx', () => {
    const parser = new Parser('INDEX([1,2,3], -1)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN ((- 1)) >= 0 THEN (ARRAY[1,2,3])[((- 1)) + 1] ELSE NULL END)',
    );
  });

  test('sql INDEX with items arr', () => {
    const parser = new Parser('INDEX({status}, 0)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE WHEN (0) >= 0 THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[(0) + 1] ELSE NULL END)`,
    );
  });
  test('sql INDEX with items arr with unexpected positive idx', () => {
    const parser = new Parser('INDEX({status}, 5)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN (5) >= 0 THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[(5) + 1] ELSE NULL END)',
    );
  });
  test('sql INDEX with items arr with unexpected negative idx', () => {
    const parser = new Parser('INDEX({status}, -1)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN ((- 1)) >= 0 THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((- 1)) + 1] ELSE NULL END)',
    );
  });
  test('sql INDEX with items arr and attr', () => {
    const parser = new Parser('INDEX({status}, 0, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE WHEN (0) >= 0 THEN ("field5")[(0) + 1] ELSE NULL END) WHEN 'name' THEN (CASE WHEN (0) >= 0 THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[(0) + 1] ELSE NULL END) ELSE NULL END)`,
    );
  });
  test('sql INDEX with items arr with unexpected positive idx and attr', () => {
    const parser = new Parser('INDEX({status}, 5, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE WHEN (5) >= 0 THEN ("field5")[(5) + 1] ELSE NULL END) WHEN 'name' THEN (CASE WHEN (5) >= 0 THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[(5) + 1] ELSE NULL END) ELSE NULL END)`,
    );
  });
  test('sql INDEX with items arr with unexpected negative idx and attr', () => {
    const parser = new Parser('INDEX({status}, -1, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE WHEN ((- 1)) >= 0 THEN ("field5")[((- 1)) + 1] ELSE NULL END) WHEN 'name' THEN (CASE WHEN ((- 1)) >= 0 THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((- 1)) + 1] ELSE NULL END) ELSE NULL END)`,
    );
  });
  test('sql INDEX with items arr with unexpected attr', () => {
    const parser = new Parser('INDEX({status}, 0, "idsadas")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('idsadas') WHEN 'id' THEN (CASE WHEN (0) >= 0 THEN ("field5")[(0) + 1] ELSE NULL END) WHEN 'name' THEN (CASE WHEN (0) >= 0 THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[(0) + 1] ELSE NULL END) ELSE NULL END)`,
    );
  });

  test('sql ID', () => {
    const parser = new Parser('ID({status})', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe('"field5"');
  });

  test('sql NAME', () => {
    const parser = new Parser('NAME({status})', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")`,
    );
  });

  test('sql COUNT with items', () => {
    const parser = new Parser('COUNT({status})', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      'ARRAY_LENGTH("field5", 1)',
    );
  });
  test('sql COUNT with nested arrays', () => {
    const parser = new Parser('COUNT([["1,2,3"], ["1"], ["2"]])', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      "ARRAY_LENGTH(ARRAY[ARRAY['1,2,3'],ARRAY['1'],ARRAY['2']], 1)",
    );
  });

  test('sql UNIQUE with primitive arr', () => {
    const parser = new Parser('UNIQUE([1,2,3,3,2,1,1/0])');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      'ARRAY(SELECT DISTINCT UNNEST(ARRAY[1,2,3,3,2,1,(CASE WHEN (0) != 0 THEN ROUND((1)::numeric / 0, 10)::NUMERIC ELSE NULL END)]))',
    );
  });
  test('sql UNIQUE with items arr', () => {
    const parser = new Parser('UNIQUE({status})', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `ARRAY(SELECT DISTINCT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")))`,
    );
  });
  test('sql UNIQUE with items arr with attr', () => {
    const parser = new Parser('UNIQUE({status}, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN ARRAY(SELECT DISTINCT UNNEST("field5")) WHEN 'name' THEN ARRAY(SELECT DISTINCT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))) ELSE NULL END)`,
    );
  });
  test('sql UNIQUE with items arr with unexpected attr', () => {
    const parser = new Parser('UNIQUE({status}, "asdasd")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('asdasd') WHEN 'id' THEN ARRAY(SELECT DISTINCT UNNEST("field5")) WHEN 'name' THEN ARRAY(SELECT DISTINCT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))) ELSE NULL END)`,
    );
  });

  test('sql SLICE with primitive arr', () => {
    const parser = new Parser('SLICE([1,2,3], 1)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN ((1) >= 0) THEN (ARRAY[1,2,3])[((1) + 1):ARRAY_LENGTH(ARRAY[1,2,3], 1)] ELSE NULL END)',
    );
  });
  test('sql SLICE with primitive arr with end', () => {
    const parser = new Parser('SLICE([1,2,3], 1, 3)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN ((1) >= 0 AND (3) >= 0) THEN (ARRAY[1,2,3])[((1) + 1):(3)] ELSE NULL END)',
    );
  });
  test('sql SLICE with primitive arr with end and start equality', () => {
    const parser = new Parser('SLICE([1,2,3], 1, 1)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN ((1) >= 0 AND (1) >= 0) THEN (ARRAY[1,2,3])[((1) + 1):(1)] ELSE NULL END)',
    );
  });
  test('sql SLICE with primitive arr with negative start', () => {
    const parser = new Parser('SLICE([1,2,3], -1)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN (((- 1)) >= 0) THEN (ARRAY[1,2,3])[(((- 1)) + 1):ARRAY_LENGTH(ARRAY[1,2,3], 1)] ELSE NULL END)',
    );
  });
  test('sql SLICE with primitive arr with larger end', () => {
    const parser = new Parser('SLICE([1,2,3], 1, 6)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN ((1) >= 0 AND (6) >= 0) THEN (ARRAY[1,2,3])[((1) + 1):(6)] ELSE NULL END)',
    );
  });
  test('sql SLICE with primitive arr with end smaller start', () => {
    const parser = new Parser('SLICE([1,2,3], 2, 1)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE WHEN ((2) >= 0 AND (1) >= 0) THEN (ARRAY[1,2,3])[((2) + 1):(1)] ELSE NULL END)',
    );
  });

  test('sql SLICE with items arr', () => {
    const parser = new Parser('SLICE({status}, 0)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE WHEN ((0) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((0) + 1):ARRAY_LENGTH("field5", 1)] ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with end', () => {
    const parser = new Parser('SLICE({status}, 0, 2)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE WHEN ((0) >= 0 AND (2) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((0) + 1):(2)] ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with end and start equality 1', () => {
    const parser = new Parser('SLICE({status}, 1, 1)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE WHEN ((1) >= 0 AND (1) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((1) + 1):(1)] ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with negative start', () => {
    const parser = new Parser('SLICE({status}, -1)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE WHEN (((- 1)) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[(((- 1)) + 1):ARRAY_LENGTH("field5", 1)] ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with larger end', () => {
    const parser = new Parser('SLICE({status}, 1, 6)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE WHEN ((1) >= 0 AND (6) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((1) + 1):(6)] ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with end smaller start', () => {
    const parser = new Parser('SLICE({status}, 2, 1)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE WHEN ((2) >= 0 AND (1) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((2) + 1):(1)] ELSE NULL END)`,
    );
  });

  test('sql SLICE with items arr and attr', () => {
    const parser = new Parser('SLICE({status}, 0, 2, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE WHEN ((0) >= 0 AND (2) >= 0) THEN ("field5")[((0) + 1):(2)] ELSE NULL END) WHEN 'name' THEN (CASE WHEN ((0) >= 0 AND (2) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((0) + 1):(2)] ELSE NULL END) ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with end and start equality', () => {
    const parser = new Parser('SLICE({status}, 1, 1, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE WHEN ((1) >= 0 AND (1) >= 0) THEN ("field5")[((1) + 1):(1)] ELSE NULL END) WHEN 'name' THEN (CASE WHEN ((1) >= 0 AND (1) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((1) + 1):(1)] ELSE NULL END) ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with negative start', () => {
    const parser = new Parser('SLICE({status}, -1, 0, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE WHEN (((- 1)) >= 0 AND (0) >= 0) THEN ("field5")[(((- 1)) + 1):(0)] ELSE NULL END) WHEN 'name' THEN (CASE WHEN (((- 1)) >= 0 AND (0) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[(((- 1)) + 1):(0)] ELSE NULL END) ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with larger end', () => {
    const parser = new Parser('SLICE({status}, 1, 6, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE WHEN ((1) >= 0 AND (6) >= 0) THEN ("field5")[((1) + 1):(6)] ELSE NULL END) WHEN 'name' THEN (CASE WHEN ((1) >= 0 AND (6) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((1) + 1):(6)] ELSE NULL END) ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr with end smaller start', () => {
    const parser = new Parser('SLICE({status}, 2, 1, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE WHEN ((2) >= 0 AND (1) >= 0) THEN ("field5")[((2) + 1):(1)] ELSE NULL END) WHEN 'name' THEN (CASE WHEN ((2) >= 0 AND (1) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((2) + 1):(1)] ELSE NULL END) ELSE NULL END)`,
    );
  });
  test('sql SLICE with items arr and unexpected attr', () => {
    const parser = new Parser('SLICE({status}, 0, 2, "idasdsad")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('idasdsad') WHEN 'id' THEN (CASE WHEN ((0) >= 0 AND (2) >= 0) THEN ("field5")[((0) + 1):(2)] ELSE NULL END) WHEN 'name' THEN (CASE WHEN ((0) >= 0 AND (2) >= 0) THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[((0) + 1):(2)] ELSE NULL END) ELSE NULL END)`,
    );
  });

  test('sql FIND with primitive arr', () => {
    const parser = new Parser('FIND([1,2,3], 1)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(ARRAY[1,2,3])[ARRAY_POSITION(ARRAY[1,2,3], 1)]',
    );
  });
  test('sql FIND with primitive arr when item dont includes', () => {
    const parser = new Parser('FIND([1,2,3], 4)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(ARRAY[1,2,3])[ARRAY_POSITION(ARRAY[1,2,3], 4)]',
    );
  });
  test('sql FIND with items arr', () => {
    const parser = new Parser('FIND({status}, "Завершено")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[ARRAY_POSITION((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), 'Завершено')]`,
    );
  });
  test('sql FIND with items arr and id attr', () => {
    const parser = new Parser('FIND({status}, "123", "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN ("field5")[ARRAY_POSITION("field5", '123')] WHEN 'name' THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[ARRAY_POSITION((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), '123')] ELSE NULL END)`,
    );
  });
  test('sql FIND with items arr and attr', () => {
    const parser = new Parser('FIND({status}, "Открыто", "name")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('name') WHEN 'id' THEN ("field5")[ARRAY_POSITION("field5", 'Открыто')] WHEN 'name' THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[ARRAY_POSITION((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), 'Открыто')] ELSE NULL END)`,
    );
  });
  test('sql FIND with items arr and unexpected attr', () => {
    const parser = new Parser(
      'FIND({status}, "Открыто", "nameasdsa")',
      variables,
    );
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('nameasdsa') WHEN 'id' THEN ("field5")[ARRAY_POSITION("field5", 'Открыто')] WHEN 'name' THEN ((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[ARRAY_POSITION((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), 'Открыто')] ELSE NULL END)`,
    );
  });
  test('sql FIND with items arr and item dont icludes', () => {
    const parser = new Parser('FIND({status}, "126")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"))[ARRAY_POSITION((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), '126')]`,
    );
  });

  test('sql FILTER with primitive arr', () => {
    const parser = new Parser('FILTER([1,2,3], 1)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      'ARRAY_REMOVE(ARRAY[1,2,3], 1)',
    );
  });
  test('sql FILTER with primitive arr when item dont includes', () => {
    const parser = new Parser('FILTER([1,2,3], 4)');
    expect(parser.toSqlWithVariables(true, values)).toBe(
      'ARRAY_REMOVE(ARRAY[1,2,3], 4)',
    );
  });
  test('sql FILTER with items arr', () => {
    const parser = new Parser('FILTER({status}, "Завершено")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `ARRAY_REMOVE((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), 'Завершено')`,
    );
  });
  test('sql FILTER with items arr and attr', () => {
    const parser = new Parser('FILTER({status}, "123", "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN ARRAY_REMOVE("field5", '123') WHEN 'name' THEN ARRAY_REMOVE((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), '123') ELSE NULL END)`,
    );
  });
  test('sql FILTER with items arr and attr', () => {
    const parser = new Parser('FILTER({status}, "Открыто", "name")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('name') WHEN 'id' THEN ARRAY_REMOVE("field5", 'Открыто') WHEN 'name' THEN ARRAY_REMOVE((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), 'Открыто') ELSE NULL END)`,
    );
  });
  test('sql FILTER with items arr and unexpected attr', () => {
    const parser = new Parser(
      'FILTER({status}, "Открыто", "nameasdsa")',
      variables,
    );
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('nameasdsa') WHEN 'id' THEN ARRAY_REMOVE("field5", 'Открыто') WHEN 'name' THEN ARRAY_REMOVE((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), 'Открыто') ELSE NULL END)`,
    );
  });
  test('sql FILTER with items arr and item dont icludes', () => {
    const parser = new Parser('FILTER({status}, "В процессе")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `ARRAY_REMOVE((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name"), 'В процессе')`,
    );
  });

  test('sql SORT with num arr', () => {
    const parser = new Parser('SORT([2,6,4])', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      'ARRAY(SELECT UNNEST(ARRAY[2,6,4]) ORDER BY 1)',
    );
  });
  test('sql SORT with num arr posi mode', () => {
    const parser = new Parser('SORT([2,6,4], 1)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST(ARRAY[2,6,4]) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(ARRAY[2,6,4]) ORDER BY 1) END)',
    );
  });
  test('sql SORT with num arr negative mode', () => {
    const parser = new Parser('SORT([2,6,4], -1)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE ((- 1)) WHEN -1 THEN ARRAY(SELECT UNNEST(ARRAY[2,6,4]) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(ARRAY[2,6,4]) ORDER BY 1) END)',
    );
  });
  test('sql SORT with num arr unexpected mode', () => {
    const parser = new Parser('SORT([2,6,4], -2)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      '(CASE ((- 2)) WHEN -1 THEN ARRAY(SELECT UNNEST(ARRAY[2,6,4]) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(ARRAY[2,6,4]) ORDER BY 1) END)',
    );
  });
  test('sql SORT with date arr', () => {
    const parser = new Parser(
      'SORT([DATE(1000, 12, 12), DATE(200, 12, 12)])',
      variables,
    );
    expect(parser.toSqlWithVariables(true, values))
      .toBe(`ARRAY(SELECT UNNEST(ARRAY[(MAKE_DATE(1000, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ,(MAKE_DATE(200, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ]) ORDER BY 1)`);
  });
  test('sql SORT with date arr posi mode', () => {
    const parser = new Parser(
      'SORT([DATE(1000, 12, 12), DATE(200, 12, 12)], 1)',
      variables,
    );
    expect(parser.toSqlWithVariables(true, values))
      .toBe(`(CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST(ARRAY[(MAKE_DATE(1000, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ,(MAKE_DATE(200, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ]) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(ARRAY[(MAKE_DATE(1000, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ,(MAKE_DATE(200, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ]) ORDER BY 1) END)`);
  });
  test('sql SORT with date arr negative mode', () => {
    const parser = new Parser(
      'SORT([DATE(1000, 12, 12), DATE(200, 12, 12)], -1)',
      variables,
    );
    expect(parser.toSqlWithVariables(true, values))
      .toBe(`(CASE ((- 1)) WHEN -1 THEN ARRAY(SELECT UNNEST(ARRAY[(MAKE_DATE(1000, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ,(MAKE_DATE(200, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ]) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(ARRAY[(MAKE_DATE(1000, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ,(MAKE_DATE(200, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ]) ORDER BY 1) END)`);
  });
  test('sql SORT with date arr unexpected mode', () => {
    const parser = new Parser(
      'SORT([DATE(1000, 12, 12), DATE(200, 12, 12)], -2)',
      variables,
    );
    expect(parser.toSqlWithVariables(true, values))
      .toBe(`(CASE ((- 2)) WHEN -1 THEN ARRAY(SELECT UNNEST(ARRAY[(MAKE_DATE(1000, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ,(MAKE_DATE(200, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ]) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST(ARRAY[(MAKE_DATE(1000, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ,(MAKE_DATE(200, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ]) ORDER BY 1) END)`);
  });
  test('sql SORT with items arr', () => {
    const parser = new Parser('SORT({status})', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1)`,
    );
  });
  test('sql SORT with items arr posi mode', () => {
    const parser = new Parser('SORT({status}, 1)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END)`,
    );
  });
  test('sql SORT with items arr negative mode', () => {
    const parser = new Parser('SORT({status}, -1)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ((- 1)) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END)`,
    );
  });
  test('sql SORT with items arr unexpected mode', () => {
    const parser = new Parser('SORT({status}, -2)', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ((- 2)) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END)`,
    );
  });
  test('sql SORT with items arr and attr', () => {
    const parser = new Parser('SORT({status}, 1, "name")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('name') WHEN 'id' THEN (CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST("field5") ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST("field5") ORDER BY 1) END) WHEN 'name' THEN (CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END) ELSE NULL END)`,
    );
  });
  test('sql SORT with items arr posi mode and attr', () => {
    const parser = new Parser('SORT({status}, 1, "name")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('name') WHEN 'id' THEN (CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST("field5") ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST("field5") ORDER BY 1) END) WHEN 'name' THEN (CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END) ELSE NULL END)`,
    );
  });
  test('sql SORT with items arr negative mode and attr', () => {
    const parser = new Parser('SORT({status}, -1, "name")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('name') WHEN 'id' THEN (CASE ((- 1)) WHEN -1 THEN ARRAY(SELECT UNNEST("field5") ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST("field5") ORDER BY 1) END) WHEN 'name' THEN (CASE ((- 1)) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END) ELSE NULL END)`,
    );
  });
  test('sql SORT with items arr unexpected mode and attr', () => {
    const parser = new Parser('SORT({status}, -2, "name")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('name') WHEN 'id' THEN (CASE ((- 2)) WHEN -1 THEN ARRAY(SELECT UNNEST("field5") ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST("field5") ORDER BY 1) END) WHEN 'name' THEN (CASE ((- 2)) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END) ELSE NULL END)`,
    );
  });
  test('sql SORT with items arr and attr', () => {
    const parser = new Parser('SORT({status}, 1, "id")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('id') WHEN 'id' THEN (CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST("field5") ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST("field5") ORDER BY 1) END) WHEN 'name' THEN (CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END) ELSE NULL END)`,
    );
  });
  test('sql SORT with items arr and unexpected attr', () => {
    const parser = new Parser('SORT({status}, 1, "nameasdasd")', variables);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(CASE ('nameasdasd') WHEN 'id' THEN (CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST("field5") ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST("field5") ORDER BY 1) END) WHEN 'name' THEN (CASE (1) WHEN -1 THEN ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1 DESC) ELSE ARRAY(SELECT UNNEST((SELECT ARRAY_AGG("field5_names".name) FROM UNNEST("field5") "field5_name" JOIN "field5_names" on "field5_names".id = "field5_name")) ORDER BY 1) END) ELSE NULL END)`,
    );
  });

  // test('sql FLATTEN', () => {
  //   const parser = new Parser('FLATTEN([[1,2,3],[1,2,3]])', variables);
  //   expect(parser.toSqlWithVariables(true, values)).toBe(
  //     'ARRAY(SELECT UNNEST(ARRAY[ARRAY[1,2,3],ARRAY[1,2,3]]))',
  //   );
  // });
  // test('sql FLATTEN with 3 nesting arrs', () => {
  //   const parser = new Parser('FLATTEN([[[1,2,3]],[[1,2,3]]])', variables);
  //   expect(parser.toSqlWithVariables(true, values)).toBe(
  //     'ARRAY(SELECT UNNEST(ARRAY[ARRAY[ARRAY[1,2,3]],ARRAY[ARRAY[1,2,3]]]))',
  //   );
  // });
  // test('sql FLATTEN with nested arrs with items', () => {
  //   const parser = new Parser('FLATTEN([{status}, {status}])', variables);
  //   expect(parser.toSqlWithVariables(true, values)).toBe([
  //     'Завершено',
  //     'Открыто',
  //     'Завершено',
  //     'Открыто',
  //   ]);
  // });
  // test('sql FLATTEN with nested arrs with items and attr', () => {
  //   const parser = new Parser(
  //     'FLATTEN([{status}, {status}], "name")',
  //     variables,
  //   );
  //   expect(parser.toSqlWithVariables(true, values)).toBe([
  //     'Завершено',
  //     'Открыто',
  //     'Завершено',
  //     'Открыто',
  //   ]);
  // });
  // test('sql FLATTEN with nested arrs with items and attr', () => {
  //   const parser = new Parser('FLATTEN([{status}, {status}], "id")', variables);
  //   expect(parser.toSqlWithVariables(true, values)).toBe([
  //     '123',
  //     '124',
  //     '123',
  //     '124',
  //   ]);
  // });
  // test('sql FLATTEN with nested arrs with items and unexpected attr', () => {
  //   const parser = new Parser(
  //     'FLATTEN([{status}, {status}], "asdasdas")',
  //     variables,
  //   );
  //   expect(parser.toSqlWithVariables(true, values)).toBe(null);
  // });
});
