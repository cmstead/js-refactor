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
                options: {
                    tabSize: 4,
                    insertSpaces: true
                },
                _documentData: {
                    _lines: ['']
                }
            },
            showInformationMessage: function () { }
        }
    };
}

module.exports = buildVscodeFake;