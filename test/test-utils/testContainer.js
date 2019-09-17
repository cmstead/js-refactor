const container = require('../../container');
const motherContainer = require('./mother-container');
const childContainer = container.new();

const vscodeFactoryFake = function () {
    return {
        get: function () {
            return {
                window: {
                    activeTextEditor: motherContainer.buildData('activeTextEditor')
                }
            }
        }
    }
};

childContainer.register(() => vscodeFactoryFake, 'vscodeFactory');

module.exports = childContainer;