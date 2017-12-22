'use strict';

function convertToTemplateLiteralFactory(
    coordsHelper,
    editActionsFactory,
    logger,
    parser,
    selectionCoordsHelper,
    selectionExpressionHelper,
    selectionHelper,
    utilities,
    vsCodeFactory
) {

    return function (callback) {

        function buildExpressionValue(node, sourceLines) {
            const expressionEditorCoords = coordsHelper.coordsFromAstToEditor(node.loc);
            return '${' + selectionHelper.getSelection(sourceLines, expressionEditorCoords) + '}';
        }

        function buildNodeValue(node, sourceLines) {
            return node.type === 'Literal' ? node.value : buildExpressionValue(node, sourceLines);
        }

        function buildNodeOrRecur(node, sourceLines) {
            return node.type === 'BinaryExpression'
                ? buildTemplateLiteral(node, sourceLines)
                : buildNodeValue(node, sourceLines);
        }

        function buildTemplateLiteral(binaryExpressionNode, sourceLines) {
            const leftNode = binaryExpressionNode.left;
            const rightNode = binaryExpressionNode.right;

            const left = buildNodeOrRecur(leftNode, sourceLines);
            const right = buildNodeOrRecur(rightNode, sourceLines);

            return left + right;
        }

        function checkNodeProperties(node) {
            return node.type === 'BinaryExpression'
                ? doBinaryExpressionCheck(node)
                : {
                    operatorOk: true,
                    hasStringLiteral: node.type === 'Literal' && typeof node.value === 'string'
                };
        }

        function doBinaryExpressionCheck(binaryExpression) {
            const operatorOk = binaryExpression.operator === '+';

            const leftResult = checkNodeProperties(binaryExpression.left);
            const rightResult = checkNodeProperties(binaryExpression.right);

            const operatorsAreOk = operatorOk && leftResult.operatorOk && rightResult.operatorOk;
            const hasStringLiteral = leftResult.hasStringLiteral || rightResult.hasStringLiteral;

            return {
                operatorOk: operatorsAreOk,
                hasStringLiteral: hasStringLiteral
            }
        }

        function buildDefaultFailingCheck() {
            return {
                operatorOk: false,
                hasStringLiteral: false
            };
        }

        function checkBinaryExpression(binaryExpression) {
            return binaryExpression !== null ? doBinaryExpressionCheck(binaryExpression) : buildDefaultFailingCheck();
        }

        function applyTemplateRefactor(selectedStringNode, sourceLines, editActions) {
            const constructedString = '`' + buildTemplateLiteral(selectedStringNode, sourceLines) + '`';
            const selectedStringEditorCoords = coordsHelper.coordsFromAstToEditor(selectedStringNode.loc);

            editActions.applySetEdit(constructedString, selectedStringEditorCoords).then(callback);
        }

        return function () {

            const activeEditor = vsCodeFactory.get().window.activeTextEditor;
            const editActions = editActionsFactory(activeEditor);

            const selectionEditorCoords = selectionCoordsHelper.getSelectionEditorCoords(activeEditor);
            const selectionAstCoords = coordsHelper.coordsFromEditorToAst(selectionEditorCoords);

            const sourceLines = utilities.getDocumentLines(activeEditor);
            const ast = parser.parseSourceLines(sourceLines);

            const selectedStringNode = selectionExpressionHelper.getNearestStringNode(selectionAstCoords, ast);
            const { operatorOk, hasStringLiteral } = checkBinaryExpression(selectedStringNode);

            if (selectedStringNode === null || !operatorOk || !hasStringLiteral) {
                logger.info('No appropriate string concatenation to convert to template literal');
            } else {
                applyTemplateRefactor(selectedStringNode, sourceLines, editActions)
            }
        }

    }

}

module.exports = convertToTemplateLiteralFactory;