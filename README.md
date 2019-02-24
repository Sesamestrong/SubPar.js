# js

A subpar parser combinator library for JavaScript

## Usage

```js
const {Parser,string}=require("subparjs");
let firstParser=Subpar.Parser(string("Elephants"),"El");
let debugThread=[];
let space=string(" ");
let be=Parser(string("are")).or(Subpar.Parser(Subpar.isEqualTo("is")));
let opinion=Parser(space).then(be).then(space).then(Parser(string("great")).or(Parser(string("terrible)))).then(string("!"));
console.log(JSON.stringify(firstParser.then(opinion).parse("Elephants are great!)));
console.log(JSON.stringify(debugThread));//Neatly formatted in postfix
```