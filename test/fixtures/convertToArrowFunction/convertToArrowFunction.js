'use strict';

const mySimpleFunction = function (value) {
    console.log(value);
}

function myNamedFunction (value) {
    console.log(value);
}

function myFunction(foo, { bar, baz }, ...rest) {
    console.log(foo, bar, baz, rest);
}