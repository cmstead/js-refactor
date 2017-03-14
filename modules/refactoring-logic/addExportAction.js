'use strict';

var j = require('jfp');

function addExportAction(
    exportHelper,
    extensionHelper,
    functionUtils,
    templateUtils) {

    function getRefactorData(rawSelection, lines) {
        var functionName = getFunctionName(rawSelection);
        var searchType = exportHelper.getSearchType(lines);

        return {
            functionName: functionName,
            coords: exportHelper.exportLocation(lines, searchType),
            text: getRefactorText(functionName, searchType, lines)
        }
    }

    function getFunctionName(rawSelection) {
        var selection = j.eitherArray([])(rawSelection);
        var cleanedSelection = cleanSelection(selection);

        return functionUtils.getFunctionName(cleanedSelection[0]);
    }

    function getRefactorText(functionName, searchType, lines) {
        var templateKey = buildTemplateKey(searchType, lines);
        var exportTemplate = templateUtils.getTemplate(templateKey);
        var context = templateUtils.buildExtendedContext([functionName], { functionName: functionName });

        return templateUtils.fillTemplate(exportTemplate, context);
    }

    function cleanSelection(selection) {
        var isNotEmptyOrWhitespace = j.invert(extensionHelper.isEmptyOrWhitespace);

        var cleanedSelection = selection.filter(isNotEmptyOrWhitespace);
        var containsFunction = j.eitherString('')(cleanSelection[0]).match(/function/) !== null;

        return containsFunction ? cleanedSelection : [j.eitherString('')(selection[0])];
    }

    function buildTemplateKey(searchType, lines) {
        var templatePrefix = 'addExport.';
        var exportType = 'newExport';

        if (searchType === 'object') {
            exportType = 'objectAddition';
        } else if (exportHelper.hasSingleLineExport(lines)) {
            exportType = 'single';
        }

        return templatePrefix + exportType;
    }

    return {
        getRefactorData: getRefactorData
    };

}

module.exports = addExportAction;