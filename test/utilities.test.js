var assert = require('chai').assert,
    utilities = require('../modules/shared/utilities');

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
    
    describe('buildLineCoords', function () {

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
            var result = utilities.buildLineCoords(vsEditor, 0);
            assert.equal(typeof result, 'object');
        });
        
        it('should correctly fill a start location', function () {
            vsEditor._selections[0]._start._line = 2;
            vsEditor._selections[0]._start._character = 0;
            var result = utilities.buildLineCoords(vsEditor, 0);
            assert.equal(JSON.stringify(result.start), '[2,0]');
        });
        
        it('should correctly fill a start location when start character is not 0', function () {
            vsEditor._selections[0]._start._line = 2;
            vsEditor._selections[0]._start._character = 5;
            var result = utilities.buildLineCoords(vsEditor, 0);
            assert.equal(JSON.stringify(result.start), '[2,0]');
        });
        
        it('should correctly fill a end location', function () {
            vsEditor._selections[0]._end._line = 3;
            vsEditor._selections[0]._end._character = 0;
            var result = utilities.buildLineCoords(vsEditor, 0);
            assert.equal(JSON.stringify(result.end), '[3,0]');
        });
        
        it('should correctly fill a end location when start character is not 0', function () {
            vsEditor._selections[0]._end._line = 3;
            vsEditor._selections[0]._end._character = 5;
            var result = utilities.buildLineCoords(vsEditor, 0);
            assert.equal(JSON.stringify(result.end), '[4,0]');
        });
        
    });
    
    describe('endPointsEqual', function () {
        
        var coords;
        
        beforeEach(function () {
            coords = {
                start: [0, 0],
                end: [0, 0]
            };
        });
        
        it('should return true if start and end points are equal', function () {
            assert.equal(utilities.endpointsEqual(coords), true);
        });
        
        it('should return false if line numbers are different', function () {
            coords.end[0] = 1;
            assert.equal(utilities.endpointsEqual(coords), false);
        });
        
        it('should return false if character numbers are different', function () {
            coords.end[1] = 1;
            assert.equal(utilities.endpointsEqual(coords), false);
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
    
    describe('replaceKey', function () {
        
        var context;
        
        beforeEach(function () {
            context = {
                foo: 'bar'
            };
        });
        
        it('should return a string with the template key replaced', function () {
            assert.equal(utilities.replaceKey(context, '{foo}', 'foo'), 'bar');
        });
        
    });

    describe('fillTemplate', function () {
        
        it('should fill template with context values', function () {
            var template = 'foo = {foo} and baz = {baz}',
                context = { foo: 'bar', baz: 'quux' };
            
            assert.equal(utilities.fillTemplate(context, template), 'foo = bar and baz = quux');
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
    
    describe('repeat', function () {
        
        it('should return specified multiple of passed value', function () {
            assert.equal(utilities.repeat(5, 'a'), 'aaaaa');
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