function nodeTypeValidator(
    astHelper,
    nodeTypes,
    typeHelper
) {
    'use strict';

    let nodeTypeApi = Object.keys(nodeTypes)
        .reduce(function (apiObject, key) {
            const apiKey = `is${key}`;

            apiObject[apiKey] = astHelper.isNodeType([key]);

            return apiObject;
        }, {});

    return nodeTypeApi;
}

nodeTypeValidator['@singleton'] = true;

module.exports = nodeTypeValidator;