'use strict';

var _ = require('underscore');
var WebData = require('./web-data');
var FileHandler = require('./file-handler');
var PageFetcher = require('.page-fetcher');

function PageController(pages) {
    this._pages = pages;
    this._visitedPages = {};
    this._setupFile = 'setup-pages.json';

    this.fetch = function () {
        var self = this;
        var fileHandler = new FileHandler(this._setupFile);
        fileHandler.getFileContents(function(error, pages) {
            if (error) {
                console.log('Error reading:', self._setupFile);
                throw error;
            }

            self._pages = pages;
            self._crawl();
        });
    };

    this._crawl = function() {
        _.each(this._pages, function(data) {
            var pageFetcher = new PageFetcher(data);
            pageFetcher.fetch();
        }, this);
    };

    this._handleData = function (webData) {
        if (!_.has(this._visitedPages, webData.siteUrl)) {
            this._visitedPages[webData.siteUrl] = webData.siteUrl;
            var fileHandler = new FileHandler(webData.siteUrl);
            fileHandler.saveToFile(webData, function(error) {
                if (error) {
                    console.log('Error: failed to save data for:', webData.siteUrl);
                    throw error;
                }

                console.log('Saved data for:', webData.siteUrl);
            });
        }
    };
}

module.exports = PageController;
