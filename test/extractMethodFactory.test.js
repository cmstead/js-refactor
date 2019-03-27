'use strict';

let mocker = require('./mocker');
let motherContainer = require('./test-utils/mother-container');

let testHelperFactory = require('./test-utils/testHelperFactory');

let readSource = require('./test-utils/read-source');
let prettyJson = require('./test-utils/test-utils').prettyJson;

let approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

let sinon = require('sinon');

describe('Extract Method', function () {

    let applySetEditSpy;
    let subcontainer;
    let vsCodeProperties;
    let setupOptions;
    let quickPickSpy;

    beforeEach(function () {
        const testHelper = testHelperFactory();
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

        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;

        quickPickSpy = sinon.spy(function(selectionItems, options, callback) {
            callback(selectionItems[setupOptions.selectedScopeIndex]);
        });

        mocker.getMock('logger').api.quickPick = quickPickSpy;
        mocker.getMock('logger').api.input = (options, callback) => callback('aNewFunction');
    });

    it('should log an error if selection is empty', function () {
        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const infoAction = mocker.getMock('logger').api.info;
        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(infoAction.args));
    });

    it('should provide scope options', function () {
        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [6, 12],
                    end: [8, 13]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(quickPickSpy.args));
    });

    it('should extract selected lines to the local function scope as chosen by the user', function() {
        setupOptions.selectedScopeIndex = 2;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [12, 8],
                    end: [14, 9]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract selected lines to an object context with rebound arguments', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [5, 12],
                    end: [8, 13]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract out of an object method call', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [19, 28],
                    end: [19, 43]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract out of a class method call', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [55, 8],
                    end: [57, 10]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract from a function call inside a condition into a local scope', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [23, 13],
                    end: [23, 20]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });
    
    it('should extract an entire block and ignore function calls from above scope', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [23, 4],
                    end: [26, 5]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract and return an object as a builder', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [30, 18],
                    end: [33, 5]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract and return an object as a builder from a ternary expression', function() {
        setupOptions.selectedScopeIndex = 2;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [43, 19],
                    end: [46, 17]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract function without capturing inappropriate identifiers', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [69, 8],
                    end: [77, 9]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const extractMethodFactory = subcontainer.build('extractMethodFactory');

        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });
});