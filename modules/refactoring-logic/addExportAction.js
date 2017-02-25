'use strict';

var j = require('jfp');

function addExportAction() {
    var offset = {
        'single': 1,
        'object': 0
    };

    var patterns = {
        object: /module\.exports\s*=\s*\{/,
        single: /module\.exports/
    };

    function isMatch(regex, line) {
        return typeof line === 'string' && line.match(regex) !== null;
    }

    function matchSource(regex, lines) {
        return isMatch(regex, lines.join(''))
    }

    function findExportExpression(recur, regex, lines, index) {
        return index < 0 || isMatch(regex, lines[index]) ? index : recur(regex, lines, index - 1);
    }

    function exportLocation(lines, exportType) {
        var lastLineIndex = j.lastIndex(lines);

        var exportLine = j.recur(findExportExpression, patterns[exportType], lines, lastLineIndex);
        exportLine = exportLine < 0 ? lastLineIndex : exportLine;

        var exportLineEnd = lines[exportLine].length;
        var insertPoint = [exportLine + offset[exportType], exportLineEnd + 1];


        return { start: insertPoint, end: insertPoint };
    }

    return {
        exportLocation: exportLocation,
        hasExportExpression: j.partial(matchSource, patterns.single),
        hasExportObject: j.partial(matchSource, patterns.object)
    };

}

module.exports = addExportAction;