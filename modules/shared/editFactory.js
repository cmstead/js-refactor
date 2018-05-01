'use strict';

function editFactory(editApiFactory) {

    const setEditFactory = (editApi) => (uri, edits) => {
        var edit = editApi.workspaceEditFactory();

        edit.set(uri, edits);

        return edit;
    }

    function buildSetEdit(uri, coords, text) {
        const editApi = editApiFactory();

        var textEdit = editApi.textEditFactory(coords, text);
        return setEditFactory(editApi)(uri, [textEdit]);
    }

    return {
        buildSetEdit: buildSetEdit
    };
}

module.exports = editFactory;