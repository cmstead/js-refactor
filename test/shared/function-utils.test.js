var functionUtils = require('../../modules/shared/function-utils');
var assert = require('chai').assert;

describe('function utilities', function () {
    
    describe('getFunctionName', function () {
        
        it('should get a function name from a simple function line', function () {
            var functionLine = 'function foo ()';
            assert.equal(functionUtils.getFunctionName(functionLine), 'foo');
        });
        
        it('should get a function name from a string containing non-function text', function () {
            var functionLine = 'var foo = bar; function baz()';
            assert.equal(functionUtils.getFunctionName(functionLine), 'baz');
        });
        
        it('should return the first function name from a string containing two functions', function () {
            var functionLine = 'function baz(){} function quux(){}';
            assert.equal(functionUtils.getFunctionName(functionLine), 'baz');
        });
        
    });
    
});