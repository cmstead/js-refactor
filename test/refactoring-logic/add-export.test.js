var assert = require('chai').assert,
    addExport = require('../../modules/refactoring-logic/add-export'),
    fs = require('fs'),
    baseFixture = fs.readFileSync('./test/fixtures/add-export.js', { encoding: 'utf8' });

describe('Find export location', function () {
    
    describe('find location in file with no exports', function () {
        
        var fixture;
        
        beforeEach(function () {
            fixture = baseFixture.split('\n');
        });
        
        it('should return an export location at the bottom of the file', function () {
            var coords = addExport.exportLocation(fixture);
            assert.equal(JSON.stringify(coords), '{"start":[13,2],"end":[13,2]}');
        });
        
    });
    
    describe('find location in file with an exports object', function () {
        
        var fixture;
        
        beforeEach(function () {
            fixture = baseFixture.split('\n');
            fixture.push('module.exports = {');
            fixture.push('    foo: foo');
            fixture.push('};');
        });
        
        it('should return an export location inside the exports object', function () {
            var coords = addExport.exportLocation(fixture);
            assert.equal(JSON.stringify(coords), '{"start":[14,19],"end":[14,19]}');
        });
        
    });
    
});