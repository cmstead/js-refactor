function nodeUtils () {
    
    function compareNodePositions(firstNodePosition, secondNodePosition) {
        return secondNodePosition.line === firstNodePosition.line
            ? firstNodePosition.column - secondNodePosition.column
            : firstNodePosition.line - secondNodePosition.line;
    }

    function doesNodeContainCoords(nodeLocation, coordinates) {
        const startIsWithinNode = compareNodePositions(coordinates.start, nodeLocation.start) >= 0;
        const endIsWithinNode = compareNodePositions(coordinates.end, nodeLocation.end) <= 0;

        return startIsWithinNode && endIsWithinNode;
    }

    function isSameLocation(firstNodeLocation, secondNodeLocation) {
        return compareNodePositions(firstNodeLocation.start, secondNodeLocation.start)
            + compareNodePositions(firstNodeLocation.end, secondNodeLocation.end);
    }

    return {
        compareNodePositions,
        doesNodeContainCoords,
        isSameLocation
    };
}

module.exports = nodeUtils;