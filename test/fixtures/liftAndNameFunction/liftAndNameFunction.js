'use strict';

function notLiftAndNameable() {
    // This is not something that can be lifted and named
}

console.log((function (foo) {
    return 'Hello, World!';
})());