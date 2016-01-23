'use strict';

function findExportLine (lines){
    var index = 0,
        linesLength = lines.length;
    
    while (lines[index].match(/module\.exports/) === null && index < linesLength - 1) {
        index ++;
    }
    
    return index;
}

function exportLocation (lines){
    var exportLine = findExportLine(lines),
        exportLineEnd = lines[exportLine].length,
        insertPoint = [exportLine + 1, exportLineEnd + 1];
    
    return { start: insertPoint, end: insertPoint };
}

module.exports = {
    exportLocation: exportLocation
};