function extractVariableTemplates() {

    function propertyDeclaration({
        name,
        value
    }) {
        return `${name}: ${value},`;
    }

    function variableDeclaration({
        varType,
        name,
        value
    }) {
        return `${varType} ${name} = ${value};`;
    }

    function propertyUse(name) {
        return `this.${name}`;
    }

    function variableUse(name) {
        return name;
    }

    return {
        declaration: {
            property: propertyDeclaration,
            variable: variableDeclaration
        },
        use: {
            property: propertyUse,
            variable: variableUse
        }
    };
}

module.exports = extractVariableTemplates;