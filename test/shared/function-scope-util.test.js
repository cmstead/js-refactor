var assert = require('chai').assert;
var esprima = require('esprima');
var functionScopeUtil = require('../../modules/shared/function-scope-util');
var fs = require('fs');
var fixture = fs.readFileSync('./test/fixtures/extract-variable.js', { encoding: 'utf8' });
var j = require('jfp');

describe('Find Scope Bounds', function () {

    var tokens;

    beforeEach(function () {
        tokens = esprima.tokenize(fixture, { loc: true });
    });

    it('should find the scope bounds of selected value in inner function', function () {
        // Coordinates inside the extension are 0-based while the display is 1-based
        var coords = {
            start: [10, 20],
            end: [10, 21]
        };

        var expected = '{"start":[10,28],"end":[12,10]}';
        var result = functionScopeUtil.findScopeBounds(tokens, coords);

        assert.equal(JSON.stringify(result), expected);
    });

    it('should find the scope bounds of selected value in outer function', function () {
        // Coordinates inside the extension are 0-based while the display is 1-basedß
        var coords = {
            start: [7, 21],
            end: [7, 26]
        };

        var expected = '{"start":[7,21],"end":[13,6]}';
        var result = functionScopeUtil.findScopeBounds(tokens, coords);

        assert.equal(JSON.stringify(result), expected);
    });

    it('should return null if function scope boundaries cannot be found', function () {
        var coords = {
            start: [2, 13],
            end: [2, 18]
        };

        var expected = null;
        var result = functionScopeUtil.findScopeBounds(tokens, coords);

        assert.equal(result, expected);
    });

});

describe('Find value instances', function () {

    var tokens;
    var scopeIndices;

    beforeEach(function () {
        var coords = {
            start: [7, 21],
            end: [7, 26]
        };
        
        var lines = fixture.split('\n');
        lines = lines.slice(0, lines.length - 3);
        
        lines.push('console.log(\'foo\')');
        lines.push('console.log(\'foo\')');
        lines.push('}');
        lines.push('})();');
        
        tokens = esprima.tokenize(lines.join('\n'), { loc: true });
        scopeIndices = functionScopeUtil.findScopeIndices(tokens, coords);
    });

    // This is just to get an array back first -- this problem needs some thinking.
    it('should return an array with length equal to value instances', function () {
        var result = functionScopeUtil.findValueInstances(tokens, scopeIndices, '\'foo\'');
        assert.equal(result.length, 3);
    });

    it('should return an array of instance objects', function () {
        var result = functionScopeUtil.findValueInstances(tokens, scopeIndices, '\'foo\'');
        var typeArray = result.map(function (value) { return typeof value; });
        
        assert.equal(JSON.stringify(typeArray), '["object","object","object"]');
    });
    
    it('should only contain location data', function () {
        var result = functionScopeUtil.findValueInstances(tokens, scopeIndices, '\'foo\'');
        var testArray = result.map(function (value) { return !j.isUndefined(value.start) && !j.isUndefined(value.end); });
        
        assert.equal(JSON.stringify(testArray), '[true,true,true]');
    });
    
    it('should fix the column value to match VS Code expectations', function () {
        var result = functionScopeUtil.findValueInstances(tokens, scopeIndices, '\'foo\'');
        var expected = '[{"start":{"line":7,"column":20},"end":{"line":7,"column":25}},{"start":{"line":12,"column":12},"end":{"line":12,"column":17}},{"start":{"line":13,"column":12},"end":{"line":13,"column":17}}]';
        
        assert.equal(JSON.stringify(result), expected);
        
    });
});