'use strict';

function convertToArrowFunctionAction() {
    const functionPattern = /function\s*\(([^)]*)\)/;

    function canConvertToArrow(selectedLine) {

        return functionPattern.test(selectedLine);
    }

    function refactorFunctionDef (selection) {
        selection[0] = selection[0].replace(functionPattern, '($1) => ');
        return selection;
    }

    return {
        canConvertToArrow: canConvertToArrow,
        refactorFunctionDef: refactorFunctionDef
    };
}

module.exports = convertToArrowFunctionAction;