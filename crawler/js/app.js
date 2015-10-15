'use strict';

var express = require('express');
var FileHandler = require('./file-handler');
var WebData = require('./web-data');
var PageFetcher = require('./page-fetcher');
var FetchController = require('./fetch-controller');
var TestProcess = require('./test-process');

function App() {
    this._app = express();
    this.start = function() {
        if (process.argv.length > 2 && process.argv[2] === 'test') {
            TestProcess.spawn();
        }  else if (process.argv.length > 2 && process.argv[2] === 'filehandler') {
            var data = 'this is some more mas mucho vin html data: <html><h1>A Header</h1></html>';
            var webData = new WebData({
                webContents: 'more content yay!!',
                siteUrl: 'www.greuw.com'
            });
            webData.setUp();
            var fileHandler = new FileHandler('test.json');
            fileHandler.saveToFile(webData, function(error) {
                if (error) {
                    throw error;
                }

                console.log('saved:', webData.asJson(), 'to file');
                fileHandler.getFileContents(function(err, retrievedData) {
                    if (error) {
                        throw err;
                    }

                    console.log('retrieved data: ', retrievedData);
                    var newWebData = new WebData(retrievedData);
                    newWebData.setUp();
                    console.log('retrieved data:', newWebData.asJson());
                });
            });
        } else if (process.argv.length > 2 && process.argv[2] === 'webdata') {
            var webData = new WebData({
                webContents: 'more content yay!!',
                siteUrl: 'www.greuw.com'
            });
            webData.setUp();
            console.log('web data:', webData.asJson());
        } else if (process.argv.length > 2 && process.argv[2] === 'fetchpage') {
            var host = process.argv[3] ? process.argv[3] : 'www.yahoo.com';
            var path = process.argv[4] ? process.argv[4] : '/';
            var pageFetcher = new PageFetcher({
                host: host,
                path: path
            });
            pageFetcher.fetch();
        } else if (process.argv.length > 2 && process.argv[2] === 'fetch') {
            var fetchController = new FetchController();
            fetchController.fetch();
        } else {
            var server = this._app.listen(8000, function() {
                var host = server.address().address;
                var port = server.address().port;

                console.log('express server running at: %s:%s', host, port);
            });
        }
    };
}

module.exports = App;
