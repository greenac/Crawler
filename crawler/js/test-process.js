'use strict';

var childProcess = require('child_process');
var exec = childProcess.exec;
var spawn = childProcess.spawn;
var path = require('path');

module.exports = {
    numOfRuns: 100,
    execute: function() {
        console.log('running', this.numOfRuns, 'times');
        for (var i=0; i < this.numOfRuns; i++) {
            var index = this.randomNumber(5);
            var command = 'node ' + path.join(__dirname, 'test-worker.js') + ' '
                + index.toString() + ' ' + i.toString();
            var process = exec(command);

            process.stdout.on('data', function(data) {
                console.log('stdout:', data);
            });

            process.stderr.on('data', function(data) {
                console.log('stderr:', data);
            });

            process.on('close', function(code) {
                console.log('close code:', code);
            });
        }
    },

    spawn: function() {
        var workerPath = path.join(__dirname, 'worker.js');
        for (var i=0; i < this.numOfRuns; i++) {
            var scaler = this.randomNumber(10);
            var child = spawn('node', [workerPath, scaler, i]);
            child.stdout.setEncoding('utf8');
            child.stdout.on('data', function(data) {
                console.log('stdout:', data.toString());
            });

            child.stderr.on('data', function(data) {
                console.log('stderr:', data.toString());
            });
        }
    },

    randomNumber: function(maxSize) {
        return Math.floor(Math.random()*maxSize);
    }
};