'use strict';
var io = require('socket.io');
var express = require('express');
var http = require('http');
var fs   = require('fs');
var path = require('path');
var gulp = require('gulp');

var pageManagerVisualizator   = require('./lib/page-manager-visualizator');
var pixelPerfect   = require('./lib/pixel-perfect');
var sessionModel   = require('./lib/session-model.js');

var ____;
var __ = function(port, dirDesignScreenshots) {
    this.port = port;
    this.dirDesignScreenshots = dirDesignScreenshots;
    this.serverInit = false;

    this.pageManagerVisualizator = new pageManagerVisualizator();
    this.pixelPerfect = new pixelPerfect();
    this.sessionModel = sessionModel.startSession(this.dirDesignScreenshots);

    this.app = express();
    this.server = http.createServer(this.app);
    this.io = io.listen(this.server);

    this.app.use('/design-thumbnails', express.static(dirDesignScreenshots + '/design-thumbnails'));
    this.app.use('/', express.static(__dirname + '/public'));
};

__.start = function(port, dirDesignScreenshots) {
    ____ = new __(port, dirDesignScreenshots);
    ____.sessionModel.get().then(____.init);
    return ____;
}

__.prototype.init = function() {

    if( !____.serverInit && (____.serverInit = !!1) ) {
        pixelPerfect.refreshThumbnails(____.dirDesignScreenshots);

        ____.server.listen( ____.port || 3010 );

        ____.io.sockets.on('connection', function (socket) {
            socket.emit('session.load', ____.sessionModel.session);
            
            socket.on('modified_pages', function (data) {
                //console.log(data);
                ____.sessionModel.session.pages = data;
                ____.sessionModel.sessionChange = true;
            });

            socket.on('disconnect', function () {
                console.log('user disconnected');
            });

            /*socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });*/
        });

        setInterval(function() {
            if(____.sessionModel.sessionChange) {
                ____.sessionModel.save();
                ____.sessionModel.sessionChange = false;
            }
        }, 2000);
    }
}

module.exports = __;