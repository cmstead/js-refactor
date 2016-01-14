'use strict';

var anonymousFunctionRefactor = require('../modules/anonymous-function-refactor');
var assert = require('chai').assert;

describe('Anonymous Function Refactorings', function () {
    
    describe('Evaluate line for anonymous->name function refactor', function () {
        
        it('should return true if line contains refactorable function assignment', function () {
            var line = "var myFn = function () {";
            var result = anonymousFunctionRefactor.canRefactorToNamed(line);
            assert.equal(result, true);
        });
        
        it('should return false if no function exists on line', function () {
            var line = 'foo bar baz';
            var result = anonymousFunctionRefactor.canRefactorToNamed(line);
            assert.equal(result, false);
        });
        
        it('should return false if no assignment of a function exists on the line', function () {
            var line = 'function () {}';
            var result = anonymousFunctionRefactor.canRefactorToNamed(line);
            assert.equal(result, false);
        });
        
    });
    
});