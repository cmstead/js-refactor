'use strict';

const esprima = require('esprima');

function parser(typeHelper) {
    
    function parseSourceLines(sourceLines) {
        return parse(sourceLines.join('\n'));
    }

    function parse(sourceText) {
        const options = {
            loc: true,
            jsx: true
        };
        
        try {
            return esprima.parseScript(sourceText, options);
        } catch (e) {
            return esprima.parseModule(sourceText, options);
        }
    }

    return {
        parse: typeHelper.enforce(
            'sourceText => ast', 
            parse),

        parseSourceLines: typeHelper.enforce(
            'sourceLines => ast',
            parseSourceLines)
    };
    
}

module.exports = parser;