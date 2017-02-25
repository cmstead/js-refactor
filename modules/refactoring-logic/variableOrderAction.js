'use strict';

function variableOrderAction() {
    var splitPattern = /\,\s*/g;
    var paramDelimiter = ', ';

    function shiftParamsLeft(params) {
        var paramTokens = params.split(splitPattern);
        var firstToken = paramTokens.shift();

        paramTokens.push(firstToken);

        return paramTokens.join(paramDelimiter);
    }

    function shiftParamsRight(params) {
        var paramTokens = params.split(splitPattern);
        var lastToken = paramTokens.pop();

        paramTokens.unshift(lastToken);

        return paramTokens.join(paramDelimiter);
    }

    return {
        shiftParamsRight: shiftParamsRight,
        shiftParamsLeft: shiftParamsLeft
    }
}

module.exports = variableOrderAction;