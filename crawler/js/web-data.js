'use strict';

var _ = require('underscore');
var moment = require('moment');

function WebData(data) {
    this._data = data;
    this.webContents = null;
    this.date = null;
    this.siteUrl = null;

    this.setData = function (data) {
        this._data = data;
    };

    this.setUp = function() {
        if (_.has(this._data, 'webContents')) {
            this.webContents = this._data.webContents;
        }

        if (_.has(this._data, 'siteUrl')) {
            this.siteUrl = this._data.siteUrl;
        }

        console.log('reading in data:', this._data);
        if (_.has(this._data, 'date')) {
            this.date = moment(this._data.date);
        } else {
            this.date = moment();
        }
    };

    this.asJson = function() {
        return {
            webContents: this.webContents,
            siteUrl: this.siteUrl,
            date: this.date.format()
        }
    }
}

module.exports = WebData;
