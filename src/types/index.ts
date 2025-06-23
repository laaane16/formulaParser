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
