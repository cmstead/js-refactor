var assert = require('chai').assert,
    addExport = require('../../modules/refactoring-logic/add-export'),
    fs = require('fs'),
    baseFixture = fs.readFileSync('./test/fixtures/add-export.js', { encoding: 'utf8' });

describe('Find export location', function () {

    describe.skip('find location in file with no exports', function () {

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
            var coords = addExport.exportLocation(fixture, 'object');
            assert.equal(JSON.stringify(coords), '{"start":[14,19],"end":[14,19]}');
        });

        it('should only find module exports as an object', function () {
            fixture.push('module.exports.bar = bar;');
            var coords = addExport.exportLocation(fixture, 'object');
            assert.equal(JSON.stringify(coords), '{"start":[14,19],"end":[14,19]}');
        });
        
    });

    describe('find location in file with exports as single lines', function () {

        var fixture;

        beforeEach(function () {
            fixture = baseFixture.split('\n');
            fixture.push('module.exports.foo = foo;');
        });

        it('should return an export location after a single export', function () {
            var coords = addExport.exportLocation(fixture, 'single');
            assert.equal(JSON.stringify(coords), '{"start":[14,26],"end":[14,26]}');
        });

        it('should return an export location after the last export', function () {
            fixture.push('');
            fixture.push('');
            fixture.push('module.exports.bar = bar;');
            var coords = addExport.exportLocation(fixture, 'single');
            assert.equal(JSON.stringify(coords), '{"start":[17,26],"end":[17,26]}');
        });

    });

});

describe('hasExportExpression', function () {

    var fixture;

    beforeEach(function () {
        fixture = baseFixture.split('\n');
    });

    it('should return true if code contains an export expression', function () {
        fixture.push('module.exports = {}');
        assert.equal(addExport.hasExportExpression(fixture), true);
    });

    it('should return false if code contains no export expression', function () {
        assert.equal(addExport.hasExportExpression(fixture), false);
    });

});

describe('hasExportObject', function () {

    var fixture;

    beforeEach(function () {
        fixture = baseFixture.split('\n');
    });

    it('should return true when exports are defined within an object', function () {
        fixture.push('module.exports = {};');
        assert.equal(addExport.hasExportObject(fixture), true);
    });

    it('should return true when exports are defined on single lines', function () {
        fixture.push('module.exports.blah = blah;');
        assert.equal(addExport.hasExportObject(fixture), false);
    });

});