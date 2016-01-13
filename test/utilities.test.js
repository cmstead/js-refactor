var assert = require('chai').assert,
    actions = require('../modules/utilities');

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
            var result = actions.buildCoords(vsEditor, 0);
            assert.equal(typeof result, 'object');
        });

    });

});