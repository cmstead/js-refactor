let mocker = require('./mocker');

let testHelperFactory = require('./test-utils/testHelperFactory');

let readSource = require('./test-utils/read-source');
let prettyJson = require('./test-utils/test-utils').prettyJson;

const selectionBuilder = require('./test-utils/selectionBuilder');
const activeEditorUpdater = require('./test-utils/activeEditorUpdater');

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
        var selections = [
            selectionBuilder.buildSelection([
                [99, 99],
                [99, 99]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const infoAction = mocker.getMock('logger').api.info;
        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(infoAction.args));
    });

    it('should mark a named function as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');
        var selections = [
            selectionBuilder.buildSelection([
                [5, 0],
                [5, 0]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );


        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');
        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should mark an anonymous function as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');
        var selections = [
            selectionBuilder.buildSelection([
                [9, 0],
                [9, 0]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');
        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should mark a simple lambda function as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');
        var selections = [
            selectionBuilder.buildSelection([
                [12, 24],
                [12, 24]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should mark a multi-line lambda function as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');
        var selections = [
            selectionBuilder.buildSelection([
                [15, 0],
                [15, 0]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');
        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should mark a method on a class as async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');
        var selections = [
            selectionBuilder.buildSelection([
                [20, 0],
                [20, 0]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should not mark a function which is already async', function () {
        var sourceTokens = readSource('./test/fixtures/markAsAsync/markAsAsync.js');
        var selections = [
            selectionBuilder.buildSelection([
                [0, 0],
                [0, 0]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const markAsAsyncFactory = subcontainer.build('markAsAsyncFactory');
        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });
});