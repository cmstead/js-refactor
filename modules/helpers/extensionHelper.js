'use strict';

function extensionHelper() {

    function isEmptyOrWhitespace(value) {
        return value.trim() === '';
    }


    return {
        isEmptyOrWhitespace: isEmptyOrWhitespace
    };
}

module.exports = extensionHelper;