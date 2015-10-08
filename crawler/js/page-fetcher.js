'use strict';

var http = require('http');
var FileHandler = require('./file-handler');
var WebData = require('./web-data');
var EventEmitter = require('events').EventEmitter;

function PageFetcher(options) {
    this._options = options;

    this._responseString = '';

    this.setup = function() {
        this.on('finished-fetching', this.finishedFetching, this);
    };

    this.finishedFetching = function() {

    };

    this._handleResponse = function(response) {
        console.log('recieved response');

        var self = this;
        response.on('data', function(chunk) {
            self._responseString += chunk;
        });
        
        response.on('end', function() {
            console.log('response from:', self._options.host, ' is: ', self._responseString);
            var webData = new WebData({
                webContents: self._responseString,
                siteUrl: options.host
            });
            webData.setUp();

            var fileHandler = new FileHandler(options.host + '.json');
            fileHandler.saveToFile(webData, function(error) {
                if (error) {
                    throw error;
                }

                console.log('for:', options.host, 'saved:', webData.asJson());
                var eventEmitter = new EventEmitter();
                eventEmitter.emit('finishedFetching');
            });
        });
    };

    this.fetch = function() {
        console.log('fetching page:', this._options.host);
        http.request(this._options, this._handleResponse.bind(this)).end();
    };
}

module.exports = PageFetcher;
