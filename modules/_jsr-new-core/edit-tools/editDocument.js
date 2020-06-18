function editDocument(
    editApiBuilder,
    editBuilder,
    types
) {

    function createSetEdit(uri, edits) {
        const editApi = editApiBuilder.getNewEditApi();
        const workspaceEdit = editApi.getWorkspaceEdit();

        workspaceEdit.set(uri, edits);

        return workspaceEdit;
    }

    function buildSetEdit(uri, coords, text) {
        var textEdit = editBuilder.buildTextEdit(coords, text);

        return createSetEdit(uri, [textEdit]);
    }

    return {
        buildSetEdit: types.enforce(
            'uri: object, editorLocation, content: string => object',
            buildSetEdit
        )
    };

}

module.exports = editDocument;