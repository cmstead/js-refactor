function variableExtractionLocationFinder () {
    
    function getExtractionLocation(parentNode, childLocation) {
        const location = childLocation;
        return {
            start: location.start,
            end: location.start
        }
    }

    return {
        getExtractionLocation
    };
}

module.exports = variableExtractionLocationFinder;