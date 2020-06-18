function editApiBuilder(
    types,
    vscodeFactory
) {

    function getNewEditApi() {

        const vscode = vscodeFactory.get();

        function getEditPosition(editorPosition) {
            return new vscode.Position(editorPosition._line, editorPosition._character);
        }

        function getEditRange(start, end) {
            return new vscode.Range(start, end);
        }

        function getTextEdit(editRange, content) {
            return new vscode.TextEdit(editRange, content);
        }

        function getWorkspaceEdit() {
            return new vscode.WorkspaceEdit();
        }

        return {
            getEditPosition: types.enforce(
                'editorPosition => editPosition',
                getEditPosition
            ),
            getEditRange: types.enforce(
                'start: editPosition, end: editPosition => editRange',
                getEditRange
            ),
            getTextEdit: types.enforce(
                'editRange, content: string => textEdit',
                getTextEdit
            ),
            getWorkspaceEdit: types.enforce(
                '() => workspaceEdit',
                getWorkspaceEdit
            )
        };

    }

    return {
        getNewEditApi
    };
}

module.exports = editApiBuilder;