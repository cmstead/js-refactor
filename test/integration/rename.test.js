let mocker = require('../mocker');

let testHelperFactory = require('../test-utils/testHelperFactory');

let readSource = require('../test-utils/read-source');
let prettyJson = require('../test-utils/test-utils').prettyJson;

const selectionBuilder = require('../test-utils/selectionBuilder');
const activeEditorUpdater = require('../test-utils/activeEditorUpdater');

let approvalsConfig = require('../test-utils/approvalsConfig');
require('approvals').configure(approvalsConfig).mocha('./test/approvals');

let sinon = require('sinon');

describe('renameFactory', function () {
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

    it('should log an error if no identifier can be found to rename', function () {
        var sourceTokens = readSource('./test/fixtures/rename/rename.js');
        var selections = [
            selectionBuilder.buildSelection([
                [5, 20],
                [5, 20]
            ])
        ];

        activeEditorUpdater.updateActiveEditor(
            vsCodeProperties.activeTextEditor,
            selections,
            sourceTokens
        );

        const infoAction = mocker.getMock('logger').api.info;
        const markAsAsyncFactory = subcontainer.build('renameFactory');

        const callback = () => null;

        markAsAsyncFactory(callback)();

        this.verify(prettyJson(infoAction.args));
    });

});