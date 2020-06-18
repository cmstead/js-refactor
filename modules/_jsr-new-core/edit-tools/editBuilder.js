function editBuilder(
    editApiBuilder,
    types
) {

    function buildTextEdit(coords, content) {
        const editApi = editApiBuilder.getNewEditApi();

        const startPosition = editApi.getEditPosition(coords._start);
        const endPosition = editApi.getEditPosition(coords._end);
        const range = editApi.getEditRange(startPosition, endPosition);

        return editApi.getTextEdit(range, content);
    }

    return {
        buildTextEdit: types.enforce(
            'coords: editorLocation, content: string => object',
            buildTextEdit
        )
    };
}

module.exports = editBuilder;