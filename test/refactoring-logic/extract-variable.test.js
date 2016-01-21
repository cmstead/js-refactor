var assert = require('chai').assert;
var extractVariable = require('../../modules/refactoring-logic/extract-variable');
var fs = require('fs');
var fixture = fs.readFileSync('./test/fixtures/extract-variable.js', { encoding: 'utf8' });

describe('Extract Variable', function () {
    
    it('should find a variable', function () {
        var lines = fixture.split('\n');
        var coords = {
            start: [9, 20],
            end: [9, 21]
        };
        var result = extractVariable.findValue(lines, coords);
        console.log(result);
        assert.equal(true, false);
    });
    
});