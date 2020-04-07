'use strict';

var mocker = require('../mocker');

var testHelperFactory = require('../test-utils/testHelperFactory');

var readSource = require('../test-utils/read-source');
var prettyJson = require('../test-utils/test-utils').prettyJson;

const selectionBuilder = require('../test-utils/selectionBuilder');
const activeEditorUpdater = require('../test-utils/activeEditorUpdater');

var approvalsConfig = require('../test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Convert to Arrow Function', function () {
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
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');
        var selections = [
            selectionBuilder.buildSelection([
                [0, 0],
                [0, 0]            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should log an error if selection is invalid', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');
        var selections = [
            selectionBuilder.buildSelection([
                [0, 0],
                [0, 13]            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(info.args));

    });

    it('should convert named function declaration with to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');
        var selections = [
            selectionBuilder.buildSelection([
                [6, 14],
                [6, 14]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert anonymous function declaration to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');
        var selections = [
            selectionBuilder.buildSelection([
                [15, 27],
                [15, 27]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert named one-line function declaration with to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');
        var selections = [
            selectionBuilder.buildSelection([
                [11, 14],
                [11, 14]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert anonymous one-line function declaration with to arrow function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');
        var selections = [
            selectionBuilder.buildSelection([
                [2, 33],
                [2, 33]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert the only function in a file to an arrow function', function () {
        var source = `function hi() {
            console.log('hi');
          }`;
        var sourceTokens = source.split(/\r?\n/);
        var selections = [
            selectionBuilder.buildSelection([
                [1, 5],
                [1, 5]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should remove trailing semi-colons from single-line arrow functions', function () {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');
        var selections = [
            selectionBuilder.buildSelection([
                [20, 15],
                [20, 15]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should enclose complex 1-line expressions in curly braces', function() {
        var sourceTokens = readSource('./test/fixtures/convertToArrowFunction/convertToArrowFunction.js');
        var selections = [
            selectionBuilder.buildSelection([
                [24, 15],
                [24, 15]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        subcontainer.build('convertToArrowFunctionFactory')(function () { })();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});