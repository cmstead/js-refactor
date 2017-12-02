'use strict';

const obj = {
    foo: function () {
        return function bar (whatever) {
            if(whatever) {
                console.log('Do the thing');
            }
        };
    },
    baz: function() {
        if(1 !== 3) {
            console.log('This is definitional!');
        }
    }
}

module.exports = obj;