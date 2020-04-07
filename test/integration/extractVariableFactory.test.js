'use strict';

var mocker = require('../mocker');

var testHelperFactory = require('../test-utils/testHelperFactory');

var readSource = require('../test-utils/read-source');
var prettyJson = require('../test-utils/test-utils').prettyJson;

const selectionBuilder = require('../test-utils/selectionBuilder');
const activeEditorUpdater = require('../test-utils/activeEditorUpdater');

var approvalsConfig = require('../test-utils/approvalsConfig');
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
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');

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

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if selection is not a single expression', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        var selections = [
            selectionBuilder.buildSelection([
                [20, 20],
                [21, 23]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should extract variable when selection is a single-line value', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        setupOptions.selectedScopeIndex = 1;

        var selections = [
            selectionBuilder.buildSelection([
                [11, 21],
                [11, 26]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract multiline variable to the local scope', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        setupOptions.selectedScopeIndex = 3;
        var selections = [
            selectionBuilder.buildSelection([
                [26, 24],
                [28, 13]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract multiline variable to a function scope', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        setupOptions.selectedScopeIndex = 2;
        var selections = [
            selectionBuilder.buildSelection([
                [26, 24],
                [28, 13]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract multiline variable to an object scope', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        setupOptions.selectedScopeIndex = 1;
        var selections = [
            selectionBuilder.buildSelection([
                [26, 24],
                [28, 13]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract multiline variable to the program scope', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        setupOptions.selectedScopeIndex = 0;
        var selections = [
            selectionBuilder.buildSelection([
                [26, 24],
                [28, 13]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should adjust for terminating semicolon', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        setupOptions.selectedScopeIndex = 3;
        var selections = [
            selectionBuilder.buildSelection([
                [30, 29],
                [30, 34]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });


    it('should extract variable within a method on a class', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        setupOptions.selectedScopeIndex = 1;
        var selections = [
            selectionBuilder.buildSelection([
                [37, 20],
                [39, 9]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it.skip('should extract variable to a scope outside the class', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        setupOptions.selectedScopeIndex = 0;
        var selections = [
            selectionBuilder.buildSelection([
                [38, 17],
                [38, 22]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('extractVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });


});