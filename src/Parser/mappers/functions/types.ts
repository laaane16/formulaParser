import FunctionNode from '../../../AST/FunctionNode';
import { NodeTypesValues } from '../../../constants/nodeTypes';
import { BpiumValues } from '../../../types';
import { ValidBpiumFunctionsNames } from './bpiumFunctions/types';
import { ValidDateFunctionsNames } from './dateFunctions/types';
import { ValidLogicFunctionsNames } from './logicFunctions/types';
import { ValidNumberFunctionsNames } from './numberFunctions/types';
import { ValidTextFunctionsNames } from './textFunctions/types';

export interface IArg {
  type: NodeTypesValues[];

  // only for last params
  required?: boolean;
  many?: boolean;
}

export type IFormatterFunc = (args: string[], bpium?: BpiumValues) => string;

interface BaseFunction {
  args: IArg[];
  returnType: NodeTypesValues[];
  jsFn: IFormatterFunc;
  sqlFn: IFormatterFunc;
  specialWorkWithNull?: boolean;
}
interface SafeFunction extends BaseFunction {
  jsSafeFn: IFormatterFunc;
  sqlSafeFn: IFormatterFunc;
}

export type IFunction = SafeFunction | BaseFunction;

export type ValidFunctionsNames =
  | ValidTextFunctionsNames
  | ValidNumberFunctionsNames
  | ValidDateFunctionsNames
  | ValidLogicFunctionsNames
  | ValidBpiumFunctionsNames;

export type VariableFunction = IFunction[];

export function isSafeFunction(func: IFunction): func is SafeFunction {
  return 'jsSafeFn' in func && 'sqlSafeFn' in func;
}
