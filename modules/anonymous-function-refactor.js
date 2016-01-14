'use strict';

function canRefactorToNamed (line) {
    return line.match(/\=[\s\t].*function/g) !== null;
}

module.exports = {
    canRefactorToNamed: canRefactorToNamed
};