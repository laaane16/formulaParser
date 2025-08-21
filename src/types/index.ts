import BinOperationNode from '../AST/BinOperationNode';
import BooleanNode from '../AST/BooleanNode';
import ExpressionNode from '../AST/ExpressionNode';
import FunctionNode from '../AST/FunctionNode';
import IfStatementNode from '../AST/IfStatementNode';
import LiteralNode from '../AST/LiteralNode';
import NumberNode from '../AST/NumberNode';
import ParenthesizedNode from '../AST/ParenthesizedNode';
import StatementsNode from '../AST/StatementsNode';
import UnarOperationNode from '../AST/UnarOperationNode';
import VariableNode from '../AST/VariableNode';
import { FORMATS } from '../constants/formats';

export type ObjectValues<T> = T extends object ? T[keyof T] : never;

export interface IVar {
  type: string;
  id?: string;
  [key: string]: unknown;
}
export interface BpiumValues {
  catalogId: string;
  recordDbId: number;
}

export type Variables = Record<string, IVar>;

export type INodeReturnType = [Set<string>, number?];

export interface StringifyArgs {
  node: ExpressionNode;
  format: (typeof FORMATS)[keyof typeof FORMATS];
  safe: boolean;
  values?: Record<string, unknown>;
  bpiumValues?: BpiumValues;
}

export type StringifyFn<N extends ExpressionNode> = (
  args: StringifyArgs & { node: N },
) => string | string[];

export interface GetReturnTypeArgs<N> {
  node: N;
  ctx?: ExpressionNode;
  position?: string;
}

export type GetReturnTypeFn<N extends ExpressionNode> = (
  args: GetReturnTypeArgs<N>,
) => INodeReturnType;

export type NodeStringifierMap = [
  [typeof StatementsNode, StringifyFn<StatementsNode>],
  [typeof NumberNode, StringifyFn<NumberNode>],
  [typeof LiteralNode, StringifyFn<LiteralNode>],
  [typeof BooleanNode, StringifyFn<BooleanNode>],
  [typeof VariableNode, StringifyFn<VariableNode>],
  [typeof ParenthesizedNode, StringifyFn<ParenthesizedNode>],
  [typeof UnarOperationNode, StringifyFn<UnarOperationNode>],
  [typeof BinOperationNode, StringifyFn<BinOperationNode>],
  [typeof IfStatementNode, StringifyFn<IfStatementNode>],
  [typeof FunctionNode, StringifyFn<FunctionNode>],
];

export type NodeTypesGettersMap = [
  [typeof NumberNode, GetReturnTypeFn<NumberNode>],
  [typeof LiteralNode, GetReturnTypeFn<LiteralNode>],
  [typeof BooleanNode, GetReturnTypeFn<BooleanNode>],
  [typeof VariableNode, GetReturnTypeFn<VariableNode>],
  [typeof ParenthesizedNode, GetReturnTypeFn<ParenthesizedNode>],
  [typeof UnarOperationNode, GetReturnTypeFn<UnarOperationNode>],
  [typeof BinOperationNode, GetReturnTypeFn<BinOperationNode>],
  [typeof IfStatementNode, GetReturnTypeFn<IfStatementNode>],
  [typeof FunctionNode, GetReturnTypeFn<FunctionNode>],
];
