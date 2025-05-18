import { NodeTypesValues } from '../../../constants/nodeTypes';
import { ValidDateFunctionsNames } from './dateFunctions/types';
import { ValidNumberFunctionsNames } from './numberFunctions/types';
import { ValidTextFunctionsNames } from './textFunctions/types';

export interface IArg {
  // name: string, I don't think it's necessary
  // default: boolean, need to think
  // type: NodeTypesValues[] | NodeTypesValues;
  type: NodeTypesValues[];

  // only for last params
  required?: boolean;
  many?: boolean;
}

type IFormatterFunc = (args: string[]) => string;

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
  | ValidNumberFunctionsNames;
// | ValidDateFunctionsNames;

export type VariableFunction = IFunction[];

export function isSafeFunction(func: IFunction): func is SafeFunction {
  return 'jsSafeFn' in func && 'sqlSafeFn' in func;
}
