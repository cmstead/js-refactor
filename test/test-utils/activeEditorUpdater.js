function updateActiveEditor(
    activeTextEditor,
    selections,
    sourceLines
) {
    activeTextEditor._documentData._lines = sourceLines;
    activeTextEditor._selections = selections;
}

module.exports = {
    updateActiveEditor: updateActiveEditor
}