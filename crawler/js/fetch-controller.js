'use strict';

var _ = require('underscore');
var FileHandler = require('./file-handler');
var PageFetcher = require('./page-fetcher');
var path = require('path');
var Logger = require('./logger');

function PageController(pages) {
    this._pages = pages;
    this._visitedPages = {};
    this._setupFile = 'setup-pages.json';

    this.fetch = function () {
        var self = this;
        var baseSetupPath = path.join(__dirname, '../files');
        var fileHandler = new FileHandler(baseSetupPath, this._setupFile);
        fileHandler.getFileContents(function(error, pages) {
            if (error) {
                Logger.log('Reading in source files' , __filename, true, false);
                throw error;
            }

            pages.followRedirect = true;
            self._pages = pages;
            self._crawl();
        });
    };

    this._crawl = function() {
        _.each(this._pages, function(data) {
            var pageFetcher = new PageFetcher(data);
            pageFetcher.on(
                pageFetcher.events.finishedFetching,
                this._handleData.bind(this)
            );
            pageFetcher.fetch();
        }, this);
    };

    this._handleData = function (webData) {
        if (!_.has(this._visitedPages, webData.siteUrl)) {
            this._visitedPages[webData.siteUrl] = webData.siteUrl;
            var basePath = path.join(__dirname, '../files/pages');
            var fileHandler = new FileHandler(basePath, webData.siteUrl + '.json');
            fileHandler.saveToFile(webData, function(error) {
                if (error) {
                    Logger.log(
                        'failed to save data for: ' + webData.siteUrl,
                        __filename,
                        true,
                        false
                    );
                    throw error;
                }

                Logger.log(
                    'Saved data for: ' + webData.siteUrl,
                    __filename,
                    false,
                    false
                );
            });
        }
    };
}

module.exports = PageController;
