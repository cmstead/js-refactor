const { assert } = require('chai');
const approvals = require('../../test-utils/approvals');
const prettyJson = require('../../test-utils/prettyJson');

const jsAstFixtureLoader = require('../../test-utils/jsAstFixtureLoader');
const jsSourceFixtureLoader = require('../../test-utils/jsSourceFixtureLoader');
const vsCodeFake = require('../../fakes/vscode-fake');

const container = require('../../../../container');

const basePath = jsAstFixtureLoader.buildPath(__dirname, './fixtures');

approvals.init();

describe('Core extract variable behaviors', function () {

    function getSelectionCoordinates() {
        return {
            start: {
                line: 10,
                column: 29
            },
            end: {
                line: 10,
                column: 73
            }
        };
    }

    function getAstFixture() {
        return jsAstFixtureLoader.load(basePath, 'extraction-location-fixture.js');
    }

    function getSourceLinesFixture() {
        return jsSourceFixtureLoader.loadLines(basePath, 'extraction-location-fixture.js');
    }

    function getExtractVariableCore(vsCodeFakeInstance) {
        const testContainer = container.new();

        testContainer.register(() => ({ get: () => vsCodeFakeInstance }), 'vscodeFactory');

        return testContainer.build('extractVariableCore');
    }

    function buildExtractVariableCore() {
        const userInputFake = vsCodeFake.buildFake();

        return getExtractVariableCore(userInputFake);
    }

    describe('get extraction scope path', function () {

        it('returns an extraction scope path for given coordinates', function () {
            const extractVariableCore = buildExtractVariableCore();

            const sourceAst = getAstFixture();
            const selectionCoordinates = getSelectionCoordinates();

            const extractionScopePath = extractVariableCore.getExtractionScopePath(selectionCoordinates, sourceAst);
            const extractionScopePathInfo = extractionScopePath.map(node => ({
                type: node.type,
                location: node.loc
            }));

            this.verify(prettyJson(extractionScopePathInfo));
        });

    });

    describe('get extraction node', function () {

        it('gets the user-selected extraction scope node', function () {
            const vsCodeFakeInstance = vsCodeFake.buildFake();
            const extractVariableCore = getExtractVariableCore(vsCodeFakeInstance);

            const selectionCoordinates = getSelectionCoordinates();
            const astFixture = getAstFixture();
            const sourceLinesFixture = getSourceLinesFixture()

            vsCodeFakeInstance.window.showQuickPick.returns(Promise.resolve('1: js source string'));

            const scopePath = extractVariableCore.getExtractionScopePath(selectionCoordinates, astFixture);

            return extractVariableCore
                .getExtractionNode(scopePath, sourceLinesFixture)
                .then((scopeNode) => {
                    const scopeInfo = {
                        type: scopeNode.type,
                        location: scopeNode.loc
                    };

                    this.verify(prettyJson({
                        quickPickChoices: vsCodeFakeInstance.window.showQuickPick.args[0][0],
                        scopeInfo: scopeInfo
                    }));
                })
        });

        it('fails appropriately when selection is invalid', function () {
            const vsCodeFakeInstance = vsCodeFake.buildFake();
            const extractVariableCore = getExtractVariableCore(vsCodeFakeInstance);

            const selectionCoordinates = getSelectionCoordinates();
            const astFixture = getAstFixture();
            const sourceLinesFixture = getSourceLinesFixture()

            vsCodeFakeInstance.window.showQuickPick.returns(Promise.resolve(''));

            const scopePath = extractVariableCore.getExtractionScopePath(selectionCoordinates, astFixture);

            return extractVariableCore
                .getExtractionNode(scopePath, sourceLinesFixture)
                .then(() => {
                    assert.equal(false, true, 'Extraction node behavior should have failed');
                })
                .catch((error) => {
                    assert.equal(error.message, 'Invalid scope selection for extract variable');
                });
        });


    });

    describe('get variable type', function () {
        
        it('returns "property" when node type is "object"', function () {
            const extractVariableCore = buildExtractVariableCore();

            const fakeNode = {
                type: 'ObjectExpression',
                loc: getSelectionCoordinates()
            }

            const variableType = extractVariableCore.getVariableType(fakeNode);

            assert.equal(variableType, 'property');
        });

        it('returns "variable" when node type is not "object"', function () {
            const extractVariableCore = buildExtractVariableCore();

            const fakeNode = {
                type: 'FunctionExpression',
                loc: getSelectionCoordinates()
            }

            const variableType = extractVariableCore.getVariableType(fakeNode);

            assert.equal(variableType, 'variable');
        });

    });
});