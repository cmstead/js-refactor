'use strict';

function getCoordinates (selection) {
    return {
        startLine: selection._start._line,
        endLine: selection._end._line,
        startChar: selection._start._character,
        endChar: selection._end._character
    };
}

function multiLineSelect (contentList, selection) {
    var coords = getCoordinates(selection),
        lines = contentList.slice(coords.startLine, coords.endLine + 1);
    
    lines[0] = lines[0].slice(coords.startChar);
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, coords.endChar);
    
    return lines;
}

function singleLineSelect (contentList, selection) {
    var coords = getCoordinates(selection),
        line = contentList[coords.startLine];
        
    return [line.substr(coords.startChar, coords.endChar - coords.startChar)];
}

function noSelection () {
    return null;
}

function selectorFactory (selection) {
    var coords = getCoordinates(selection),
        selector = coords.startChar === coords.endChar ? noSelection : singleLineSelect;

    return coords.startLine === coords.endLine ? selector : multiLineSelect;
}

module.exports = selectorFactory;