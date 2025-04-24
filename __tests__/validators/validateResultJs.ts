import { Parser } from '../../src';

describe('runJs - validateResultJs', () => {
  it('should throw an error if JS formula evaluates to NaN', () => {
    const parser = new Parser('{{1}} + 3', {
      1: { id: '1', type: 'number' },
    });

    const js = parser.toJs();

    expect(() => parser.runJs(js, {})).toThrow('Invalid result: NaN');
  });

  it('should throw an error if JS formula evaluates to undefined', () => {
    const parser = new Parser('{{1}}', {
      1: { id: '1', type: 'number' },
    });

    const js = parser.toJs();

    expect(() => parser.runJs(js, {})).toThrow('Invalid result: undefined');
  });

  it('should return correct result if formula is valid', () => {
    const parser = new Parser('{{1}} + 5', {
      1: { id: '1', type: 'number' },
    });

    const js = parser.toJs();

    const result = parser.runJs(js, { 1: 10 });
    expect(result).toBe(15);
  });
});
