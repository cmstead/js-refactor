'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert to Arrow Function', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();
        
        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should log an error if selection is invalid', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 0,
                    _character: 0
                },
                _end: {
                    _line: 0,
                    _character: 13
                }
            }]
        };


        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should convert named function declaration with to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 6,
                    _character: 14
                },
                _end: {
                    _line: 6,
                    _character: 14
                }
            }]
        };

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert anonymous function declaration to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 15,
                    _character: 27
                },
                _end: {
                    _line: 15,
                    _character: 27
                }
            }]
        };

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert named one-line function declaration with to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 11,
                    _character: 14
                },
                _end: {
                    _line: 11,
                    _character: 14
                }
            }]
        };

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert anonymous one-line function declaration with to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 2,
                    _character: 33
                },
                _end: {
                    _line: 2,
                    _character: 33
                }
            }]
        };

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert the only function in a file to an arrow function', function () {
        var source = `function hi() {
            console.log('hi');
          }`;
        var sourceTokens = source.split(/\r?\n/);

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 1,
                    _character: 5
                },
                _end: {
                    _line: 1,
                    _character: 5
                }
            }]
        };

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should remove trailing semi-colons from single-line arrow functions', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 20,
                    _character: 15
                },
                _end: {
                    _line: 20,
                    _character: 15
                }
            }]
        };

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});