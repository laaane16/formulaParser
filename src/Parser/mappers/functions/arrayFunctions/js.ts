import { ValidArrayFunctionsNamesWithExtra } from "./types";
import { IFormatterFunc } from "../types";
import { DATE_FORMAT } from "../../../../constants/date";

export const arrayFunctionsToJsMap: Record<
  ValidArrayFunctionsNamesWithExtra,
  IFormatterFunc
> = {
  INDEX: ([arr, idx]) => `(${idx} >= 0 ? (${arr}[${idx}] ?? null) : null)`,
  INDEXFORITEMS: ([arr, idx, attr]) => attr ?
  `(${idx} >= 0 && (${attr} === 'name' || ${attr} === 'id')? (${arr}[${idx}] ?? null)?.[${attr}] ?? null : null)`:
  `(${idx} >= 0 ? (${arr}[${idx}] ?? null)?.name ?? null: null)`,

  ID: ([arr]) => `(${arr}).map((i) => i.id)`,

  NAME: ([arr]) => `(${arr}).map((i) => i.name)`,

  COUNT: ([arr]) => `(${arr}).length`,

  UNIQUE: ([arr]) => `Array.from((${arr}).reduce((prev, i) => prev.add(i), new Set()))`,
  UNIQUEFORITEMS: ([arr, attr]) => attr ?
  `(((${attr}) === 'id' || (${attr}) === 'name') ? Array.from((${arr}).reduce((prev, i) => prev.add(i[${attr}]), new Set())) : null)`:
    `Array.from((${arr}).reduce((prev, i) => prev.add(i.name), new Set()))`,

  SLICE: ([arr, from, to]) => to ?
  `(((${from}) >= 0 && (${to}) >= 0) ? (${arr}).slice(${from}, ${to}) : null)`:
  `(((${from}) >= 0) ? (${arr}).slice(${from}): null)`,
  SLICEFORITEMS: ([arr, from, to, attr]) =>
  to
  ?
    (attr ?
      `(((${from}) >= 0 && (${to}) >= 0) ? (((${attr}) === 'id' || (${attr}) === 'name') ? (${arr}).map(i => i[${attr}]).slice(${from}, ${to}): null) : null)`:
      `(((${from}) >= 0 && (${to}) >= 0) ? (${arr}).map(i => i.name).slice(${from}, ${to}) : null)`)
  :
    (attr ?
      `((${from}) >= 0 ? (((${attr}) === 'id' || (${attr}) === 'name') ? (${arr}).map(i => i[${attr}]).slice(${from}): null): null)`:
      `((${from}) >= 0 ? (${arr}).map(i => i.name).slice(${from}): null)`
    )
  ,

  FIND: ([arr, value]) => `((${arr}).find(i => i === (${value})) ?? null)`,
  FINDFORITEMS: ([arr, value, attr]) =>
    attr ?
    `(((${attr}) === 'id' || (${attr}) === 'name') ? ((${arr}).find(i => i[${attr}] === (${value}))?.[${attr}] ?? null): null)`:
    `((${arr}).find(i => i.name === (${value}))?.name ?? null)`,

  FILTER: ([arr, value]) => `(${arr}).filter(i => i !== (${value}))`,
  FILTERFORITEMS: ([arr, value, attr]) =>
    attr ?
    `(((${attr}) === 'id' || (${attr}) === 'name') ? (${arr}).map(i => i[${attr}]).filter(i => i !== (${value})) : null)`:
    `(${arr}).map(i => i.name).filter(i => i !== (${value}))`,

  SORT: ([arr, mode]) =>
    mode ?
    `((${mode}) === -1 ? [...(${arr})].sort((a, b) => b.localeCompare(a)) : [...(${arr})].sort((a, b) => a.localeCompare(b)))`:
    `[...(${arr})].sort((a, b) => a.localeCompare(b))`,
  SORTNUMBERS: ([arr, mode]) =>
    mode ?
    `((${mode}) === -1 ? [...(${arr})].sort((a, b) => b - a) : [...(${arr})].sort((a, b) => a - b))`:
    `[...(${arr})].sort((a, b) => a - b)`,
  SORTDATES: ([arr, mode]) =>
    mode ?
    `((${mode}) === -1 ? [...(${arr})].sort((a, b) => DateTime.fromFormat(b, ${DATE_FORMAT}).toMillis() - DateTime.fromFormat(a, ${DATE_FORMAT}).toMillis()) : [...(${arr})].sort((a, b) => DateTime.fromFormat(a, ${DATE_FORMAT}).toMillis() - DateTime.fromFormat(b, ${DATE_FORMAT}).toMillis()))`:
    `[...(${arr})].sort((a, b) => DateTime.fromFormat(a, ${DATE_FORMAT}).toMillis() - DateTime.fromFormat(b, ${DATE_FORMAT}).toMillis())`,
  SORTFORITEMS: ([arr, mode, attr]) =>
    mode ?
      (attr ?
        `(((${attr}) === 'id' || (${attr}) === 'name') ? ((${mode}) === -1 ? (${arr}).map(i => i[${attr}]).sort((a, b) => b.localeCompare(a)) : (${arr}).map(i => i[${attr}]).sort((a, b) => a.localeCompare(b))) : null)`:
        `((${mode}) === -1 ? (${arr}).map(i => i.name).sort((a, b) => b.localeCompare(a)) : (${arr}).map(i => i.name).sort((a, b) => a.localeCompare(b)))`
      )
    :
      (attr ?
        `(((${attr}) === 'id' || (${attr}) === 'name') ? (${arr}).map(i => i[${attr}]).sort((a, b) => a.localeCompare(b)) : null)`:
        `(${arr}).map(i => i.name).sort((a, b) => a.localeCompare(b))`
      ),

    // FLATTEN: ([arr]) => `(function flatten(array) {return array.reduce((acc, val) =>  Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), [])})(${arr})`,
    // FLATTENFORITEMS: ([arr, attr]) =>
    //   attr ?
    //     `(((${attr}) === 'id' || (${attr}) === 'name') ? (function flatten(array, attr) {return array.map(i => i?.[attr] ?? i).reduce((acc, val) =>  Array.isArray(val) ? acc.concat(flatten(val, attr)) : acc.concat(val), [])})(${arr}, ${attr}) : null)`:
    //     `(function flatten(array) {return array.map(i => i?.name ?? i).reduce((acc, val) =>  Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), [])})(${arr})`
  }
