'use strict';

function buildVscodeFake() {
    return {
        commands: {
            registerCommand: function () { }
        },
        window: {
            activeTextEditor: {
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

                ],
                _documentData: {
                    _lines: ['']
                }
            }
        }
    };
}

module.exports = buildVscodeFake;