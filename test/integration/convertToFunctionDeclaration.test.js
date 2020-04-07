let mocker = require('../mocker');

let testHelperFactory = require('../test-utils/testHelperFactory');

let readSource = require('../test-utils/read-source');
let prettyJson = require('../test-utils/test-utils').prettyJson;

const selectionBuilder = require('../test-utils/selectionBuilder');
const activeEditorUpdater = require('../test-utils/activeEditorUpdater');

let approvalsConfig = require('../test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

let sinon = require('sinon');

describe('convertToFunctionDeclarationFactory', function () {
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

    it('should log an error if variable declaration with function assigned cannot be found', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionDeclaration/convertToFunctionDeclaration.js');
        var selections = [
            selectionBuilder.buildSelection([
                [4, 9],
                [4, 9]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const infoAction = mocker.getMock('logger').api.info;
        const convertToFunctionDeclaration = subcontainer.build('convertToFunctionDeclarationFactory');
        const callback = () => null;

        convertToFunctionDeclaration(callback)();

        this.verify(prettyJson(infoAction.args));
    });

    it('should convert a declaration with function expression assignment to a function declaration', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionDeclaration/convertToFunctionDeclaration.js');
        var selections = [
            selectionBuilder.buildSelection([
                [0, 9],
                [0, 9]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const convertToFunctionDeclaration = subcontainer.build('convertToFunctionDeclarationFactory');
        const callback = () => null;

        convertToFunctionDeclaration(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});