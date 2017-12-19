'use strict';

function something () {
    return function somethingElse () {
        const myFunctionPointer = myNewFunction;
    }
}

const myResult = myNewFunction('foo');

module.exports = {
    myNewFunction: myNewFunction
};