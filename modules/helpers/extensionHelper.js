'use strict';

function extensionHelper() {

    function isEmptyOrWhitespace(value) {
        return value.trim() === '';
    }

    function returnOrDefault(defaultValue, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);

            try {
                return fn.apply(null, args);
            } catch (e) {
                return defaultValue;
            }
        }
    }

    return {
        isEmptyOrWhitespace: isEmptyOrWhitespace,
        returnOrDefault: returnOrDefault
    };
}

module.exports = extensionHelper;