'use strict';

var PageNode = require('./page-node');
var _ = require('underscore');

function WebTree() {
    this.head = null;
    this.insert = function(webData) {
        if (!this.head) {
            this.head = new PageNode(webData);
            return;
        }

        var currentNode = this.head;
        while (!_.isEmpty(currentNode.children)) {

        }
    };

    this.hasNode = function(node, webData) {

    };
}

module.exports = WebTree;
