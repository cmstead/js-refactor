'use strict';

var j = require('jfp');

function isLocationMatch(location, token) {
    return token.loc.start.line === location[0] && token.loc.start.column === location[1] - 1;
}

function isValueMatch(token, value) {
    return token.value === value;
}

function seek(directionIncrement, tokens, value, index) {
    return j.recur(seekAction, index);

    function seekAction(recur, index) {
        index = j.isUndefined(tokens[index]) ? -1 : index;

        var isStopState = index === -1 || isValueMatch(tokens[index], value);

        return isStopState ? index : recur(index + directionIncrement);
    }
}

var seekUp = j.partial(seek, -1);
var seekDown = j.partial(seek, 1);

function findStart(tokens, coords) {
    return j.recur(findAction, 0);

    function findAction(recur, index) {
        var locationMatches = isLocationMatch(coords.start, tokens[index]);
        return locationMatches ? index : recur(index + 1);
    }
}

function findScopeTop(tokens, index) {
    return j.pipeline(index,
        j.partial(seekUp, tokens, 'function'),
        j.partial(seekDown, tokens, '{'));
}

function updateState(currentState, token) {
    switch (token.value) {
        case '{':
            return j.cons('{', currentState);
        case '}':
            return j.dropLast(currentState);
        default:
            return currentState;
    }
}

function findScopeBottom(tokens, index) {
    return j.recur(findAction, [], tokens, index);

    function findAction(recur, state, tokens, index) {
        index = j.isUndefined(tokens[index]) ? -1 : index;

        var currentState = index !== -1 ? updateState(state, tokens[index]) : [];

        return currentState.length > 0 ? recur(currentState, tokens, index + 1) : index;
    }
}

function buildBoundsObject(tokens, top, bottom) {
    var start = top === -1 ? null : [tokens[top].loc.start.line, tokens[top].loc.start.column + 1];
    var end = bottom === -1 ? null : [tokens[bottom].loc.end.line, tokens[bottom].loc.end.column + 1];

    return j.isNull(start) || j.isNull(end) ? null : { start: start, end: end }; 
}

function findScopeBounds(tokens, coords) {
    var index = findStart(tokens, coords);
    var top = findScopeTop(tokens, index);
    var bottom = findScopeBottom(tokens, top);

    return buildBoundsObject(tokens, top, bottom);
}

module.exports = {
    findScopeBounds: findScopeBounds
};