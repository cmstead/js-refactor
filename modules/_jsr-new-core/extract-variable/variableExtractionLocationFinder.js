function variableExtractionLocationFinder(
    estraverse,
    nodeTypeMap,
    nodeUtils
) {

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

    function buildMatchPath(parentNode, childLocation) {

        let matchPath = [];

        estraverse.traverse(parentNode, {
            enter: function (node) {
                const nodeContainsChild = nodeUtils
                    .doesNodeContainCoords(node.loc, childLocation);

                if (!nodeContainsChild) {
                    return this.skip;
                } else {
                    matchPath.push(node);
                }
            }
        });

        return matchPath;
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
        const matchPath = buildMatchPath(parentNode, childLocation);
        let extractionNode = matchPath.pop();

        while (matchPath.length > 0 && !isAcceptableExtractionPoint(extractionNode, last(matchPath))) {
            extractionNode = matchPath.pop();
        }

        return {
            start: extractionNode.loc.start,
            end: extractionNode.loc.start
        };
    }

    return {
        getExtractionLocation
    };
}

module.exports = variableExtractionLocationFinder;