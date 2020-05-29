const container = require('../../../container');
const vsCodeFake = require('../fakes/vscode-fake');
const { assert } = require('chai');

describe('User Input Tooling', function () {
    function getUserInputModule(vsCodeInstance) {
        const testContainer = container.new();

        function vsCodeFactoryFake() {
            return {
                get: () => vsCodeInstance
            }
        }

        testContainer.register(vsCodeFactoryFake, 'vscodeFactory');

        return testContainer.build('userInput');
    }

    describe('Show Quick Pick', function () {
        it('passes arguments to the core VS Code showQuickPick method', function () {
            const vsCodeFakeInstance = vsCodeFake.buildFake();
            vsCodeFakeInstance.window.showQuickPick.returns(Promise.resolve('okay'));

            const userInput = getUserInputModule(vsCodeFakeInstance);

            const expectedChoices = ['test1', 'test2'];
            const expectedOptions = userInput.getBaseQuickPickOptions('Choose a test string');

            userInput.showQuickPick(expectedChoices, expectedOptions);

            assert.equal(vsCodeFakeInstance.window.showQuickPick.args[0][0], expectedChoices);
            assert.equal(vsCodeFakeInstance.window.showQuickPick.args[0][1], expectedOptions);
        });

        it('fails when selected value is invalid', function () {
            const vsCodeFakeInstance = vsCodeFake.buildFake();
            vsCodeFakeInstance.window.showQuickPick.returns(Promise.resolve(true));

            const userInput = getUserInputModule(vsCodeFakeInstance);

            const expectedChoices = ['test1', 'test2'];
            const expectedOptions = userInput.getBaseQuickPickOptions('Choose a test string');

            return userInput
                .showQuickPick(expectedChoices, expectedOptions)
                .catch(function(error) {
                    assert.equal(error.message, 'Invalid selection value: "true", type: "boolean"');
                });
        });
    });
});
