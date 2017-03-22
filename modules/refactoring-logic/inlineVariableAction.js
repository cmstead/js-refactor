'use strict';

var j = require('jfp');

function inlineVariableAction(
    sourceUtils) {

    var defaultBounds = {
        start: [-1, 0],
        end: [0, 0]
    };

    function isValueInScope(scopeBounds, valueCoords) {
        var cleanBounds = j.eitherObjectInstance(defaultBounds)(scopeBounds);

        var scopeStart = cleanBounds.start[0];
        var scopeEnd = cleanBounds.end[0];
        var valueStart = valueCoords.start[0];

        return j.between(scopeStart, scopeEnd)(valueStart);
    }

    function isAssigned(selectedLine) {
        var pattern = /(var|let|const)\s*(\w|\d)+\s*\=\s*[^\s]+/i;
        return selectedLine.match(pattern) !== null;
    }

    function getVarInfo(value) {
        var varTokens = value.split(/\s*\=\s*/);

        var varName = varTokens[0].trim().split(/\s+/).pop();
        var varValue = varTokens[1].trim().replace(/([^\;]+)\;?$/, '$1');

        return {
            name: varName,
            value: varValue
        };
    }

    function getReplacementSource(selection, bounds, lines) {
        var varInfo = getVarInfo(selection);

        var replacementPattern = new RegExp(varInfo.name, 'g');
        var scopeSource = sourceUtils.getScopeLines(lines, bounds).join('\n');

        return scopeSource.replace(selection, '').replace(replacementPattern, varInfo.value);
    }

    function getWhitespaceOffset(selection) {
        var adjustedSelection = selection.replace(/^\s*/, '');

        return selection.length - adjustedSelection.length;
    }

    return {
        getReplacementSource: getReplacementSource,
        getWhitespaceOffset: getWhitespaceOffset,
        isAssigned: isAssigned,
        isValueInScope: isValueInScope
    }

}

module.exports = inlineVariableAction;