# Subpar.js

A subpar parser combinator library for JavaScript

## Usage

```js
const {Parser,str}=require("subparjs");
let firstParser=Parser(str("Elephants"));
let debugThread=[];
let space=Parser(str(" "));
let be=Parser(str("are")).or(Parser(str("is")));
let opinion=space.then(be).then(space).then(Parser(str("great")).or(Parser(str("terrible")))).then(Parser(str("!")));
console.log(JSON.stringify(firstParser.then(opinion).parse("Elephants are great!",debugThread)));
console.log(JSON.stringify(debugThread));//Neatly formatted in postfix
```