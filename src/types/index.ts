export type ObjectValues<T> = T extends object ? T[keyof T] : never;
