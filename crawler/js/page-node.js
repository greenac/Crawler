'use strict';

var _ = require('underscore');

function PageNode(webData) {
    this.webData = webData;
    this.children = {};
    this.parent = null;
    this.checkInParent = function(siteUrl) {
        if (!siteUrl) {
            siteUrl = webData.siteUrl;
        }

        if (_.has(this.children, siteUrl)) {
            return true;
        }

        var parentNode = this.parent;
        while (parentNode != null) {
            if (_.has(parentNode.children, siteUrl)) {
                return true;
            }

            parentNode = parentNode.parent;
        }

        return false;
    };
}

module.exports = PageNode;
