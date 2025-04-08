# 🧠 Formulex (Formula + Expression + Exec)

**Formulex** is a lightweight library that parses user-defined formulas into SQL expressions or JavaScript functions — and optionally parses SQL back to formulas.

Whether you're building a low-code platform, dynamic reporting engine, or a rule-based system, Formula2SQL helps you transform formulas into executable logic.

---

## 🚀 Features

- ✅ Convert formulas like `price * quantity + tax` into SQL expressions
- ✅ Generate executable JavaScript functions from formulas
- ✅ Parse formulas into abstract syntax trees (AST)
- ✅ Customizable operators and function support
- ✅ Lightweight, no runtime dependencies

---

## 📦 Installation ( TODO: update to real data )

```bash
npm install formulex
```

## 📗 Usage ( TODO: update to real data )

```js
import { toSQL, toJS } from 'Formulex';

const formula = 'price * quantity + tax';

const sql = toSQL(formula);
// => ("price" * "quantity") + "tax"

const js = toJS(formula);
// => (data) => (data.price * data.quantity) + data.tax

const result = js({ price: 10, quantity: 3, tax: 2 });
// => 32

```

## 🛠 API ( TODO: update to real data )

`toSQL(formula: string | AST): string`
Converts a formula string or AST to a valid SQL expression.

`toJS(formula: string | AST): (data: Record<string, any>) => any`
Returns a JavaScript function that can be executed with a data object.

`parseFormula(formula: string): AST`
Parses the formula into an abstract syntax tree.

## 🧮 Supported Operators ( TODO: update to real data )

| Type         | Operators                          | Example                        |
|--------------|------------------------------------|--------------------------------|
| Arithmetic   | `+`, `-`, `*`, `/`, `%`            | `price * quantity + tax`      |
| Comparison   | `==`, `!=`, `>`, `<`, `>=`, `<=`   | `amount > 100`                |
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