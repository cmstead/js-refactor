'use strict';

var splitPattern = /\,\s*/g;
var paramDelimiter = ', ';

function swapParams(params) {
    var paramTokens = params.split(splitPattern);
    var staticParams = paramTokens.slice(2);

    return paramTokens.slice(0, 2).reverse().concat(staticParams).join(paramDelimiter);
}

function moveFirstToLast (params){
    var paramTokens = params.split(splitPattern);
    var firstToken = paramTokens.shift();
    
    paramTokens.push(firstToken);
    
    return paramTokens.join(paramDelimiter);
}

function moveLastToFirst (params){
    var paramTokens = params.split(splitPattern);
    var lastToken = paramTokens.pop();
    
    paramTokens.unshift(lastToken);
    
    return paramTokens.join(paramDelimiter);
}

module.exports = {
	moveLastToFirst: moveLastToFirst,
	moveFirstToLast: moveFirstToLast,
    swapParams: swapParams
}