'use strict';

const obj = {
    foo: function () {
        return function bar (whatever) {
            if(whatever) {
                var aThing = 5
                console.log('Do the thing', aThing);
            }
        };
    },
    baz: function() {
        if(1 !== 3) {
            console.log('This is definitional!');
        }
    }
}

function something(numbers) {
    numbers.filter(value => value % 2 === 0);
}

function testing(foo) {
    if(test(foo + 1)) {
        console.log(foo);
    }
}

module.exports = obj;