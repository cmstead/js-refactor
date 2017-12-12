'use strict';

function addExportFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionExportHelper,
    selectionExpressionHelper,
    templateHelper,
    utilities,
    vsCodeFactory) {

    return function (_, callback) {

        function getSelectionEditorCoords(activeEditor) {
            const firstSelectionCoords = utilities.getAllSelectionCoords(activeEditor)[0];
            return coordsHelper.coordsFromDocumentToEditor(firstSelectionCoords);
        }

        function exportSelectedNode(activeEditor, astNode, ast) {
            const editActions = editActionsFactory(activeEditor);
            
            const exportName = astNode.id.name;

            // const exportNode = selectionExportHelper.getExportNode(ast);

            const exportLocation = coordsHelper.coordsFromAstToEditor(ast.loc).end;
            const exportEditorCoords = {
                start: exportLocation,
                end: exportLocation
            };

            const exportContext = {
                name: exportName
            };

            const exportStr = templateHelper.templates.newExport.build(exportContext);

            editActions.applySetEdit(exportStr, exportEditorCoords, function () {
                callback();s
            });
        }

        return function () {
            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const selectionEditorCoords = getSelectionEditorCoords(activeEditor);
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = utilities.getDocumentLines(activeEditor);
            const ast = parser.parseSourceLines(sourceLines);

            const selectedExportValue = selectionExpressionHelper.getNearestFunctionOrVariable(selectionAstCoords, ast);

            if(selectedExportValue === null) {
                logger.info('Cannot export a value which is not a function or variable declaration.');
                callback();
            } else {
                exportSelectedNode(activeEditor, selectedExportValue, ast);
            }

        }
    };
}

module.exports = addExportFactory;