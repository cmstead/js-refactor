'use strict';

function prettyJson(data) {
    var indent = 4;
    return JSON.stringify(data, null, indent);
}

function functionToSource (value){
    return typeof value === 'function' ? value.toString() : value;
}

function objectFunctionsToSource (sourceObj) {
    return Object.keys(sourceObj).reduce(function (result, key) {
        result[key] = functionToSource(sourceObj[key]);
        return result;
    }, {});
}

module.exports = {
	prettyJson: prettyJson,
    objectFunctionsToSource: objectFunctionsToSource
}