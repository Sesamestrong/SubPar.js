var colors = require("colors/safe");
/**
 * Represents any parser.
 * @constructor
 * @param equality {function} - Consumes and parses an input - supposed to be the most basic of all operations
 * @param name {string} - The name of the parser, for debugging purposes - optional.
 */
function Parser(equality, name = "BasicParser") {
    let ret = {
        equality: equality,
        name: name
    };

    /**
     * Determines if a parser's return value is valid - true if valid, false if invalid, and null if nonexistent.
     * @param returnValue {Object} - The parser's return value.
     */
    function validateReturned(retValue) {
        return retValue && retValue.hasOwnProperty("consumed") && typeof (retValue.consumed) === "number";
    }

    /**
     * Parses an input and updates the info thread accordingly, returning either null or an object of shape {consumed,returned}.
     * @param input {string} - The input for the parser.
     * @param thread {array} - The thread to which to write.
     */
    ret.parse = (input, thread) => {
        let res = equality(input, thread);
        thread.push(name);
        return res;
    };

    /**
     * Combines itself with a given parser, defaulting to the first parser, but switching to the second if the first fails.
     * @param parser {Object} - The parser with which to combine.
     */
    ret.or = (parser) => Parser((input, thread) => {
        let first= ret.parse(input, thread);
        if(first){
            thread.push("");
            return first;
        }
        return parser.parse(input, thread)},"or");

    /**
     * Combines itself with a given parser in sequence.
     * @param {Object} - The parser with which to combine.
     */
    ret.then = (parser) => Parser((input, thread) => {

        let outputs = [];

        //Parse with each parser until one fails
        for (let i = 0; i < 2; i++) {
            let returned = [ret, parser][i].parse(input, thread);
            if (!validateReturned(returned)) return null;
            outputs[i] = {
                valid: validateReturned(returned),
                returned: returned.returned,
                consumed: returned.consumed
            };
            input = input.slice(returned.consumed);
        }

        //If both are valid, return the summed and concatenated consumed number and returned value
        return (outputs.reduce((i, e) => i.valid && e.valid)) ? {
            consumed: outputs.reduce((i, e) => i.consumed + e.consumed),
            returned: outputs.reduce((i, e) => [i.returned, e.returned])
        } : null;
    },"then");

    return ret;
}

/**
 * The simplest, string-based parser equality function checking for an exact match between a parameter string and the input's beginning.
 * @param i {string} The string for the input's beginning to match.
 */
function isEqualTo(i, quiet = false) {
    return str => {
        try {
                if(!str.startsWith(i)) throw ValueError;
            return {
                consumed: i.length,
                returned: quiet ? null : i
            };
        } catch (err) {
            return null;
        }
    };
}

let oneParser = Parser(isEqualTo("Andrew is cool!", false), "Coolness");
let nextParser = oneParser.then(Parser(isEqualTo(" Also, ", false), "Space")).then(Parser(isEqualTo("other people", false), "People")).then(Parser(isEqualTo(" are cool as well!"), "ShareCoolness").or(Parser(isEqualTo("!"),"!")));
let thread = [];
let parsed = (nextParser.parse("Andrew is cool! Also, other people are cool as well!", thread));
let counter = 0;
console.log("\n\n");
console.log(parsed.returned.map(i => colors[["red", "green"][counter++ % 2]](i)).join(""));
console.log(thread);
module.exports={Parser,isEqualTo};