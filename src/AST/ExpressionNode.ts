export default class ExpressionNode {
  type: string;
  start: number;
  end: number;

  constructor(type: string, start: number, end: number) {
    this.type = type;
    this.start = start;
    this.end = end;
  }
}
