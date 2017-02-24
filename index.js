'use strict';
var io = require('socket.io');
var express = require('express');
var http = require('http');
var fs   = require('fs');
var path = require('path');
var gulp = require('gulp');

var pageManagerVisualizator   = require('./lib/page-manager-visualizator');
var pixelPerfect   = require('./lib/pixel-perfect');

var ____;
var __ = function(port, dirDesignScreenshots) {
    this.port = port;
    this.dirDesignScreenshots = dirDesignScreenshots;
    this.serverInit = false;

    this.pageManagerVisualizator = new pageManagerVisualizator();
    this.pixelPerfect = new pixelPerfect();

    this.app = express();
    this.server = http.createServer(this.app);
    this.io = io.listen(this.server);

    this.app.use('/design-thumbnails', express.static(dirDesignScreenshots + '/design-thumbnails'));
    this.app.use('/', express.static(__dirname + '/public'));
};

__.start = function(port, dirDesignScreenshots) {
    var _this = new __(port, dirDesignScreenshots);
    ____ = _this;
    _this.getSession().then(_this.init);
    return _this;
}

__.prototype.getSession = function() {
    var ____ = this;
    return new Promise(function(resolve) {
        if( !fs.existsSync( path.normalize(path.join(____.dirDesignScreenshots, '/session.json')) ) ) {
            gulp.task("copy-session.json", function () {
                return gulp.src( path.normalize(path.join(__dirname, 'src/default-settings/session.json')) )
                    .pipe(gulp.dest(path.normalize(path.join(____.dirDesignScreenshots, '/'))))
                    .on('end', next);
            })
                .start('copy-session.json');
        } else {
            next();
        }
        function next() {
            fs.readFile( path.normalize(path.join(____.dirDesignScreenshots, '/session.json')), { encoding: 'utf8' }, function(error, session) {
                if (!error) {
                    ____.session = JSON.parse(session);
                    console.log(____.session);
                    resolve();
                }
            });
        }
    });
}

__.prototype.init = function() {

    if( !____.serverInit && (____.serverInit = !!1) ) {
        pixelPerfect.refreshThumbnails(____.dirDesignScreenshots);

        ____.server.listen( ____.port || 3010 );

        ____.io.sockets.on('connection', function (socket) {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });
    }
}

module.exports = __;