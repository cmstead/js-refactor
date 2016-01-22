var assert = require('chai').assert;
var extractVariable = require('../../modules/refactoring-logic/extract-variable');
var fs = require('fs');
var fixture = fs.readFileSync('./test/fixtures/extract-variable.js', { encoding: 'utf8' });

describe('Extract Variable', function () {
    
    it('should find the scope bounds of selected value in inner function', function () {
        var lines = fixture.split('\n');
        var coords = {
            start: [9, 20],
            end: [9, 21]
        };
        
        var expected = '{"start":[8,28],"end":[10,10]}';
        var result = extractVariable.findScopeBounds(lines, coords);
        
        assert.equal(JSON.stringify(result), expected);
    });
    
    it('should find the scope bounds of selected value in outer function', function () {
        var lines = fixture.split('\n');
        var coords = {
            start: [6, 21],
            end: [6, 26]
        };
        
        var expected = '{"start":[5,21],"end":[11,6]}';
        var result = extractVariable.findScopeBounds(lines, coords);
        
        assert.equal(JSON.stringify(result), expected);
    });
    
});