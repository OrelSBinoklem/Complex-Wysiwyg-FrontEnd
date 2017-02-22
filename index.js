'use strict';
var io = require('socket.io');
var express = require('express');
var http = require('http');
var fs   = require('fs');

var pageManagerVisualizator   = require('./lib/page-manager-visualizator');
var pixelPerfect   = require('./lib/pixel-perfect');

var app = express();
var server = http.createServer(app);
io = io.listen(server);

app.use(express.static('public'));

var __ = function() {};
__.serverInit = false;

__.start = function(port) {
    __.getSession(port).then(__.init);
}

__.getSession = function(port) {
    return new Promise(function(resolve) {
        fs.readFile(__dirname + '/session.json', { encoding: 'utf8' }, function(error, session) {
            if (!error) {
                resolve({
                    port: port,
                    session: JSON.parse(session)
                });
            }
        });
    });
}

__.init = function(settings) {
    if( !__.serverInit && (__.serverInit = !!1) ) {
        pixelPerfect.refreshThumbnails("design", __dirname + "/public/design-thumbnails");
        console.log(settings);
        /*server.listen( settings.port || 3010 );

        io.sockets.on('connection', function (socket) {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });*/
    }
}

module.exports = __;