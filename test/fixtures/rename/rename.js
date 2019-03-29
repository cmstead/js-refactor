const foo = 'bar';

(function () {
    const baz = foo;

    (() => console.log(foo));

    const testObj = {
        quux: foo,
        method: function () {
            let testing = foo;

            return function (foo) {
                return testing + foo;
            }
        }
    }
})();