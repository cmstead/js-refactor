const typeScope = require('signet')();

typeScope.defineDuckType(
    'astPosition',
    {
        line: 'leftBoundedInt<1>',
        column: 'leftBoundedInt<0>'
    }
);

typeScope.defineDuckType(
    'astLocation',
    {
        start: 'astPosition',
        end: 'astPosition'
    }
);

typeScope.defineDuckType(
    'editorPosition',
    {
        _line: 'leftBoundedInt<0>',
        _character: 'leftBoundedInt<0>'
    }
);

typeScope.defineDuckType(
    'editorLocation',
    {
        _start: 'editorPosition',
        _end: 'editorPosition'
    }
);

typeScope.defineDuckType(
    'astNode',
    {
        type: 'string',
        loc: 'astLocation'
    }
)

typeScope.defineDuckType(
    'propertySetupDefinition',
    {
        name: 'string',
        value: 'string'
    }
);

typeScope.defineDuckType(
    'variableSetupDefinition',
    {
        varType: 'string',
        name: 'string',
        value: 'string'
    }
);

typeScope.defineDuckType(
    'quickPickOptions',
    {
        ignoreFocusOut: 'boolean',
        placeholder: 'string'
    }
);

typeScope.defineDuckType(
    'promise',
    {
        then: 'function',
        catch: 'function'
    }
);

module.exports = function types() {
    return typeScope;
};