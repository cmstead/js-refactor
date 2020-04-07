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

describe('Inline Variable', function () {
    var subcontainer;
    var applySetEditSpy;
    var vsCodeProperties;

    beforeEach(function () {
        var testHelper = testHelperFactory();

        subcontainer = testHelper.subcontainer;
        applySetEditSpy = testHelper.applySetEditSpy;
        vsCodeProperties = testHelper.vsCodeProperties;

        applySetEditSpy = sinon.spy(function (text, coords) {
            return {
                then: function (callback) {
                    callback();
                }
            };
        });

        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;
    });

    // I think this test is wrong.
    it.skip('should log an error if selection is not an identifier or variable declaration', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');

        vsCodeProperties.activeTextEditor = {
            _documentData: {
                _lines: sourceTokens,
                _selections: [
                    {
                        _start: {
                            _line: 4,
                            _column: 10
                        },
                        _end: {
                            _line: 4,
                            _column: 10
                        }
                    }
                ]
            }
        };

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should log an error if variable is not assigned', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var selections = [
            selectionBuilder.buildSelection([
                [11, 9],
                [11, 9]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should inline variable when selection is okay', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var selections = [
            selectionBuilder.buildSelection([
                [12, 10],
                [12, 10]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('inlineVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should inline from selected non-assignment identifier', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var selections = [
            selectionBuilder.buildSelection([
                [13, 21],
                [13, 25]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('inlineVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should inline from selected non-assignment identifier inside of another variable declaration', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var selections = [
            selectionBuilder.buildSelection([
                [14, 24],
                [14, 28]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('inlineVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should inline correctly when identifiers share a common name in different contexts', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var selections = [
            selectionBuilder.buildSelection([
                [19, 8],
                [19, 9]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('inlineVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should inline correctly when identifier is inside parentheses', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var selections = [
            selectionBuilder.buildSelection([
                [27, 12],
                [27, 12]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('inlineVariableFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it.skip('should inline variable from comma-separated variable list', function () {
        // I don't even know what this is going to look like yet.
    });

});