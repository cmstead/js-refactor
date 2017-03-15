'use strict';

var esprima = require('esprima');

function sourceUtils(
    functionScopeUtils,
    utilities) {

    function getSourceTokens(lines) {
        var src = lines.join('\n');
        return esprima.tokenize(src, { loc: true });
    }

    function scopeDataFactory(lines, selectionData) {
        var tokens = getSourceTokens(lines);

        var scopeIndices = functionScopeUtils.findScopeIndices(tokens, selectionData.selectionCoords);
        var scopeBounds = functionScopeUtils.buildBoundsObject(tokens, scopeIndices.top, scopeIndices.bottom);

        return {
            tokens: tokens,
            scopeIndices: scopeIndices,
            scopeBounds: scopeBounds
        };
    }

    function matchInLine(regex, line) {
        return typeof line === 'string' && line.match(regex) !== null;
    }

    function matchInSource(regex, lines) {
        return matchInLine(regex, lines.join(''))
    }

    function buildEsprimaCoords(coords) {
        return {
            start: [coords.start.line, coords.start.column],
            end: [coords.end.line, coords.end.column],
        };
    }

    return {
        buildEsprimaCoords: buildEsprimaCoords,
        matchInLine: matchInLine,
        matchInSource: matchInSource,
        scopeDataFactory: scopeDataFactory
    }
}

module.exports = sourceUtils;