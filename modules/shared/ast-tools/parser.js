'use strict';

const esprima = require('esprima');

function parser() {
    
    function parseSourceLines(sourceLines) {
        return parse(sourceLines.join('\n'));
    }

    function parse(source) {
        const options = {
            loc: true,
            jsx: true
        };
        
        try {
            return esprima.parseScript(source, options);
        } catch (e) {
            return esprima.parseModule(source, options);
        }
    }

    return {
        parse: parse,
        parseSourceLines: parseSourceLines
    };
    
}

module.exports = parser;