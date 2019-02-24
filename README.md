# Subpar.js

A subpar parser combinator library for JavaScript

## Usage

```js
const {Parser,str}=require("subparjs");
let firstParser=Parser(str("Elephants"),"El");
let debugThread=[];
let space=Parser(str(" "));
let be=Parser(str("are")).or(Parser(str("is")));
let opinion=Parser(space).then(be).then(space).then(Parser(str("great")).or(Parser(str("terrible")))).then(str("!"));
console.log(JSON.strify(firstParser.then(opinion).parse("Elephants are great!",debugThread)));
console.log(JSON.strify(debugThread));//Neatly formatted in postfix
```