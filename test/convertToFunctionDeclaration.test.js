let mocker = require('./mocker');

let testHelperFactory = require('./test-utils/testHelperFactory');
let motherContainer = require('./test-utils/mother-container');

let readSource = require('./test-utils/read-source');
let prettyJson = require('./test-utils/test-utils').prettyJson;

let approvalsConfig = require('./test-utils/approvalsConfig');
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

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [4, 9],
                    end: [4, 9]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const infoAction = mocker.getMock('logger').api.info;
        const convertToFunctionDeclaration = subcontainer.build('convertToFunctionDeclarationFactory');

        const callback = () => null;

        convertToFunctionDeclaration(callback)();

        this.verify(prettyJson(infoAction.args));
    });

    it('should convert a declaration with function expression assignment to a function declaration', function () {
        var sourceTokens = readSource('./test/fixtures/convertToFunctionDeclaration/convertToFunctionDeclaration.js');

        const activeTextEditorOptions = {
            optionsData: {
                lines: sourceTokens,
                selection: {
                    start: [0, 9],
                    end: [0, 9]
                }
            }
        };

        const activeTextEditor = motherContainer.buildData('activeTextEditor', activeTextEditorOptions);
        vsCodeProperties.activeTextEditor = activeTextEditor;

        const convertToFunctionDeclaration = subcontainer.build('convertToFunctionDeclarationFactory');

        const callback = () => null;

        convertToFunctionDeclaration(callback)();

        this.verify(prettyJson(applySetEditSpy.args));
    });

});