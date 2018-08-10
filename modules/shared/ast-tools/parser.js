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

        let ast = null;

        try {
            ast = esprima.parseScript(sourceText, options);
        } catch (e) {
            ast =  esprima.parseModule(sourceText, options);
        }

        return ast;
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