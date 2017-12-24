'use strict';

function addExportFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionExportHelper,
    selectionExpressionHelper,
    templateHelper,
    vsCodeHelperFactory
) {

    return function (callback) {

        const vsCodeHelper = vsCodeHelperFactory();

        function buildExportTemplateKey(exportNode) {
            if (exportNode === null) {
                return 'newExport';
            } else if (selectionExportHelper.isMultilineExport(exportNode.expression.left, exportNode.expression.right)) {
                return 'mulitilineExport';
            } else {
                return 'oneLineExport';
            }
        }

        function buildMultilineExportLocation(exportNode) {
            let exportLocation = coordsHelper.coordsFromAstToEditor(exportNode.expression.right.loc).start;
            exportLocation[1] += 1;
            return exportLocation;
        }

        function buildExportLocation(exportNode, ast) {
            if (exportNode === null) {
                return coordsHelper.coordsFromAstToEditor(ast.loc).end;
            } else if (selectionExportHelper.isMultilineExport(exportNode.expression.left, exportNode.expression.right)) {
                return buildMultilineExportLocation(exportNode);
            } else {
                return coordsHelper.coordsFromAstToEditor(exportNode.loc).end;
            }
        }

        function buildExportContext(exportName) {
            return {
                name: exportName
            };
        }

        function buildExportCoords(exportNode, ast) {
            const exportLocation = buildExportLocation(exportNode, ast);

            return {
                start: exportLocation,
                end: exportLocation
            };
        }

        function buildExportString(exportName, exportNode) {
            const exportContext = buildExportContext(exportName);
            const exportTemplateKey = buildExportTemplateKey(exportNode);

            return templateHelper.templates[exportTemplateKey].build(exportContext);
        }

        function exportSelectedNode(activeEditor, astNode, ast) {
            const exportNode = selectionExportHelper.getExportNode(ast);
            
            const exportStr = buildExportString(astNode.id.name, exportNode);
            const exportEditorCoords = buildExportCoords(exportNode, ast);

            editActionsFactory(activeEditor)
                .applySetEdit(exportStr, exportEditorCoords)
                .then(callback);
        }

        return function () {
            const activeEditor = vsCodeHelper.getActiveEditor();
            const sourceLines = vsCodeHelper.getSourceLines();

            const selectionEditorCoords = vsCodeHelper.getSelectionCoords();
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const ast = parser.parseSourceLines(sourceLines);

            const selectedExportValue = selectionExpressionHelper.getNearestFunctionOrVariable(selectionAstCoords, ast);

            if (selectedExportValue === null) {
                logger.info('Cannot export a value which is not a function or variable declaration.');
            } else {
                exportSelectedNode(activeEditor, selectedExportValue, ast);
            }

        }
    };
}

module.exports = addExportFactory;