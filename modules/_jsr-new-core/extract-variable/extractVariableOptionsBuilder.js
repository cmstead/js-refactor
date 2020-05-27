function extractVariableOptionsBuilder () {
    
    function variableTypes() {
        return [
            'const',
            'let',
            'var'
        ]
    }

    function scopeOptions(scopePath) {
        // This requires logic to capture string data
    }

    return {
        variableTypes
    };
}

module.exports = extractVariableOptionsBuilder;