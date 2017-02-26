var assert = require('chai').assert,
    utilities = require('../modules/shared/utilities')();

describe('Common Actions', function () {

    describe('buildCoords', function () {

        var vsEditor;

        beforeEach(function () {
            vsEditor = {
                _selections: [
                    {
                        _start: {
                            _line: 0,
                            _character: 0
                        },
                        _end: {
                            _line: 0,
                            _character: 0
                        }
                    }
                ]
            };
        })

        it('should return an object', function () {
            var result = utilities.buildCoords(vsEditor, 0);
            assert.equal(typeof result, 'object');
        });

        it('should set start coordinates', function () {
            vsEditor._selections[0]._start._line = 1;
            vsEditor._selections[0]._start._character = 2;
            var result = utilities.buildCoords(vsEditor, 0);
            assert.equal(JSON.stringify(result.start), '[1,2]');
        });

        it('should set start coordinates', function () {
            vsEditor._selections[0]._end._line = 3;
            vsEditor._selections[0]._end._character = 4;
            var result = utilities.buildCoords(vsEditor, 0);
            assert.equal(JSON.stringify(result.end), '[3,4]');
        });

    });
  
    describe('indent', function () {
        
        it('it should indent line with a tab by default', function () {
            assert.equal(utilities.indent(null, 'foo'), '\tfoo');
        });
        
        it('should indent line with provided indent value', function () {
            assert.equal(utilities.indent('    ', 'foo'), '    foo');
        });
        
    });
    
    describe('getSelectionIndent', function () {
        
        it('should return a string', function () {
            assert.equal(typeof utilities.getSelectionIndent(['']), 'string');
        });
        
        it('should return the whitespace at the front of the first selection string', function () {
            assert.equal(utilities.getSelectionIndent(['   \tfoo, bar, baz   ']), '   \t');
        });
        
    });
    
    describe('getDocumentIndent', function () {
        
        var vsEditor;
        
        beforeEach(function () {
            vsEditor = {
                options: {
                    tabSize: 4,
                    insertSpaces: true
                }
            };
        });
        
        it('should return 4 spaces', function () {
            assert.equal(utilities.getDocumentIndent(vsEditor), '    ');
        });
        
        it('should return a tab when insertSpaces is false', function () {
            vsEditor.options.insertSpaces = false;
            assert.equal(utilities.getDocumentIndent(vsEditor), '\t');
        });
        
        it('should return 3 spaces when tabSize is 3 and insertSpaces is true', function () {
            vsEditor.options.tabSize = 3;
            assert.equal(utilities.getDocumentIndent(vsEditor), '   ');
        });
        
    });

});