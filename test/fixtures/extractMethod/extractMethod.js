'use strict';

const obj = {
    foo: function () {
        return function bar (whatever) {
            if(whatever) {
                console.log('Do the thing');
            }
        };
    }
}

module.exports = obj;