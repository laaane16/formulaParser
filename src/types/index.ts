export type ObjectValues<T> = T extends object ? T[keyof T] : never;

export interface IVar {
  type: string;
  id?: string;
  [key: string]: unknown;
}
