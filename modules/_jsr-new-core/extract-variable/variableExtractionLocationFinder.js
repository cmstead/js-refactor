function variableExtractionLocationFinder(
    estraverse,
    nodeUtils
) {

    const last = values => values[values.length - 1];

    function buildMatchPath(parentNode, childLocation) {

        let matchPath = [];

        estraverse.traverse(parentNode, {
            enter: function (node) {
                const nodeContainsChild = nodeUtils
                    .doesNodeContainCoords(node.loc, childLocation);

                const nodeIsChildNode = nodeUtils
                    .isSameLocation(
                        node.loc,
                        childLocation
                    ) === 0;

                if (node === childLocation || !nodeContainsChild) {
                    return this.skip;
                } else if (!nodeIsChildNode) {
                    matchPath.push(node);
                }
            }
        });

        return matchPath;
    }

    function getExtractionLocation(parentNode, childLocation) {
        if (parentNode === null) {
            return {
                start: childLocation.start,
                end: childLocation.start
            }
        } else {
            const matchPath = buildMatchPath(parentNode, childLocation);
            const matchedLocation = last(matchPath).loc;

            return {
                start: matchedLocation.start,
                end: matchedLocation.start
            };
        }
    }

    return {
        getExtractionLocation
    };
}

module.exports = variableExtractionLocationFinder;