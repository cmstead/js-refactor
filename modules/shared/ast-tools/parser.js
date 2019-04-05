'use strict';

function parser(htmlToJs, espree, typeHelper, logger) {

    const scriptPattern = /<script/i;
    const shebangPattern = /^\#\!\/usr\/bin\/env node/i;

    function isHtmlSource(sourceLines) {
        return sourceLines.filter(value => scriptPattern.test(value)).length > 0;
    }

    function stripShebang(sourceLines) {
        return sourceLines.map(function (line) {
            return shebangPattern.test(line) ? '' : line;
        });
    }

    function buildParseableSource(sourceLines) {
        return isHtmlSource(sourceLines)
            ? htmlToJs.convert(sourceLines)
            : stripShebang(sourceLines);
    }

    function parseSourceLines(sourceLines) {
        const parseableSource = buildParseableSource(sourceLines);

        return parse(parseableSource.join('\n'));
    }

    function tryParseSourceLines(sourceLines) {
        const parseableSource = buildParseableSource(sourceLines);

        return tryParse(parseableSource.join('\n'));
    }

    function tryParseSource(sourceText, options) {
        return espree.parse(sourceText, options);
    }

    function tryParse(sourceText) {
        const options = {
            loc: true,
            ecmaVersion: 10,
            ecmaFeatures: {
                jsx: true
            }
        };

        return tryParseSource(sourceText, options);
    }

    function parse(sourceText) {
        try {
            return tryParse(sourceText);
        } catch (e) {
            console.log(e.message);
            logger.error(`Unable to parse source code. Parser error: ${e.message}`);
        }
    }

    return {
        parse: typeHelper.enforce(
            'sourceText => ast',
            parse),

        parseSourceLines: typeHelper.enforce(
            'sourceLines => ast',
            parseSourceLines),

        tryParseSourceLines: typeHelper.enforce(
            'sourceLines => ast',
            tryParseSourceLines)
    };

}

module.exports = parser;