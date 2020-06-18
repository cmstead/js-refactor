'use strict';

var mocker = require('../mocker');
const container = require('../../container');
const motherContainer = require('../test-utils/mother-container');

// var testHelperFactory = require('../test-utils/testHelperFactory');

var readSource = require('../test-utils/read-source');
var prettyJson = require('../test-utils/test-utils').prettyJson;

const selectionBuilder = require('../test-utils/selectionBuilder');
const activeEditorUpdater = require('../test-utils/activeEditorUpdater');

var approvalsConfig = require('../test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe.only('Extract Variable', function () {
    // var subcontainer;
    // var applySetEditSpy;
    // var vsCodeProperties;
    // let setupOptions;
    // let quickPickSpy;

    // beforeEach(function () {
    //     var testHelper = testHelperFactory();
    //     setupOptions = {
    //         selectedScopeIndex: 0
    //     };

    //     subcontainer = testHelper.subcontainer;
    //     applySetEditSpy = testHelper.applySetEditSpy;
    //     vsCodeProperties = testHelper.vsCodeProperties;

    //     applySetEditSpy = sinon.spy(function () {
    //         return {
    //             then: function (callback) {
    //                 callback()
    //             }
    //         };
    //     });

    //     quickPickSpy = sinon.spy(function (selectionItems, options, callback) {
    //         let selection = selectionItems[setupOptions.selectedScopeIndex];
    //         selection = typeof selection === 'undefined' ? selectionItems[0] : selection;
    //         callback(selection);
    //     });

    //     mocker.getMock('logger').api.quickPick = quickPickSpy;
    //     mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;
    // });

    function buildFakeMessageLogger() {
        return {
            info: sinon.stub()
        };
    }

    function buildFakeUserInputModule(selectedIndex) {
        return {
            showQuickPick: sinon.spy(function(choices, _quickPickOptions) {
                return Promise.resolve(choices[selectedIndex]);
            })
        }
    }

    function buildFakeVsCodeFactory(selections, sourceTokens) {
        const vsCodeProperties = {
            activeTextEditor: motherContainer.buildData('activeTextEditor')
        };

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        return mocker.getMock('vscodeFactory').mock(vsCodeProperties);
    }

    function buildExtractVariableFactory(
        vsCodeFactoryFake,
        {
            fakeMessageLogger = null,
            userInput = null
        }
    ) {
        const testContainer = container.new();

        testContainer.register(() => fakeMessageLogger, 'messageLogger');
        testContainer.register(() => userInput, 'userInput');
        testContainer.register(vsCodeFactoryFake);

        return testContainer.build('extractVariableFactory');
    }

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        var selections = [
            selectionBuilder.buildSelection([
                [0, 0],
                [0, 0]
            ])
        ];

        const vsCodeFactoryFake = buildFakeVsCodeFactory(selections, sourceTokens);
        const fakeMessageLogger = buildFakeMessageLogger();
        const extractVariableFactory = buildExtractVariableFactory(
            vsCodeFactoryFake,
            { fakeMessageLogger }
        );

        const extractVariable = extractVariableFactory(() => null);

        extractVariable();

        this.verify(prettyJson(fakeMessageLogger.info.args));
    });

    it('should extract variable when selection is a single-line value', function () {
        const sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        const quickPickSelectedIndex = 1;

        const selections = [
            selectionBuilder.buildSelection([
                [11, 21],
                [11, 26]
            ])
        ];

        const vsCodeFactoryFake = buildFakeVsCodeFactory(selections, sourceTokens);
        const userInputModule = buildFakeUserInputModule(quickPickSelectedIndex);
        const extractVariableFactory = buildExtractVariableFactory(
            vsCodeFactoryFake,
            { userInputModule }
        );

        const extractVariable = extractVariableFactory(() => null);

        extractVariable();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it.skip('should extract multiline variable to the local scope', function () {
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

    it.skip('should extract multiline variable to a function scope', function () {
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

    it.skip('should extract multiline variable to an object scope', function () {
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

    it.skip('should extract multiline variable to the program scope', function () {
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

    it.skip('should adjust for terminating semicolon', function () {
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


    it.skip('should extract variable within a method on a class', function () {
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