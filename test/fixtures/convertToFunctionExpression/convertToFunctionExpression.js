'use strict';

const testFn0 = () => 'foo';

const testFn1 = (test1, test2) => test1 + test2;

const testsFn2 = (test1, test2, test3) => {
    var firstSum = test1 + test2;
    return firstSum + test3;
}