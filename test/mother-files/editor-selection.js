'use strict';

module.exports = function (moduleContainer) {
    function editorSelection() {
        return {
            _start: function(index, options) {
                const startOptionExists = options && options.selection && options.selection.start;

                return {
                    _line: startOptionExists ? options.selection.start[0] : 0,
                    _character: startOptionExists ? options.selection.start[1] : 0
                }
            },
            _end: function(index, options) {
                const endOptionExists = options && options.selection && options.selection.end;

                return {
                    _line: endOptionExists ? options.selection.end[0] : 0,
                    _character: endOptionExists ? options.selection.end[1] : 0
                }
            }
        }
    }

    moduleContainer.register('editorSelection', editorSelection);
}