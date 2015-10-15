var FileHandler = require('./file-handler');
var fs = require('fs');
var path = require('path');

if (process.argv.length > 2) {
    var files = [
        'data18.json',
        'espn.go.json',
        'freeones.json',
        'google.json',
        'realclearpolitics.json'
    ];

    var dirPath = path.join(__dirname, '../files/pages');
    var index = parseInt(process.argv[2]);
    var counter = parseInt(process.argv[3]);
    var fileName = files[index];

    console.log('reading file:', fileName, 'with index:', index, 'for counter:', counter);

    var fileHandler = new FileHandler(dirPath, fileName);
    fileHandler.getFileContents(function(error, webData) {
        if (error) {
            throw error;
        }

        console.log('Read in data from:', fileName, 'with length:', webData.webContents.length);
    });
}


