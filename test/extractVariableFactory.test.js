'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe('Extract Variable', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;
    let setupOptions;
    let quickPickSpy;

    beforeEach(function () {
        var testHelper = testHelperFactory();
        setupOptions = {
            selectedScopeIndex: 0
        };

        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;

        applySetEditSpy = sinon.spy(function () {
            return {
                then: function (callback) {
                    callback()
                }
            };
        });

        quickPickSpy = sinon.spy(function (selectionItems, options, callback) {
            let selection = selectionItems[setupOptions.selectedScopeIndex];
            selection = typeof selection === 'undefined' ? selectionItems[0] : selection;
            callback(selection);
        });

        mocker.getMock('logger').api.quickPick = quickPickSpy;
        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if selection is not a single expression', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 20,
                    _character: 20
                },
                _end: {
                    _line: 21,
                    _character: 23
                }
            }]
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should extract variable when selection is a single-line value', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');
        setupOptions.selectedScopeIndex = 1;

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 11,
                    _character: 21
                },
                _end: {
                    _line: 11,
                    _character: 26
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract multiline variable to the local scope', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');
        setupOptions.selectedScopeIndex = 3;
        
        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 26,
                    _character: 24
                },
                _end: {
                    _line: 28,
                    _character: 13
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract multiline variable to a function scope', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');
        setupOptions.selectedScopeIndex = 2;
        
        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 26,
                    _character: 24
                },
                _end: {
                    _line: 28,
                    _character: 13
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract multiline variable to an object scope', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');
        setupOptions.selectedScopeIndex = 1;
        
        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 26,
                    _character: 24
                },
                _end: {
                    _line: 28,
                    _character: 13
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract multiline variable to the program scope', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');
        setupOptions.selectedScopeIndex = 0;
        
        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 26,
                    _character: 24
                },
                _end: {
                    _line: 28,
                    _character: 13
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should adjust for terminating semicolon', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.ts');
        setupOptions.selectedScopeIndex = 3;
        
        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens
            },
            _selections: [{
                _start: {
                    _line: 30,
                    _character: 29
                },
                _end: {
                    _line: 30,
                    _character: 34
                }
            }]
        };

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});