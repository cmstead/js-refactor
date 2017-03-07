var spawn = require('child_process').spawn;
var fs = require('fs');
var sep = require('path').sep;

function statPath(filePath) {
    try {
        return fs.lstatSync(filePath);
    } catch (e) {
        return false;
    }
}

function BeyondCompare4 () {
    return {
        name: 'BeyondCompare4',
        canReportOn: function () {
            return true;
        },
        report: function (approvedFilePath, receivedFilePath) {
            var executionPath = '/Program Files/Beyond Compare 4/BCompare.exe';

            if (!statPath(approvedFilePath)) {
                fs.writeFileSync(approvedFilePath, '');
            }

            spawn(executionPath, [receivedFilePath, approvedFilePath], { detached: true });

        }
    };
};

module.exports = BeyondCompare4;