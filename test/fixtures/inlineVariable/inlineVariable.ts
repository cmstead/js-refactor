'use strict';

var myVar = 5 + 6;

function foo() {
    return function bar(baz) {
        console.log(baz, 7 + 8);
    }
}

function someFn() {
    var bad;
    var quux: number = 7 + 8;
    console.log(baz, quux);
    var somethingElse = 7 + 8 + 10;
}


function anotherFunction() {
    var g = 2 + 2;
    var b = {
        test: g,
        g: [2, 3]
    };
}

function test() {
    const sum = 2 + 2;

    return (sum);
}