'use strict';

var esprima = require('esprima');

function lineComparisonFactory (lineNumber){
    return function (token) {
        return token.loc.start.line === lineNumber;
    };
}

function columnComparisonFactory (columnNumber){
    return function (token) {
        return token.loc.start.column === columnNumber - 1;
    };
}

function findValue (lines, coords){
    var lineCompatator = lineComparisonFactory(coords.start[0]);
    var columnComparator = columnComparisonFactory(coords.start[1]);
    var tokens = esprima.tokenize(lines.join('\n'), { loc: true }).filter(lineCompatator).filter(columnComparator);
    
    return tokens;
}

module.exports = {
    findValue: findValue
};