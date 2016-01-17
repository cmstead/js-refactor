'use strict';

var functionRegex = /function\s+[^\s(]+\s*\(/;

function canConvertToMember (line){
    return line.match(functionRegex) !== null;
}

function getFunctionName (line){
    var preambleLength = line.split(functionRegex)[0].length,
        lineSubstr = line.substr(preambleLength).split('function')[1];
    
    return lineSubstr.split('(', 1)[0].trim();
}

function buildRefactorRegex (functionName) {
    var regex = 'function\\s+' + functionName + '\\s*\\(';
    console.log(regex);
    return new RegExp(regex);
}

function refactorToMemberFunction (line) {
    var functionName = getFunctionName(line),
        refactorRegex = buildRefactorRegex(functionName),
        replacementStr = functionName + ': function (';
        
    return line.replace(refactorRegex, replacementStr);
}

module.exports = {
    canConvertToMember: canConvertToMember,
    refactorToMemberFunction: refactorToMemberFunction
}