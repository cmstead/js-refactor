var assert = require('chai').assert;
var selectionFactory = require('../modules/shared/selection-factory');

function documentFactory() {
    return {
        _documentData: {
            _lines: [
                'foo bar baz',
                'bar baz quux',
                'baz quux foo',
                'quux foo bar'
            ]
        },
        
        _selections: [{
            _start: {
                _line: 0,
                _character: 0
            },

            _end: {
                _line: 0,
                _character: 0
            }
        }]
    };
}

describe('Selection factory', function () {

    it('should return an instantiated selection object', function () {
        var selection = selectionFactory(documentFactory());
        assert.equal(typeof selection, 'object');
    });

    describe('Selection.getSelection', function () {

        it('should return an array of selected lines', function () {
            var document = documentFactory();
            document._selections[0]._end._character = 11;
            
            var result = selectionFactory(document).getSelection(0);
            assert.equal(Object.prototype.toString.call(result), '[object Array]');
        });

        it('should return an array of selected lines if using old VS Code API', function () {
            var document = documentFactory();
            document._document = document._documentData;
            document._documentData = undefined;
            document._selections[0]._end._character = 11;
            
            var result = selectionFactory(document).getSelection(0);
            assert.equal(Object.prototype.toString.call(result), '[object Array]');
        });

        it('should return null if no selection exists', function () {
            var document = documentFactory(),
                result = selectionFactory(document).getSelection(0);
                assert.equal(result, null);
        });
        
    });

});