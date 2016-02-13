var assert = require('chai').assert;
var esprima = require('esprima');
var functionScopeUtil = require('../../modules/shared/function-scope-util');
var fs = require('fs');
var fixture = fs.readFileSync('./test/fixtures/extract-variable.js', { encoding: 'utf8' });

describe('Find Scope Bounds', function () {
    
    var tokens;
    
    beforeEach(function () {
        tokens = esprima.tokenize(fixture, { loc: true });        
    });
    
    it('should find the scope bounds of selected value in inner function', function () {
        var coords = {
            start: [11, 20],
            end: [11, 21]
        };
        
        var expected = '{"start":[10,28],"end":[12,10]}';
        var result = functionScopeUtil.findScopeBounds(tokens, coords);
        
        assert.equal(JSON.stringify(result), expected);
    });
    
    it('should find the scope bounds of selected value in outer function', function () {
        var coords = {
            start: [8, 21],
            end: [8, 26]
        };
        
        var expected = '{"start":[7,21],"end":[13,6]}';
        var result = functionScopeUtil.findScopeBounds(tokens, coords);
        
        assert.equal(JSON.stringify(result), expected);
    });
    
    it('should return null if function scope boundaries cannot be found', function () {
        var coords = {
            start: [3, 13],
            end: [3, 18]
        };
        
        var expected = null;
        var result = functionScopeUtil.findScopeBounds(tokens, coords);
        
        assert.equal(result, expected);
    });
    
});