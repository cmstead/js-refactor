var assert = require('chai').assert;
var variableOrder = require('../../modules/refactoring-logic/variable-order');

describe('Variable Order Logic', function () {
    
    describe('swapParams', function () {
        
        it('should exchange two params in string selection', function () {
            var expected = 'bar, foo';
            assert.equal(variableOrder.swapParams('foo, bar'), expected);
        });
        
        it('should return a single param if only one is provided', function () {
            var expected = 'baz';
            assert.equal(variableOrder.swapParams('baz'), expected);
        });
        
        it('should swap first two params in a long param list', function () {
            var expected = 'bar, foo, baz, quux';
            var params = 'foo, bar, baz, quux';
            
            assert.equal(variableOrder.swapParams(params), expected);
        });
    });

    describe('moveFirstToLast', function () {
        
        it('should leave a single param where it is', function () {
            assert.equal(variableOrder.moveFirstToLast('foo'), 'foo');
        });
        
        it('should swap params if there are two', function () {
            var expected = 'bar, foo';
            var params = 'foo, bar';
            
            assert.equal(variableOrder.moveFirstToLast(params), expected);
        });
        
        it('should move first param to end of list if list is long', function () {
            var expected = 'bar, baz, quux, foo';
            var params = 'foo, bar, baz, quux';
            
            assert.equal(variableOrder.moveFirstToLast(params), expected);
        });
        
    });
    
    describe('moveLastToFirst', function () {
        
        it('should leave a single param where it is', function () {
            assert.equal(variableOrder.moveLastToFirst('foo'), 'foo');
        });
        
        it('should swap params if there are two', function () {
            var expected = 'bar, foo';
            var params = 'foo, bar';
            
            assert.equal(variableOrder.moveLastToFirst(params), expected);
        });
        
        it('should move last param to beginning of list if list is long', function () {
            var expected = 'quux, foo, bar, baz';
            var params = 'foo, bar, baz, quux';
            
            assert.equal(variableOrder.moveLastToFirst(params), expected);
        });
        
    });
    
});