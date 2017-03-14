'use strict';

var j = require('jfp');

function exportHelper(
    sourceUtils) {

    var offset = {
        'single': 1,
        'object': 0
    };

    var patterns = {
        object: /module\.exports\s*=\s*\{/,
        single: /module\.exports/
    };

    var findExportExpression = j.recur(function (recur, regex, lines, index) {
        var searchComplete = index < 0 || sourceUtils.matchInLine(regex, lines[index]);

        return searchComplete ? index : recur(regex, lines, index - 1);
    });

    function exportLocation(lines, exportType) {
        var insertPoint = getInsertPoint(lines, exportType);

        return {
            start: insertPoint,
            end: insertPoint
        };
    }

    function getInsertPoint (lines, exportType){
        var exportLine = getExportLine(lines, exportType);
        var exportLineEnd = lines[exportLine].length;

        return [
            exportLine + offset[exportType],
            exportLineEnd + 1
        ];
    }

    function getExportLine(lines, exportType) {
        var lastLineIndex = j.lastIndexOf(lines);
        var exportLine = findExportExpression(patterns[exportType], lines, lastLineIndex);

        return exportLine = exportLine < 0 ? lastLineIndex : exportLine;
    }

    function hasSingleLineExport(lines) {
        return sourceUtils.matchInSource(patterns.single, lines);
    }

    function hasObjectExport(lines) {
        return sourceUtils.matchInSource(patterns.object, lines);
    }

    function getSearchType(lines) {
        return hasObjectExport(lines) ? 'object' : 'single';
    }

    return {
        exportLocation: exportLocation,
        getSearchType: getSearchType,
        hasSingleLineExport: hasSingleLineExport
    };

}

module.exports = exportHelper;