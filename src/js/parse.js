class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    constructor(input) {
        this.input = input;
        this.pos = 0;
    }

    nextToken() {
        while (this.pos < this.input.length && this.input[this.pos] === ' ') {
            this.pos++;
        }

        if (this.pos >= this.input.length) {
            return new Token('EOF', null);
        }

        let match = this.input[this.pos];
        this.pos++;

        // Operators
        if (match === '-' || match === '!' || match === ',' || match === '&') {
            return new Token(match, match);
        }

        // Numbers
        else if (/\d/.test(match)) {
            while (this.pos < this.input.length && /\d/.test(this.input[this.pos])) {
                match += this.input[this.pos];
                this.pos++;
            }
            return new Token('NUMBER', parseInt(match));
        }

        // Tags
        else if (/[a-zA-Z]/.test(match)) {
            while (this.pos < this.input.length && /[a-zA-Z0-9_-]/.test(this.input[this.pos])) {
                match += this.input[this.pos];
                this.pos++;
            }
            return new Token('TAG', match.toLowerCase());
        } else {
            throw new Error(`Unexpected character: ${match}`);
        }
    }
}

class Parser {
    constructor(lexer, tagMap, ids) {
        this.lexer = lexer;
        this.currentToken = this.lexer.nextToken();
        this.tagMap = tagMap;
        this.ids = ids;
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.nextToken();
        } else {
            throw new Error(`Token of type ${tokenType} expected, got ${this.currentToken.type}`);
        }
    }

    parse() {
        return this.andExpression();
    }

    andExpression() {
        let result = this.orExpression();
        while (this.currentToken.type === '&') {
            this.eat('&');
            let term = this.orExpression();
            result = result.filter(value => term.includes(value));
        }
        return result;
    }

    orExpression() {
        let result = this.baseExpression();
        while (this.currentToken.type === ',') {
            this.eat(',');
            result = result.concat(this.baseExpression());
        }
        return result;
    }

    baseExpression() {
        if (this.currentToken.type === '!') {
            this.eat('!');
            let factor = this.baseExpression();
            let result = [];
            for (let id of this.ids) {
                if (!factor.includes(id)) {
                    result.push(id);
                }
            }
            return result;
        } else {
            return this.value();
        }
    }

    value() {
        if (this.currentToken.type === 'NUMBER') {
            let start = this.currentToken.value;
            this.eat('NUMBER');
            if (this.currentToken.type === '-') {
                this.eat('-');
                if (this.currentToken.type === 'NUMBER') {
                    let end = this.currentToken.value;
                    this.eat('NUMBER');
                    return this.ids.filter(id => {
                        const numPart = parseInt(id);
                        return numPart >= start && numPart <= end;
                    });
                } else {
                    const maxDex = Math.max(...this.ids.map(id => parseInt(id)));
                    return this.ids.filter(id => {
                        const numPart = parseInt(id);
                        return numPart >= start && numPart <= maxDex;
                    });
                }
            } else {
                //check
                return this.ids.filter(id => parseInt(id) === start);
            }
        } else if (this.currentToken.type === 'TAG') {
            const tagName = this.currentToken.value;
            this.eat('TAG');
            var numbers = this.tagMap[tagName];
            if (!numbers) {
                numbers = []
            }
            return numbers.slice();
        } else {
            throw new Error(`Unexpected token: ${this.currentToken.type}`);
        }
    }
}

function parse(input) {
    let lexer = new Lexer(input);
    let parser = new Parser(lexer, tagMap, ids);
    return parser.parse();
}

function natural_sort(l) {
    const convert = text => isNaN(text) ? text.toLowerCase() : parseInt(text);
    const alphanum_key = key => String(key).split(/(\d+)/).map(convert);
    return l.sort((a, b) => {
        const aKey = alphanum_key(a);
        const bKey = alphanum_key(b);
        for (let i = 0; i < aKey.length; i++) {
            if (aKey[i] < bKey[i]) return -1;
            if (aKey[i] > bKey[i]) return 1;
        }
        return 0;
    });
}

function condense(vals) {
    if (vals === null) {
        return "error";
    }
    vals = vals.map(val => parseInt(val));
    vals = natural_sort(Array.from(new Set(vals)));
    let groups = [];
    for (let i = 0, j = 0; i < vals.length; i++) {
        if (i === 0 || vals[i] - vals[i - 1] === 1) {
            if (!groups[j]) {
                groups[j] = [];
            }
            groups[j].push(vals[i]);
        } else {
            j++;
            groups[j] = [vals[i]];
        }
    }
    let tmp = groups.map(g => g.length === 1 ? String(g[0]) : `${g[0]}-${g[g.length - 1]}`);
    return tmp.join(",");
}
