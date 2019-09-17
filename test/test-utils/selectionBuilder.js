function buildPositionObject([_line, _character]) {
    return {
        _line,
        _character
    };
}

function buildSelection([start, end]) {
    return {
        _start: buildPositionObject(start),
        _end: buildPositionObject(end)
    }
}

module.exports = {
    buildSelection: buildSelection
}