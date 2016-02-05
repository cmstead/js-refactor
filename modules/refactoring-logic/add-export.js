'use strict';

var j = require('jfp');
var patterns = {
    object: /module\.exports\s*=\s*\{/,
    single: /module\.exports/
};
var anyMatch = /module\.exports(\.[^\s]+)?/,
    objectMatch = /module\.exports\s*=\s*\{/;

function isMatch (regex, line){
    return line.match(regex) !== null;
}

function matchSource (regex, lines){
    return isMatch(regex, lines.join(''))
}

function findExportExpression (recur, regex, lines, index) {
    return isMatch(regex, lines[index]) ? index : recur(regex, lines, index - 1);
}

function exportLocation (lines, exportType){
    var exportLine = j.recur(findExportExpression, patterns[exportType], lines, j.lastIndex(lines)),
        exportLineEnd = lines[exportLine].length,
        insertPoint = [exportLine + 1, exportLineEnd + 1];
    
    return { start: insertPoint, end: insertPoint };
}

module.exports = {
    exportLocation: exportLocation,
    hasExportExpression: j.partial(matchSource, patterns.single),
    hasExportObject: j.partial(matchSource, patterns.object)
};