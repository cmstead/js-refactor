function activeEditorUtils(
    vscodeFactory
) {

    function create () {
        const vscodeInstance = vscodeFactory.get();

        function getSelectionCoords() {
            return vscodeInstance.window.activeTextEditor._selections[0];
        }
    
        return {
            getSelectionCoords
        };    
    }

    return {
        create
    };
}

module.exports = activeEditorUtils;