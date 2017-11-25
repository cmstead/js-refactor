'use strict';

const assert = require('chai').assert;
const container = require('../../container.js');
const testUtils = require('../test-utils/test-utils');

require('../test-utils/approvalsConfig');

describe('coordsHelper', function () {

    let coordsHelper;

    beforeEach(function () {
        coordsHelper = container.build('coordsHelper');
    });

    describe('coordsFromEditorToAst', function () {

        it('should convert VS Code editor selection coordinates to AST format', function () {
            const editorCoords = {
                start: [0, 0],
                end: [10, 11]
            };

            const astCoords = coordsHelper.coordsFromEditorToAst(editorCoords);

            this.verify(testUtils.prettyJson(astCoords));
        });

    });

    describe('coordsFromAstToEditor', function () {

        it('should convert AST formatted coords to editor coords', function () {
            const astCoords = {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 13
                }
            };

            const editorCoords = coordsHelper.coordsFromAstToEditor(astCoords);

            this.verify(testUtils.prettyJson(editorCoords));
        });
    });

    describe('coordsInNode', function() {
        
        it('should return true if coords are within the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 20,
                        column: 0
                    }
                }
            };

            const result = coordsHelper.coordsInNode(selectionCoords, astNode);

            assert.isTrue(result);
        });

        it('should return true if coords are the same as the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 10,
                        column: 0
                    },
                    end: {
                        line: 11,
                        column: 12
                    }
                }
            };

            const result = coordsHelper.coordsInNode(selectionCoords, astNode);

            assert.isTrue(result);
        });

        it('should return true if coords are on the leading edge of the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 10,
                        column: 0
                    },
                    end: {
                        line: 20,
                        column: 12
                    }
                }
            };

            const result = coordsHelper.coordsInNode(selectionCoords, astNode);

            assert.isTrue(result);
        });

        it('should return true if coords are on the trailing edge of the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 11,
                        column: 12
                    }
                }
            };

            const result = coordsHelper.coordsInNode(selectionCoords, astNode);

            assert.isTrue(result);
        });

        it('should return false if coords are not within the scope of the AST node', function() {
            const selectionCoords = {
                start: {
                    line: 10,
                    column: 0
                },
                end: {
                    line: 11,
                    column: 12
                }
            };

            const astNode = {
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 5,
                        column: 0
                    }
                }
            };

            const result = coordsHelper.coordsInNode(selectionCoords, astNode);

            assert.isFalse(result);
        });

    });

});