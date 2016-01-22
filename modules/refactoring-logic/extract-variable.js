'use strict';

var esprima = require('esprima');

function locationComparatorFactory (location){
    return function (token) {
        return token.loc.start.line === location[0] && token.loc.start.column === location[1] - 1;
    }
}

function tokenComparatorFactory (value){
    return function (token) {
        return token.value === value;
    }
}

function findStart (tokens, coords){
    var index = 0;
    var isLocation = locationComparatorFactory(coords.start);
    
    while (!isLocation(tokens[index])) {
        index++;
    }
    
    return index;
}

function findFunctionTop (tokens, index){
    while (tokens[index].value !== 'function') {
        index--;
    }
    
    while (tokens[index].value !== '{') {
        index++;
    }
    
    return index;
}

function updateState (currentState, token) {
    if(token.value === '{') {
        currentState.push('{');
    }
    if (token.value === '}') {
        currentState.pop();
    }
    
    return currentState;
}

function findFunctionBottom (tokens, index) {
    var currentState = ['{'];
    
    while(currentState.length > 0) {
        index++;
        currentState = updateState(currentState, tokens[index]);
    }
    
    return index;
}

function findScopeBounds (lines, coords){
    var tokens = esprima.tokenize(lines.join('\n'), { loc: true }),
        index = findStart(tokens, coords),
        top = findFunctionTop(tokens, index),
        bottom = findFunctionBottom(tokens, top);
    
    return {
        start: [tokens[top].loc.start.line, tokens[top].loc.start.column + 1],
        end: [tokens[bottom].loc.end.line, tokens[bottom].loc.end.column + 1]
    };
}

module.exports = {
    findScopeBounds: findScopeBounds
};