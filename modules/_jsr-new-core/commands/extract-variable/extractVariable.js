function extractVariable(
    activeEditorUtils,
    astNodeUtils,
    editActions,
    locationUtils,
    messageLogger
) {


    /*
    * Things we need to do
    *
    * 1. Check that something is selected
    *   a. if selection, continue
    *   b. (done) if no selection, alert (display error) and quit
    * 2. Get the entire document as source lines
    * 3. Get extraction scope options
    * 4. Select extraction scope to use
    * 5. Get placement position
    * 6. Get variable declaration type (var, let, const)
    * 7. Get variable content (selection from source)
    * 8. Create variable code string
    * 9. Replace original selection with variable name
    * 10. Insert variable code string
    */

    function isEmptySelection(selectionCoordinates) {
        const selectionAstCoordinates = locationUtils
            .convertToAstLocation(selectionCoordinates);
        
        return locationUtils.isLocationAnEmptySelection(selectionAstCoordinates);
    }

    function extract() {
        const activeEditor = activeEditorUtils.create();
        const selectionEditorCoordinates = activeEditor.getSelectionCoords();

        if(isEmptySelection(selectionEditorCoordinates)) {
            messageLogger.info('Cannot extract an empty selection to a variable');
        }
    }

    return {
        extract
    };
}

module.exports = extractVariable;