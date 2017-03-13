'use strict';

var j = require('jfp');

function addExportAction(
    templateUtils,
    sourceUtils
) {
    var matchSource = sourceUtils.matchInSource;

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
    })

    function exportLocation(lines, exportType) {
        var lastLineIndex = j.lastIndexOf(lines);

        var exportLine = findExportExpression(patterns[exportType], lines, lastLineIndex);
        exportLine = exportLine < 0 ? lastLineIndex : exportLine;

        var exportLineEnd = lines[exportLine].length;
        var insertPoint = [exportLine + offset[exportType], exportLineEnd + 1];


        return { start: insertPoint, end: insertPoint };
    }

    function buildTemplateKey(searchType, lines) {
        var templatePrefix = 'addExport.';
        var exportType = 'newExport';

        if (searchType === 'object') {
            exportType = 'objectAddition';
        } else if (matchSource(patterns.single, lines)) {
            exportType = 'single';
        }

        return templatePrefix + exportType;
    }

    function getSearchType(lines) {
        return matchSource(patterns.object, lines) ? 'object' : 'single';
    }

    function getRefactorText(functionName, searchType, lines) {
        var templateKey = buildTemplateKey(searchType, lines);
        var exportTemplate = templateUtils.getTemplate(templateKey);
        var context = templateUtils.buildExtendedContext([functionName], { functionName: functionName });

        return templateUtils.fillTemplate(exportTemplate, context);
    }

    function cleanSelection(selection) {
        var cleanSelection = selection.filter(isNotEmptyOrWhitespace);
        var containsFunction = j.eitherString('')(cleanSelection[0]).match(/function/) !== null;

        return containsFunction ? cleanSelection : [j.eitherString('')(selection[0])];
    }

    function isNotEmptyOrWhitespace(value) {
        return value.trim() !== '';
    }

    return {
        buildTemplateKey: buildTemplateKey,
        cleanSelection: cleanSelection,
        exportLocation: exportLocation,
        getRefactorText: getRefactorText,
        getSearchType: getSearchType,
        hasExportExpression: j.partial(matchSource, patterns.single),
        hasExportObject: j.partial(matchSource, patterns.object)
    };

}

module.exports = addExportAction;