'use strict';

const value = 'something';

const obj = {
    foo: 'bar'
}

const astr = 'this is a test ' + value + ' and here is an object reference: ' + obj.foo + 'and some more stuff';

console.log('this is a test ' + value + ' and here is an object reference: ' + obj.foo + 'and some more stuff');