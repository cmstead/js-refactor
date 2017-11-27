'use strict';

function functionToString(fn) {
    const name = fn.name.trim() === '' ? 'anonymous' : fn.name;
    return `[function: ${name}]`;
}

function transformValue(key, value) {
    return typeof value === 'function'
        ? functionToString(value)
        : value;
}

function prettyJson(data) {
    var indent = 4;
    return JSON.stringify(data, transformValue, indent);
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