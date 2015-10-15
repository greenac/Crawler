'use strict';

var fs = require('fs');
var path = require('path');
var jsonFile = require('jsonfile');
var _ = require('underscore');
var Logger = require('./logger');

function FileHandler(basePath, fileName) {
    this._basePath = basePath;
    this._fileName = fileName;
    this._partsToExclude = {
        www: 'www',
        com: 'com',
        cc : 'cc',
        org: 'org',
        net: 'net',
        us : 'us'
    };

    /*
     * Set the file name
     * @public
     * @param {String} fileName -- The name of the file to read/write from
     */
    this.setFileName = function(fileName) {
        this._fileName = fileName;
    };

    /*
     * Set the base path
     * @public
     * @param {String} basePath -- The base path of the file to read/write from
     */
    this.setBasePath = function(basePath) {
        this._basePath = basePath;
    };

    /*
     * Creates the path to the file to read/write from
     * @private
     */
    this._filePath = function() {
        var parts = this._fileName.split('.');
        var name = [];

        _.each(parts, function(part) {
            if (!_.has(this._partsToExclude, part)) {
                name.push(part);
            }
        }, this);

        return path.join(this._basePath, name.join('.'));
    };

    /*
     * Saves data to a file
     * @public
     * @param {Object} webData -- The webData object to save to disk
     * @param {Function} callback-- Callback function with an error parameter
     */
    this.saveToFile = function(webData, callback) {
        jsonFile.writeFile(this._filePath(), webData.asJson(), callback);
    };

    /*
     * Retrieves data from file
     * @public
     * @param {Function} callback -- Callback function with error and data parameters
     */
    this.getFileContents = function(callback) {
        Logger.log('getting file contents for: ' + this._fileName, __filename, false, false);
        this._filePath.bind(this);
        jsonFile.readFile(this._filePath(), callback);
    };
}

module.exports = FileHandler;
