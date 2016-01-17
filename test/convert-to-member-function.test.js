'use strict';

var convertToMemberFunction = require('../modules/refactoring-logic/convert-to-member-function');
var assert = require('chai').assert;

describe('Convert to Member Function', function () {
    
    describe('canConvertToMember', function () {
        
        it('should return true if function is valid target for conversion', function () {
            var line = 'function foo () {}';
            var result = convertToMemberFunction.canConvertToMember(line);
            assert.equal(result, true);
        });
        
        it('should return false if function is anonymous', function () {
            var line = 'function () {}';
            var result = convertToMemberFunction.canConvertToMember(line);
            assert.equal(result, false);
        });
        
        it('should return false if no function exists on the line', function () {
            var line = 'foo bar baz';
            var result = convertToMemberFunction.canConvertToMember(line);
            assert.equal(result, false);
        });
       
       it('should return true if function spacing is strange', function () {
           var line = 'function      foo   () {  }';
           var result = convertToMemberFunction.canConvertToMember(line);
           assert.equal(result, true);
       });
        
    });
    
    describe('refactorToMemberFunction', function () {
        
        it('should rewrite a simple line', function () {
            var line = 'function foo () {}';
            var result = convertToMemberFunction.refactorToMemberFunction(line);
            assert.equal(result, 'foo: function () {}');
        });
        
        it('should rewrite a line with only required spaces', function () {
            var line = 'function bar() {}';
            var result = convertToMemberFunction.refactorToMemberFunction(line);
            assert.equal(result, 'bar: function () {}');
        });
        
        it('should preserve function body', function () {
            var line = 'function baz (){ /* do stuff */ }',
                result = convertToMemberFunction.refactorToMemberFunction(line);
            
            assert.equal(result, 'baz: function (){ /* do stuff */ }');
        });
        
    });
    
});