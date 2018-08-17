function htmlToJs() {
    'use strict';

    let scriptTagPattern = /^\s*<\/?script[^>]*>\s*$/i;

    function getScriptLineBuilder() {
        let inScriptTags = false;

        return function (value) {
            const inScriptChangeState = scriptTagPattern.test(value);

            inScriptTags = inScriptChangeState ? !inScriptTags : inScriptTags;

            return (!inScriptTags || inScriptChangeState) ? '' : value;
        }
    }

    function convert(htmlSourceTokens) {
        return htmlSourceTokens.map(getScriptLineBuilder());
    }

    return {
        convert: convert
    };
}

module.exports = htmlToJs;