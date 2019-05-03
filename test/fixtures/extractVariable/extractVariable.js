'use strict';

var myVar = 5 + 6;

function foo() {
    return function bar(baz) {
        console.log(baz, 7 + 8);
    }
}

function someFn() {
    console.log(baz, 7 + 8);
}

const myFn = () => {
    console.log(baz, 7 + 8);
};

const myOtherFn = () => {
    console.log(baz, 7 + 8);
    doSomethingElse(7 + 8);
};

const myObj = {
    foo: function () {
        return function bar() {
            console.log({
                baz: 'quux'
            });

            const test = 1 + 2 + 3;
        }
    }
};

class MyClass {
    foo() {
        console.log({
            baz: 3 + 4
        });
    }
}

