var assert = require('chai').assert;
var variableOrder = require('../../modules/refactoring-logic/variable-order');

describe('Variable Order Logic', function () {
    
    describe('shiftParamsLeft', function () {
        
        it('should leave a single param where it is', function () {
            assert.equal(variableOrder.shiftParamsLeft('foo'), 'foo');
        });
        
        it('should swap params if there are two', function () {
            var expected = 'bar, foo';
            var params = 'foo, bar';
            
            assert.equal(variableOrder.shiftParamsLeft(params), expected);
        });
        
        it('should move first param to end of list if list is long', function () {
            var expected = 'bar, baz, quux, foo';
            var params = 'foo, bar, baz, quux';
            
            assert.equal(variableOrder.shiftParamsLeft(params), expected);
        });
        
    });
    
    describe('shiftParamsRight', function () {
        
        it('should leave a single param where it is', function () {
            assert.equal(variableOrder.shiftParamsRight('foo'), 'foo');
        });
        
        it('should swap params if there are two', function () {
            var expected = 'bar, foo';
            var params = 'foo, bar';
            
            assert.equal(variableOrder.shiftParamsRight(params), expected);
        });
        
        it('should move last param to beginning of list if list is long', function () {
            var expected = 'quux, foo, bar, baz';
            var params = 'foo, bar, baz, quux';
            
            assert.equal(variableOrder.shiftParamsRight(params), expected);
        });
        
    });
    
});