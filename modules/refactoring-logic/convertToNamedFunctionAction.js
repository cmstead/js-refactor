'use strict';


function convertToNamedFunctionAction() {

    function canRefactorToNamed(line) {
        return line.match(/(\=|\:)\s*function\s*\(/g) !== null;
    }

    function buildReplacementRegex(name) {
        var regexStr = '(var|let|const)?\\s*' + name + '\\s*(\\=|\\:)\\s*function\\s*\\(';
        return new RegExp(regexStr);
    }

    function getFunctionName(line) {
        var lineTokens = line.split(/(\=|\:)\s*function\s*\(/),
            nameTokens = lineTokens[0].trim().split(' ');

        return nameTokens[nameTokens.length - 1];
    }

    function refactorToNamedFunction(line) {
        var name = getFunctionName(line);
        var regex = buildReplacementRegex(name);
        var result = line.replace(regex, 'function ' + name + ' (');

        return result;
    }

    return {
        canRefactorToNamed: canRefactorToNamed,
        refactorToNamedFunction: refactorToNamedFunction
    };
    
}

module.exports = convertToNamedFunctionAction;
