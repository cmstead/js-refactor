function extractVariableTemplates(
    types
) {

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
            property: types.enforce(
                'propertySetupDefinition => string',
                propertyDeclaration
            ),
            variable: types.enforce(
                'variableSetupDefinition => string',
                variableDeclaration
            )
        },
        use: {
            property: types.enforce(
                'name: string => string',
                propertyUse
            ),
            variable: types.enforce(
                'name: string => string',
                variableUse
            )
        }
    };
}

module.exports = extractVariableTemplates;