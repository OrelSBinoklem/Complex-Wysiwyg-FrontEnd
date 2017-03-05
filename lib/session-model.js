'use strict';
var fs   = require('fs'),
    gulp = require('gulp'),
    path = require('path');

var __ = function(dirSessionFile) {
    this.dirSessionFile = dirSessionFile;
};

var ____;

__.startSession = function(dirSessionFile) {
    this.sessionChange = false;

    return new __(dirSessionFile);
};

__.prototype.get = function() {
    ____ = this;
    return new Promise(function(resolve) {

        //Проверка содержиться ли уже сессия в обьекте
        if( !("session" in ____) ) {
            //Проверка сужествования файла сессии
            if( !fs.existsSync( path.normalize(path.join(____.dirSessionFile, '/session.json')) ) ) {
                gulp.task("copy-session.json", function () {
                        return gulp.src( path.normalize(path.join(__dirname, '../src/default-settings/session.json')) )
                            .pipe(gulp.dest(path.normalize(path.join(____.dirSessionFile, '/'))))
                            .on('end', next);
                    })
                    .start('copy-session.json');
            } else {
                next();
            }

            //Доп. функция для продолжения выполнения
            function next() {
                fs.readFile( path.normalize(path.join(____.dirSessionFile, '/session.json')), { encoding: 'utf8' }, function(error, session) {
                    if (!error) {
                        ____.session = JSON.parse(session);
                        resolve(____.session);
                    } else {
                        throw (error);
                    }
                });
            }
        } else {
            resolve(____.session);
        }
    });
};

__.prototype.save = function() {
    ____ = this;
    
    //____.session.show_page_or_design = 1;
    fs.writeFile( path.normalize(path.join(____.dirSessionFile, '/session.json')), JSON.stringify(____.session), 'utf8', function(error) {
        if(error) {
            throw (error);
        }
    });
};

module.exports = __;