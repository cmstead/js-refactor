function editActions(
    editDocument,
    types,
    vscodeFactory
) {

    function getEditApplicationApi() {
        const vsCodeInstance = vscodeFactory.get();

        const activeEditor = vsCodeInstance.window.activeTextEditor;
        const currentWorkspace = vsCodeInstance.workspace;

        function applyEdit(edit) {
            return currentWorkspace.applyEdit(edit);
        }

        function usesOldDocumentKey() {
            return typeof activeEditor._document === 'object';
        }

        function getEditorDocument() {
            const documentKey = usesOldDocumentKey() 
                ? '_document'
                : '_documentData';

            return activeEditor[documentKey];
        }

        function getUri() {
            return getEditorDocument()._uri;
        }

        return {
            applyEdit,
            getUri
        };
    }

    function applySetEdit(coords, content) {
        const { getUri, applyEdit } = getEditApplicationApi();

        const documentUri = getUri();

        var textEdit = editDocument.buildSetEdit(documentUri, coords, content);

        return applyEdit(textEdit);
    }

    return {
        applySetEdit: types.enforce(
            'editorLocation, content: string => promise',
            applySetEdit
        )
    };

}

module.exports = editActions;