'use strict';

var mocker = require('../mocker');

var testHelperFactory = require('../test-utils/testHelperFactory');

var readSource = require('../test-utils/read-source');
var prettyJson = require('../test-utils/test-utils').prettyJson;

const selectionBuilder = require('../test-utils/selectionBuilder');
const activeEditorUpdater = require('../test-utils/activeEditorUpdater');

var approvalsConfig = require('../test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert to Function Expression', function () {
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
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');
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
        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should log an error if selection is invalid', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [0, 0],
                [0, 13]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should convert an arrow function with no arguments to a function expression', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [2, 22],
                [2, 22]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert arrow function declaration with arguments to anonymous function expression', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [4, 27],
                [4, 27]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('converts multiline arrow function to function expression', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionExpression/convertToFunctionExpression.js');
        var selections = [
            selectionBuilder.buildSelection([
                [6, 34],
                [6, 34]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });


    it('converts an arrow function with no parameters to a function expression', function () {
        const sourceExpression = '() => console.log("hi");';

        var sourceTokens = sourceExpression.split(/\r?\n/);
        var selections = [
            selectionBuilder.buildSelection([
                [0, 5],
                [0, 5]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToFunctionExpressionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });


});