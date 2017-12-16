var foo = 'hi';

console.log(foo, bar);

const obj = {
    testMethod: function (foo) {
        return function (baz) {
            if(foo) {
                console.log(foo, baz);
                return quux;
            }
        };
    }
};

(baz) => { }