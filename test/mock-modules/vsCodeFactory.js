var vsCodeFakeFactory = require('../test-utils/vscode-fake-factory');

function vscodeFactoryFakeFactory(api) {

    return function (properties) {
        function get() {
            var activeTextEditorOverrides = properties.activeTextEditor;
            var vsCodeFake = vsCodeFakeFactory();

            Object.keys(activeTextEditorOverrides).forEach(function (key) {
                vsCodeFake.window.activeTextEditor[key] = activeTextEditorOverrides[key];
            });

            return vsCodeFake;
        }

        return function vscodeFactory() {
            return {
                get: get
            };
        }
    }
}

module.exports = vscodeFactoryFakeFactory;