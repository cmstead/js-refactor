'use strict';

function parser(
    espree,
    htmlToJs,
    logger,
    tsEsTree,
    typeHelper,
    vsCodeHelperFactory
) {

    const shebangPattern = /^#!\/usr\/bin\/env node\s*$/i;

    function isHtmlSource(fileExtension, languageId) {
        return languageId === 'html'
            || languageId === 'vue'
            || fileExtension.toLowerCase() === 'html'
            || fileExtension.toLowerCase() === 'vue';
    }

    function stripShebang(sourceLines) {
        return sourceLines.map(function (line) {
            return shebangPattern.test(line) ? '' : line;
        });
    }

    function buildParseableSource(sourceLines) {
        const vsCodeHelper = vsCodeHelperFactory();

        const fileExtension = vsCodeHelper.getFileExtension();
        const languageId = vsCodeHelper.getLanguageId();

        return isHtmlSource(fileExtension, languageId)
            ? htmlToJs.convert(sourceLines)
            : stripShebang(sourceLines);
    }

    function parseSourceLines(sourceLines) {
        const parseableSource = buildParseableSource(sourceLines);

        return parse(parseableSource.join('\n'));
    }

    function tryParseSourceLines(sourceLines) {
        return parseSourceLines(sourceLines);
    }

    function getTsEsTreeOptions(languageId) {
        return {
            range: false,
            loc: true,
            tokens: false,
            comment: false,
            jsx: /react/.test(languageId),
            useJSXTextNode: false
        };
    }

    function getEspreeOptions() {
        return {
            loc: true,
            ecmaVersion: 10,
            sourceType: 'script'
        };
    }

    function getEspreeParser() {
        return {
            parse: function (sourceText, options) {
                try {
                    return espree.parse(sourceText, options);
                } catch (e) {
                    options.sourceType = 'module';
                    return espree.parse(sourceText, options);
                }
            }

        };
    }

    function getParserOptions(languageId) {
        return requiresTsEsTree(languageId)
            ? getTsEsTreeOptions(languageId)
            : getEspreeOptions();
    }

    function requiresTsEsTree(languageId) {
        return /typescript|react/.test(languageId)
    }

    function getParser(languageId) {
        return requiresTsEsTree(languageId)
            ? tsEsTree
            : getEspreeParser()
    }

    function getLanguageId() {
        const activeEditor = vsCodeHelperFactory().getActiveEditor();

        return activeEditor._documentData._languageId;
    }

    function parse(sourceText) {
        const languageId = getLanguageId();
        const parserOptions = getParserOptions(languageId);
        const parser = getParser(languageId);

        try {
            return parser.parse(sourceText, parserOptions);
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