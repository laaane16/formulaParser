import SpaceNode from './SpaceNode';

export default class ExpressionNode {
  type: string; // TODO: add enum for types
  start: number;
  end: number;
  leftSpaces?: SpaceNode[];
  rightSpaces?: SpaceNode[];

  constructor(
    type: string,
    start: number,
    end: number,
    leftSpaces?: SpaceNode[],
    rightSpaces?: SpaceNode[],
  ) {
    this.type = type;
    this.start = start;
    this.end = end;
    this.leftSpaces = leftSpaces;
    this.rightSpaces = rightSpaces;
  }
}
