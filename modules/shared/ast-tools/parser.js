'use strict';

const esprima = require('esprima');

function parser(htmlToJs, typeHelper, logger) {
    
    const scriptPattern = /<script/i;

    function isHtmlSource (sourceLines) {
        return sourceLines.filter(value => scriptPattern.test(value)).length > 0;
    }

    function parseSourceLines(sourceLines) {
        const parseableSource = isHtmlSource(sourceLines)
            ? htmlToJs.convert(sourceLines)
            : sourceLines;

        return parse(parseableSource.join('\n'));
    }

    function tryParseSource(sourceText, options) {
        let ast = null;

        try {
            ast = esprima.parseScript(sourceText, options);
        } catch (e) {
            ast =  esprima.parseModule(sourceText, options);
        }

        return ast
    }

    function parse(sourceText) {
        const options = {
            loc: true,
            jsx: true
        };

        try{
            return tryParseSource(sourceText, options);
        } catch (e) {
            logger.error(`Unable to parse source code. Parser error: ${e.message}`);
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