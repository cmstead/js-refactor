'use strict';

const obj = {
    foo: function () {
        return function bar(whatever) {
            if (whatever) {
                var aThing = 5
                console.log('Do the thing', aThing);
            }
        };
    },
    baz: function () {
        if (1 !== 3) {
            console.log('This is definitional!');
        }
    }
}

function something(numbers) {
    numbers.filter(value => value % 2 === 0);
}

function testing(foo) {
    if (test(foo + 1)) {
        console.log(foo);
        something([1, 2, 3]);
    }
}

function testObjectFunction() {
    const myObj = {
        foo: 'bar',
        baz: 'quux'
    };

    return myObj;
}

function outerTestFunction() {
    return function innerTestFunction() {


        function checkNodeProperties(node) {
            return {
                operatorOk: true,
                hasStringLiteral: node.type === 'Literal' && typeof node.value === 'string'
            };
        }
    };
}

module.exports = obj;

class MyClass {
    foo() {
        console.log({
            baz: 3 + 4
        });
    }
}

function bar() {}

(function someWrappingFunction() {

    function testFunction(foo1) {
        var temp1 = 'something';
        var temp2 = 'anotherThing';

        if (foo1) {
            bar('something', function (error, data) {
                var aThing = [temp1, temp2];
                
                const somethingElse = 'message: ' + foo1;
    
                console.log(somethingElse);
            });
        }
    
    }
    
})();
