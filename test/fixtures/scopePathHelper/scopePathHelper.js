var foo = 'hi';

console.log(foo, bar);

const obj = {
    testMethod: function () {
        return function (baz) {
            console.log(foo, baz);
        };
    }
};

(baz) => { }