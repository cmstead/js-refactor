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
    const dataIsDefined = typeof data !== 'undefined';

    return dataIsDefined
        ? JSON.stringify(data, transformValue, indent)
        : 'undefined';
}

module.exports = prettyJson;