var vsCodeFakeFactory = require('../test-utils/vscode-fake-factory');

function vsCodeFactoryFakeFactory(api) {

    return function (properties) {
        function get() {
            var activeTextEditorOverrides = properties.activeTextEditor;
            var vsCodeFake = vsCodeFakeFactory();

            Object.keys(activeTextEditorOverrides).forEach(function (key) {
                vsCodeFake.window.activeTextEditor[key] = activeTextEditorOverrides[key];
            });

            return vsCodeFake;
        }

        return function vsCodeFactory() {
            return {
                get: get
            };
        }
    }
}

module.exports = vsCodeFactoryFakeFactory;