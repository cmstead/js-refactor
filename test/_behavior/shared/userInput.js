const container = require('../../../container');
const vsCodeFake = require('../fakes/vscode-fake');

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
        it('it passes arguments to the core VS Code showQuickPick method', function () {
            
        });
    });
});
