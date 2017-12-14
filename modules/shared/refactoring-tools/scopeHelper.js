'use strict';

function scopeHelper(
    coordsHelper,
    logger,
    scopePathTools,
    scopePathHelper,
    typeHelper
) {

    function buildScopePathString(scopeNode, index) {
        return `${index}: ${scopeNode.type} - ${scopeNode.initialLine}`;
    }

    function getScopeSelectionOptions(scopePath, sourceLines) {
        return scopePathTools
            .getInitialLineData(scopePath, sourceLines)
            .map(buildScopePathString)
    }

    function getSelectedScopeIndex(selectedScopeOption) {
        return typeof selectedScopeOption === 'string'
            ? parseInt(selectedScopeOption.split(':')[0])
            : 0;
    }

    function getScopeQuickPick(scopePath, sourceLines, callback) {
        const items = getScopeSelectionOptions(scopePath, sourceLines);
        const quickPickOptions = {
            message: 'Select method extraction scope:'
        }

        logger.quickPick(items, quickPickOptions, callback);
    }

    function getScopePath(coords, ast) {
        const astCoords = coordsHelper.coordsFromEditorToAst(coords);

        return scopePathHelper.buildScopePath(astCoords, ast);
    }

    return {
        getScopePath: typeHelper.enforce(
            'editorCoords, ast => array<astNode>',
            getScopePath),

        getScopeQuickPick: typeHelper.enforce(
            'array<astNode>, sourceLines, callback:function => undefined',
            getScopeQuickPick),

        getSelectedScopeIndex: typeHelper.enforce(
            'selectedScopeOption => arrayIndex',
            getSelectedScopeIndex)
    };
}

module.exports = scopeHelper;