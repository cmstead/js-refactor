const filesystem = require('fs');
const path = require('path');
const vscodeFactory = require('../mock-modules/vscodeFactory');

function buildAstFixture(fixtureName, testContainer) {
    const vsCodeFactoryFake = vscodeFactory()({ activeTextEditor: {} });

    testContainer.register(vsCodeFactoryFake, 'vscodeFactory');

    const parser = testContainer.build('parser');

    const fixturePath = path.join(
        __dirname,
        'fixtures',
        fixtureName + '.js'
    );

    const fileFixture = filesystem.readFileSync(fixturePath, { encoding: 'utf8' });
    return parser.parse(fileFixture);

}

module.exports = buildAstFixture