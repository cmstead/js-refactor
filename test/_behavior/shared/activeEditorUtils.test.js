const container = require('../../../container');
const prettyJson = require('../test-utils/prettyJson');
const vsCodeFake = require('../fakes/vscode-fake');
const approvals = require('../test-utils/approvals');

approvals.init();

describe('Active Editor Utility Functions', function () {

    function getActiveEditorUtils(vscodeFakeInstance) {
        const testContainer = container.new();

        function vscodeFactoryFake() {
            return {
                get: () => vscodeFakeInstance
            }
        }

        testContainer.register(vscodeFactoryFake, 'vscodeFactory');

        return testContainer.build('activeEditorUtils').create();
    }

    describe('get document selection coordinates from active editor', function () {

        it('returns first selection coordinates object from the **current** active editor', function () {
            let vscodeFakeInstance = vsCodeFake.buildFake();
            const activeEditorUtils = getActiveEditorUtils(vscodeFakeInstance);

            const expectedSelection = {
                _start: {
                    _line: 1,
                    _character: 2
                },
                _end: {
                    _line: 3,
                    _character: 4
                }
            };

            vsCodeFake.addSelection(vscodeFakeInstance, expectedSelection);

            const selectionCoordinates = activeEditorUtils.getSelectionCoords();


            this.verify(prettyJson(selectionCoordinates));
        });

    });

});