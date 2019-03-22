let mocker = require('./mocker');

let testHelperFactory = require('./test-utils/testHelperFactory');
let motherContainer = require('./test-utils/mother-container');

let readSource = require('./test-utils/read-source');
let prettyJson = require('./test-utils/test-utils').prettyJson;

let approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

let sinon = require('sinon');

describe('markAsAsyncFactory', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;
    var quickPickSpy;
    var quickPickOptions;

    beforeEach(function () {
        var testHelper = testHelperFactory();

        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;

        applySetEditSpy = sinon.spy(function (text, coords) {
            return {
                then: function (callback) {

                }
            };
        });

        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;

        quickPickOptions = {
            itemIndices: [0, 0]
        };

        quickPickSpy = sinon.spy(function (selectionItems, options, callback) {
            const selectedIndex = quickPickOptions.itemIndices.shift();

            callback(selectionItems[selectedIndex]);
        });

        mocker.getMock('logger').api.quickPick = quickPickSpy;
    });

    it('should log an error if no function can be found to mark', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [99, 99],
                    end: [99, 99]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const infoAction = mocker.getMock('logger').api.info;
        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(infoAction.args));
    });

    it('should mark a named function as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [5, 0],
                    end: [5, 0]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should mark an anonymous function as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [9, 0],
                    end: [9, 0]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should mark a simple lambda function as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [12, 24],
                    end: [12, 24]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should mark a multi-line lambda function as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [15, 0],
                    end: [15, 0]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should mark a method on a class as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [20, 0],
                    end: [20, 0]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should not mark a function which is already async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [1, 0],
                    end: [1, 0]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });
});