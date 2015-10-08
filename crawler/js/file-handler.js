'use strict';

var fs = require('fs');
var path = require('path');
var jsonFile = require('jsonfile');
var _ = require('underscore');

function FileHandler(fileName) {
    this._fileName = fileName;
    this._baseFilePath = '../pages';
    this._encoding = 'utf8';
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

        return path.join(__dirname, this._baseFilePath, name.join('.'));
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
        jsonFile.readFile(this._filePath(), callback);
    };
}

module.exports = FileHandler;
