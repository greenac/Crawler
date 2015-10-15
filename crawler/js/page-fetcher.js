'use strict';

var http = require('http');
var WebData = require('./web-data');
var EventEmitter = require('events').EventEmitter;
var Logger = require('./logger');
var _ = require('underscore');

function PageFetcher(options) {
    var pageFetcher = {};
    pageFetcher.__proto__ = new EventEmitter();
    pageFetcher._options = options;
    pageFetcher._responseString = '';
    pageFetcher.events = {
        finishedFetching: 'finished-fetching',
        receivedData: 'data',
        finishedReceivingData: 'end'
    };

    pageFetcher.finishedFetching = function(webData) {
        this.emit(this.events.finishedFetching, webData);
    };

    pageFetcher._handleResponse = function(response) {
        var self = this;
        response.on(this.events.receivedData, function(chunk) {
            self._responseString += chunk;
        });

        response.on(this.events.finishedReceivingData, function() {
            Logger.log(
                'Received response from: ' + self._options.host,
                __filename,
                false,
                false
            );

            var webData = new WebData({
                webContents: self._responseString,
                siteUrl: self._options.host
            });
            webData.setUp();

            if (self._isRedirect(webData.webContents)) {
                self._handleRedirect(webData);
            } else {
                self.finishedFetching(webData);
            }
        });
    };

    pageFetcher.fetch = function() {
        Logger.log(
            'fetching page: ' + this._options.host,
            __filename,
            false,
            false
        );

        http.request(this._options, this._handleResponse.bind(this)).end();
    };

    pageFetcher._isRedirect = function(infoString) {
        console.log('checking redirect');
        return (/301/.test(infoString) && /error/i.test(infoString));
    };

    pageFetcher._handleRedirect = function(webData) {
        // TODO -- This code is horrible. Refefactor!!
        var match = /host machine/i.exec(webData.webContents);
        if (match) {
            var startTargetIndex = match.index + match[0].length;
            var target = webData.webContents[startTargetIndex];
            while (!/[a-z]/.test(target)) {
                target = webData.webContents[++startTargetIndex];
            }

            var endTargetIndex = startTargetIndex + 1;
            target = webData.webContents[endTargetIndex];
            while (target !== ' ') {
                target = webData.webContents[++endTargetIndex];
            }

            var newUrl = webData.webContents.substring(
                startTargetIndex,
                endTargetIndex
            );

            if (!/https:\/\//.test(newUrl)) {
                newUrl = 'https://' + newUrl;
            }

            this._options.host = newUrl;
            this._options.port = 443;
            this.fetch();
        }
    };

    return pageFetcher;
}

module.exports = PageFetcher;
