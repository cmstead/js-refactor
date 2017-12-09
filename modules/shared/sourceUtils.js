'use strict';

function sourceUtils() {

    function matchInLine(regex, line) {
        return typeof line === 'string' && line.match(regex) !== null;
    }

    function matchInSource(regex, lines) {
        return matchInLine(regex, lines.join(''))
    }

    function getScopeLines(lines, bounds) {
        var scopeLines = null;

        if (bounds.end[0] === lines.length - 1) {
            scopeLines = lines.slice(bounds.start[0]);
        } else {
            scopeLines = lines.slice(bounds.start[0], bounds.end[0] + 1);
        }

        var lastIndex = scopeLines.length - 1;

        scopeLines[0] = scopeLines[0].substr(bounds.start[1]);
        scopeLines[lastIndex] = scopeLines[lastIndex].substr(0, bounds.end[1] + 1);

        return scopeLines;
    }
    
    return {
        getScopeLines: getScopeLines,
        matchInLine: matchInLine,
        matchInSource: matchInSource
    }
}

module.exports = sourceUtils;