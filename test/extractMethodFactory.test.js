'use strict';

let mocker = require('./mocker');

let testHelperFactory = require('./test-utils/testHelperFactory');

let readSource = require('./test-utils/read-source');
let prettyJson = require('./test-utils/test-utils').prettyJson;

const selectionBuilder = require('./test-utils/selectionBuilder');
const activeEditorUpdater = require('./test-utils/activeEditorUpdater');

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

        const infoAction = mocker.getMock('logger').api.info;
        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(infoAction.args));
    });

    it('should provide scope options', function () {
        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [6, 12],
                [8, 13]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(quickPickSpy.args));
    });

    it('should extract selected lines to the local function scope as chosen by the user', function() {
        setupOptions.selectedScopeIndex = 2;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [12, 8],
                [14, 9]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );


        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract selected lines to an object context with rebound arguments', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [5, 12],
                [8, 13]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );


        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract out of an object method call', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [19, 28],
                [19, 43]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract out of a class method call', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [55, 8],
                [57, 10]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract from a function call inside a condition into a local scope', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [23, 13],
                [23, 20]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });
    
    it('should extract an entire block and ignore function calls from above scope', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [23, 4],
                [26, 5]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract and return an object as a builder', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [30, 18],
                [33, 5]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract and return an object as a builder from a ternary expression', function() {
        setupOptions.selectedScopeIndex = 2;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [43, 19],
                [46, 17]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract function without capturing inappropriate identifiers', function() {
        setupOptions.selectedScopeIndex = 1;

        const sourceTokens = readSource('./test/fixtures/extractMethod/extractMethod.js');
        var selections = [
            selectionBuilder.buildSelection([
                [69, 8],
                [77, 9]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const extractMethodFactory = subcontainer.build('extractMethodFactory');
        const callback = function () { };

        extractMethodFactory(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });
});