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
    'astNode',
    {
        type: 'string',
        loc: 'astLocation'
    }
)



module.exports = function types() {

    return typeScope;
};