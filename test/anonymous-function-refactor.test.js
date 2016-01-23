'use strict';

var anonymousFunctionRefactor = require('../modules/refactoring-logic/anonymous-function-refactor');
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
        
        it('should return false if function is not followed by only spaces and an open paren', function () {
            var line = "= function test foo bar";
            var result = anonymousFunctionRefactor.canRefactorToNamed(line);
            assert.equal(result, false);
        });
        
    });
    
    describe('Refactor anonymous function to named function', function () {
        
        it('should refactor a basic assignment', function () {
            var line = 'var myFn = function () {}';
            var result = anonymousFunctionRefactor.refactorToNamedFunction(line);
            assert.equal(result, 'function myFn () {}');
        });
        
        it('should refactor only the first matching function assignment with var', function () {
            var line = 'var anotherFn = function () {}; var myOtherFn = function () {}';
            var result = anonymousFunctionRefactor.refactorToNamedFunction(line);
            assert.equal(result, 'function anotherFn () {}; var myOtherFn = function () {}');
        });
        
        it('should refactor only the first matching function assignment with const', function () {
            var line = 'const anotherFn = function () {}; var myOtherFn = function () {}';
            var result = anonymousFunctionRefactor.refactorToNamedFunction(line);
            assert.equal(result, 'function anotherFn () {}; var myOtherFn = function () {}');
        });
        
        it('should refactor only the first matching function assignment with let', function () {
            var line = 'let anotherFn = function () {}; var myOtherFn = function () {}';
            var result = anonymousFunctionRefactor.refactorToNamedFunction(line);
            assert.equal(result, 'function anotherFn () {}; var myOtherFn = function () {}');
        });
        
        it('should refactor only the first matching function assignment with no var-related prefix', function () {
            var line = 'anotherFn = function () {}; var myOtherFn = function () {}';
            var result = anonymousFunctionRefactor.refactorToNamedFunction(line);
            assert.equal(result, 'function anotherFn () {}; var myOtherFn = function () {}');
        });
        
    });
    
});