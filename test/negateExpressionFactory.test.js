'use strict';

var mocker = require('./mocker');

var testHelperFactory = require('./test-utils/testHelperFactory');

var readSource = require('./test-utils/read-source');
var prettyJson = require('./test-utils/test-utils').prettyJson;

const selectionBuilder = require('./test-utils/selectionBuilder');
const activeEditorUpdater = require('./test-utils/activeEditorUpdater');

var approvalsConfig = require('./test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

var sinon = require('sinon');

describe('Negate Condition', function () {

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

                }
            };
        });

        mocker.getMock('editActionsFactory').api.applySetEdit = applySetEditSpy;
    });

    it('should log an error if conditional cannot be found', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
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
        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(info.args));
    });

    it('should negate a single value', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [3, 8],
                [3, 8]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate negated value', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [4, 7],
                [4, 11]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate multiple values', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [5, 7],
                [5, 17]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate multiple values in parentheses', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [6, 7],
                [6, 19]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate negated values in parentheses', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [7, 7],
                [7, 28]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate un-grouped values with first value negated', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [8, 7],
                [8, 18]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate un-grouped, individually grouped values with first value negated', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [9, 7],
                [9, 22]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('negateExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });



});


