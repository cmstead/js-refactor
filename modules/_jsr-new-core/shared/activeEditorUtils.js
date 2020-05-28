function activeEditorUtils(
    types,
    vscodeFactory
) {

    function create() {
        const activeTextEditor = vscodeFactory.get().window.activeTextEditor;

        function getSelectionCoords() {
            return activeTextEditor._selections[0];
        }

        function getSourceLines() {
            return activeTextEditor._documentData._lines;
        }

        return {
            getSelectionCoords: types.enforce(
                '() => editorLocation',
                getSelectionCoords
            ),
            getSourceLines: types.enforce(
                '() => array<string>',
                getSourceLines
            )
        };
    }

    return {
        create
    };
}

module.exports = activeEditorUtils;