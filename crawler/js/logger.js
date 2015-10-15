var colors = require('colors');

module.exports = {
    log: function (message, fileName, isError, skipLine) {
        var logMessage = '';

        if (fileName) {
            var fileParts = fileName.split('/');
            logMessage += fileParts.pop() + ' :: ';
        }

        if (isError) {
            logMessage += 'ERROR: ';
        }

        logMessage += message;

        if (skipLine) {
            logMessage += '\n';
        }

        if (isError) {
            console.log(logMessage.red);
        } else {
            console.log(logMessage.yellow);
        }

    }
};