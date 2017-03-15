'use strict';

var myVar = 5 + 6;

function foo() {
    return function bar (baz) {
        console.log(baz, 7 + 8);
    }
}