'use strict';
var fs   = require('fs'),
    through2 = require("through2").obj,
    imageResize = require('gulp-image-resize'),
    gulp = require('gulp'),
    resizeImg = require('resize-img'),
    del = require('del'),
    changed = require('gulp-changed');

var __ = function() {};

__.refreshThumbnails = function(dir, destdir) {
    gulp.task('thumbnails-clear', function() {
        return del(destdir + '/**');
    });

    gulp.task("sync-thumbnails", function () {
        return gulp.src(dir + '/**/*.{jpg,png}')
            .pipe(changed(destdir))
            .pipe(through2(function(file, enc, callback){
                resizeImg(file.contents, {width: 320}).then(buf => {
                    file.contents = buf;
                    callback(null, file);
                });
            }))
            .pipe(gulp.dest(destdir));
    });

    gulp.task('refresh-thumbnails', ["thumbnails-clear"], function() {
        return gulp.start('sync-thumbnails');
    });
    gulp.start('refresh-thumbnails');
    gulp.watch(dir + '/**/*.{jpg,png}', ['sync-thumbnails']);
}

module.exports = __;