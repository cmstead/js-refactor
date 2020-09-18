function extractVariable(
    activeEditorUtils,
    astNodeUtils,
    editActions,
    extractVariableOptionsBuilder,
    locationUtils,
    messageLogger,
    parser,
    userInput,
    variableExtractionLocationFinder,
    variableExtractionScopeFinder
) {

    /*
    * Things we need to do
    *
    * [X] 1. Check that something is selected
    *   a. if selection, continue
    *   b. (done) if no selection, alert (display error) and quit
    * [X] 2. Get the entire document as source lines
    * [X] 3. Get extraction scope options
    * [ ] 4. Select extraction scope to use
    * [ ] 5. Get placement position
    * [ ] 6. Get variable declaration type (var, let, const)
    * [ ] 7. Get variable content (selection from source)
    * [ ] 8. Create variable code string
    * [ ] 9. Replace original selection with variable name
    * [ ] 10. Insert variable code string
    */

    function isEmptySelection(selectionAstCoordinates) {
        return locationUtils.isLocationAnEmptySelection(selectionAstCoordinates);
    }

    function getSelectedScope({
        sourceLines,
        astLocationCoordinates
    }) {
        const parsedDocument = parser.parseSourceLines(sourceLines);

        const extractionScopePath = variableExtractionScopeFinder
            .findScopePath(astLocationCoordinates, parsedDocument);
        const extractionScopeNodes = [parsedDocument].concat(extractionScopePath);
        const extractionScopeOptions = extractVariableOptionsBuilder
            .getScopeOptions(extractionScopeNodes, sourceLines);

        extractionScopeOptions[0] = '0: Document';

        const quickPickOptions = userInput.getBaseQuickPickOptions('Extract variable to where?');

        return userInput
            .showQuickPick(extractionScopeOptions, quickPickOptions)
            .then(function (selectedValue) {
                const selectedIndex = selectedValue.split(':')[0];
                return extractionScopeNodes[selectedIndex];
            });
    }

    function getSourceDataIfValid() {
        return new Promise(function (resolve, reject) {
            const activeEditor = activeEditorUtils.create();
            const selectionCoordinates = activeEditor.getSelectionCoords();
            const astLocationCoordinates = locationUtils.convertToAstLocation(selectionCoordinates)
            const sourceLines = activeEditor.getSourceLines();

            if (isEmptySelection(astLocationCoordinates)) {
                reject(new Error('Cannot extract an empty selection to a variable'));
            } else {
                resolve({
                    astLocationCoordinates,
                    sourceLines
                });
            }
        });
    }

    function extract() {
        getSourceDataIfValid()
            .then(function ({ sourceLines, astLocationCoordinates }) {
                return getSelectedScope({ sourceLines, astLocationCoordinates });
            })
            .then(function (selectedScope) {
                console.log(selectedScope);
            })
            .catch(function (error) {
                messageLogger.info(error.message);
            });
    }

    return extract;
}

module.exports = extractVariable;