'use strict';

function getFunctionName (line){
    var pattern = /(function)\s+([^\s\(]+)\s*\([^$]+/,
        preambleLength = line.split(pattern)[0].length;
        
    return line.substring(preambleLength).replace(pattern, '$2');
}

module.exports = {
    getFunctionName: getFunctionName
};