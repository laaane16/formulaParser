import ExpressionNode from '../../AST/ExpressionNode';
import { NodeTypesValues } from '../../constants/nodeTypes';
import { ValidDateFunctionsNames } from './dateFunctions/types';
import { ValidLogicFunctionsNames } from './logicFunctions/types';
import { ValidNumberFunctionsNames } from './numberFunctions/types';
import { ValidTextFunctionsNames } from './textFunctions/types';

export interface IArg {
  // name: string, I don't think it's necessary
  // default: boolean, need to think
  type: NodeTypesValues | NodeTypesValues[];

  // only for last params
  required?: boolean;
  many?: boolean;
}

export interface IFunction {
  args: IArg[];
  returnType: NodeTypesValues; // ?maybe func
  jsFn: (args: string[]) => string;
  sqlFn: (args: string[]) => string;
}

export type ValidFunctionsNames =
  | ValidTextFunctionsNames
  | ValidNumberFunctionsNames;
// | ValidLogicFunctionsNames
// | ValidDateFunctionsNames

export type VariableFunction = IFunction[];
