# 🧠 Formulex (Formula + Expression + Exec)

**Formulex** is a lightweight and extensible library that parses user-defined formulas into SQL expressions or executable JavaScript functions — with built-in AST support.

Perfect for low-code platforms, dashboards, calculated fields, and dynamic logic engines.

> 🚧 This project is a work in progress. Expect bugs and frequent updates.

---

## 🚀 Features

- ✅ Convert formulas like {Field 1} + {Field 2} * 2 into SQL
- ✅ Generate executable JavaScript functions from formulas
- ✅ Parse formulas into abstract syntax trees (AST)
- ✅ Support for custom field mappings and types
- ✅ Zero runtime dependencies

---

## 📦 Installation

```bash
npm install formulex
```

## 📗 Usage
```js
import { Parser } from 'formulex';

const fields = [
  { id: '1', name: 'Field 1', type: 'number' },
  { id: '2', name: 'Field 2', type: 'number' },
];

const expression = '{Field_1} + {Field_2} * 2';

const parser = new Parser(expression, fields);

const sql = parser.toSqlWithVariables()
// => (123 + (321 * 2))

const jsFormula = parser.toJs();
// => VARIABLES["1"] + (VARIABLES["2"] * 2)

const result = parser.runJs(jsFormula, { 1: 10, 2: 5 });
// => 20

```

## 🛠 API

> new Parser(expression: string, fields?: IField[], fieldAttribute?: keyof IField)
Creates a new parser instance.

> expression: your input formula (e.g. {Field 1} + 10)

> fields: optional array of fields (with id, name, type)

> fieldAttribute: defines how variables are resolved (id, name, etc.)

> parser.toSqlWithVariables(): string
Converts the formula into a valid SQL expression string.

> parser.toJs(): string
Returns a JS-compatible string (to be evaluated with new Function).

> parser.runJs(js: string, values: Record<string, unknown>): unknown
Executes a previously generated JS string with given values.

> parser.getAst(): StatementsNode
Returns the abstract syntax tree (AST) of the formula.

> parser.walkAst(visitor: (node: Node) => void): void
Traverses all nodes of the AST in depth-first order and invokes the visitor callback on each node.
Useful for custom validation, metadata extraction, or modifying behavior.
Supported node types: Number, Variable, BinaryExpression, CallExpression, UnaryExpression, etc.

> parser.getVariables(): string[]
Returns all unique variable names used in the formula.

## 🧮 Supported Operators

| Type         | Operators                          | Example                        |
|--------------|------------------------------------|--------------------------------|
| Arithmetic   | `+`, `-`, `*`, `/`, `%`            | `{price} * {quantity} + 1`      |
| Comparison   | `==`, `!=`, `>`, `<`, `>=`, `<=`   | `{amount} > 100`                |
| Logical      | `AND`, `OR`, `NOT`                 | `active == true AND score > 5`|
| Grouping     | Parentheses `( )`                  | `(a + b) * c`                  |
| Variables    | Dynamic keys from your data        | `user.age`, `order.total`     |


## 🧩 Use Cases

- Dynamic calculated fields in dashboards or CRMs

- Low-code formula engines

- Report builders

- Pricing rules and financial modeling

- Serverless logic execution

## 📄 License
MIT
