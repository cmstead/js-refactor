'use strict';

var anyMatch = /module\.exports(\.[^\s]+)?/,
    objectMatch = /module\.exports\s*=\s*\{/;

function getMatch (line, pattern){
    return line.match(pattern);
}

function findExportLine (lines){
    var lastIndex = lines.length - 1,
        index = lastIndex,
        
        matchIndex = -1,
        lastMatch = null,
        currentMatch,
        pattern;
    
    while (index > 0) {
        pattern = matchIndex === -1 ? anyMatch : objectMatch;
        currentMatch = getMatch(lines[index], pattern);

        if (matchIndex === -1 && currentMatch !== null) {
            matchIndex = index;
            lastMatch = currentMatch;
        } else if (currentMatch !== null) {
            matchIndex = index;
            lastMatch = currentMatch;
            break;
        }
        
        index--;
    }

    return lastMatch === null ? lastIndex : matchIndex;
}

function exportLocation (lines){
    var exportLine = findExportLine(lines),
        exportLineEnd = lines[exportLine].length,
        insertPoint = [exportLine + 1, exportLineEnd + 1];
    
    return { start: insertPoint, end: insertPoint };
}

function hasExportObject (lines) {
    var source = lines.join('');
    return source.match(/module.exports\s?=\s?\{/) !== null;
}

module.exports = {
    exportLocation: exportLocation,
    hasExportObject: hasExportObject
};