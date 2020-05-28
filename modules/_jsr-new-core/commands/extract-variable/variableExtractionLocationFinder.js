function variableExtractionLocationFinder(
    estraverse,
    nodeTypeMap,
    astNodeUtils,
    types
) {

    const { doesNodeContainCoords } = astNodeUtils;
    const extractionPoints = [
        nodeTypeMap.ASSIGNMENT_EXPRESSION,
        nodeTypeMap.CALL_EXPRESSION,
        nodeTypeMap.IF_STATEMENT,
        nodeTypeMap.FUNCTION_DECLARATION,
        nodeTypeMap.PROPERTY,
        nodeTypeMap.RETURN_STATEMENT,
        nodeTypeMap.VARIABLE_DECLARATION
    ];

    const unsafeWrappers = extractionPoints.concat([
        nodeTypeMap.VARIABLE_DECLARATOR
    ]);

    function testAndCaptureNodes(captureNode, childLocation) {
        return function (node) {
            const nodeContainsCoords = doesNodeContainCoords(node.loc, childLocation);
            const action = nodeContainsCoords ? captureNode : () => this.skip();

            action(node);
        }
    }

    function buildExtractionPath(parentNode, childLocation) {

        let extractionPath = [];
        const captureNode = (node) => extractionPath.push(node)

        estraverse.traverse(parentNode, {
            enter: testAndCaptureNodes(captureNode, childLocation)
        });

        return extractionPath;
    }

    function isNotArrowExpressionOrIsMultiline(node) {
        return node.type !== nodeTypeMap.ARROW_FUNCTION_EXPRESSION
            || node.body.type === nodeTypeMap.BLOCK_STATEMENT
    }

    function isAcceptableExtractionPoint(node, parent) {
        return extractionPoints.includes(node.type)
            && !unsafeWrappers.includes(parent.type)
            && isNotArrowExpressionOrIsMultiline(parent);
    }

    const last = values => values[values.length - 1];

    function getExtractionLocation(parentNode, childLocation) {
        const extractionPath = buildExtractionPath(parentNode, childLocation);
        let extractionNode = extractionPath.pop();

        while (extractionPath.length > 0 && !isAcceptableExtractionPoint(extractionNode, last(extractionPath))) {
            extractionNode = extractionPath.pop();
        }

        return {
            start: extractionNode.loc.start,
            end: extractionNode.loc.start
        };
    }

    return {
        getExtractionLocation: types.enforce(
            'astNode, astLocation => astLocation',
            getExtractionLocation
        )
    };
}

module.exports = variableExtractionLocationFinder;