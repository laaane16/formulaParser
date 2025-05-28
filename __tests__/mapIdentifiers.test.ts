import Parser from '../src/main';
import { IVar } from '../src/types';

describe('Parser.mapIdentifiers', () => {
  const mockFields: IVar[] = [
    {
      dbId: 1,
      id: '1',
      columnName: 'field1',
      name: 'Section',
      type: 'section',
    },
    {
      dbId: 2,
      id: '2',
      type: 'text',
      columnName: 'field2',
      name: 'Text',
      formulaConfig: {
        formula: '{{3}} + 11 + 22',
      },
    },
    {
      dbId: 3,
      id: 'third',
      columnName: 'field3',
      name: 'Number',
      type: 'number',
    },
  ];

  const expression = '{{3}} + 11 + 22';

  it('should map identifiers from dbId to id ({{3}} should remain unchanged)', () => {
    const parser = new Parser(expression, mockFields);
    const result = parser.mapIdentifiers({ from: 'dbId', to: 'id' });

    expect(result).toBe(`{{third}} + 11 + 22`);
  });

  it('should map identifiers from dbId to columnName ({{3}} should become {{field3}})', () => {
    const parser = new Parser(expression, mockFields);
    const result = parser.mapIdentifiers({ from: 'dbId', to: 'columnName' });

    expect(result).toBe(`{{field3}} + 11 + 22`);
  });

  it('should throw an error if variable not found using "from" field', () => {
    const parser = new Parser('{{999}} + 10', mockFields);

    expect(() => parser.mapIdentifiers({ from: 'dbId', to: 'id' })).toThrow();
  });

  it('should throw an error if target field ("to") does not exist', () => {
    const fieldsMissingTo = [
      { dbId: 3, type: 'number', id: '3' }, // columnName missing
    ];
    const parser = new Parser('{{3}} + 1', fieldsMissingTo);

    expect(() =>
      parser.mapIdentifiers({ from: 'id', to: 'columnName' }),
    ).toThrow();
  });
});
