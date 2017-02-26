var assert = require('chai').assert;
var templateUtils = require('../../modules/shared/template-utils');

describe('Template Utilities', function () {
    
    describe('getNewVariableContext', function () {
        
        var vsEditorFake;
        var selectionData;
        
        beforeEach(function () {
            vsEditorFake = {
                options: {
                    tabSize: 4,
                    insertSpaces: true
                }
            };
            
            selectionData = {
                selection: ['    stuff']
            };
        });
        
        it('should return an object with appropriate context', function () {
            var expected = '{"indent":"        ","name":"foo","value":"    stuff"}';
            var result = templateUtils.getNewVariableContext(vsEditorFake, 'foo', selectionData);
            
            assert.equal(JSON.stringify(result), expected);
        });
        
    });
    
    describe('fillTemplate', function () {
        
        it('should fill variable template with context values', function () {
            var expected = '    var stuff = "foo";';
            var context = {
                indent: '    ',
                value: '"foo"'
            };
            
            var result = templateUtils.fillTemplate(['{indent}var stuff = {value};'], context);
            
            assert.equal(result, expected);
        });
        
        it('should fill other template with context values', function () {
            var expected = '        let foo = "bar";';
            var context = {
                indent: '        ',
                name: 'foo',
                value: '"bar"'
            };
            
            var result = templateUtils.fillTemplate(['{indent}let {name} = {value};'], context);
            
            assert.equal(result, expected);
        });
        
    });
    
});