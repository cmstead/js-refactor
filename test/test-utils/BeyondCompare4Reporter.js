var spawn = require('child_process').spawn;
var fs = require('fs');

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
            var approvedPath = './' + approvedFilePath;
            var receivedPath = './' + receivedFilePath;

            var approvedStat = statPath(approvedPath);

            if (!approvedStat) {
                fs.writeFileSync(approvedPath, '');
            }

            spawn(executionPath, [receivedPath, approvedPath], { detached: true });

        }
    };
};

module.exports = BeyondCompare4;