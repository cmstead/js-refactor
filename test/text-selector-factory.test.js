var assert = require('chai').assert;
var sinon = require('sinon');
var selectorFactory = require('../modules/shared/text-selector-factory');

describe('Text Selector Factory', function () {
    
    describe('noSelection', function () {
        
        var selection;
        
        beforeEach(function () {
            selection = {
                _start: {
                    _line: 0,
                    _character: 0
                },
                
                _end: {
                    _line: 0,
                    _character: 0
                }
            };
        });
        
        it('should return null', function () {
            var noSelection = selectorFactory(selection);
            assert.equal(noSelection(), null);
        });
        
    });
    
    describe('singleLineSelection', function () {
        
        var selection,
            contentLines;
        
        beforeEach(function () {
            selection = {
                _start: {
                    _line: 0,
                    _character: 0
                },
                
                _end: {
                    _line: 0,
                    _character: 0
                }
            };

            contentLines = [
                'foo bar baz',
                'bar baz quux',
                'baz quux foo',
                'quux foo bar'
            ];
        });
        
        it('should return a full line', function () {
            selection._end._character = 11;
            var singleLineSelection = selectorFactory(selection);
            assert.equal(singleLineSelection(contentLines, selection)[0], contentLines[0]);
        });
        
        it('should return selected line', function () {
            selection._start._line = 1;
            selection._end._line = 1;
            selection._end._character = 12;
            
            var singleLineSelection = selectorFactory(selection);
            assert.equal(singleLineSelection(contentLines, selection)[0], contentLines[1]);
        });
        
        it('should return selected line substring', function () {
            selection._start._line = 2;
            selection._end._line = 2;
            selection._start._character = 4;
            selection._end._character = 8;
            
            var singleLineSelection = selectorFactory(selection);
            assert.equal(singleLineSelection(contentLines, selection)[0], 'quux');
        });
        
    });

    describe('multiLineSelect', function () {
        
        var selection,
            contentLines;
        
        beforeEach(function () {
            selection = {
                _start: {
                    _line: 0,
                    _character: 0
                },
                
                _end: {
                    _line: 0,
                    _character: 0
                }
            };

            contentLines = [
                'foo bar baz',
                'bar baz quux',
                'baz quux foo',
                'quux foo bar'
            ];
        });
        
        it('should return selected lines', function () {
            selection._start._line = 1;
            selection._start._character = 0;
            selection._end._line = 2;
            selection._end._character = 12;
            
            var result = selectorFactory(selection)(contentLines, selection);
            assert.equal(result.join(','), contentLines.slice(1, 3).join(','));
        });
        
        it('should return selected, trimmed lines', function () {
            selection._start._line = 1;
            selection._start._character = 4;
            selection._end._line = 2;
            selection._end._character = 8;
            
            var result = selectorFactory(selection)(contentLines, selection);
            assert.equal(result.join(','), 'baz quux,baz quux');
        });
        
        it('should return selected, trimmed lines', function () {
            selection._start._line = 1;
            selection._start._character = 4;
            selection._end._line = 3;
            selection._end._character = 8;
            
            var result = selectorFactory(selection)(contentLines, selection);
            assert.equal(result.join(','), 'baz quux,baz quux foo,quux foo');
        });
        
    });
    
});