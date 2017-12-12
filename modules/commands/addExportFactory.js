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

            const exportNode = selectionExportHelper.getExportNode(ast);

            let exportLocation = exportNode !== null
                ? coordsHelper.coordsFromAstToEditor(exportNode.loc).end
                : coordsHelper.coordsFromAstToEditor(ast.loc).end;

            let exportTemplateKey;

            if(exportNode === null) {
                exportTemplateKey = 'newExport';
                exportLocation = coordsHelper.coordsFromAstToEditor(ast.loc).end;
            } else if(selectionExportHelper.isMultilineExport(exportNode.expression.left, exportNode.expression.right)) {
                exportTemplateKey = 'mulitilineExport';
                exportLocation = coordsHelper.coordsFromAstToEditor(exportNode.expression.right.loc).start;
                exportLocation[1] += 1;
            } else {
                exportTemplateKey = 'oneLineExport';
                exportLocation = coordsHelper.coordsFromAstToEditor(exportNode.loc).end;
            }

            const exportEditorCoords = {
                start: exportLocation,
                end: exportLocation
            };

            const exportContext = {
                name: exportName
            };

            const exportStr = templateHelper.templates[exportTemplateKey].build(exportContext);

            editActions.applySetEdit(exportStr, exportEditorCoords, function () {
                callback();
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
