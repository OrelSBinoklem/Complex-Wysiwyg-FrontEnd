// JavaScript Document

'use strict';

var gulp = require('gulp'),
    //watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    //rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    //cleanCSS = require('gulp-clean-css'),
    //rimraf = require('rimraf'),
    //concat = require('gulp-concat'),
    //concatCss = require('gulp-concat-css'),
    //through2 = require('through2').obj,
	mkdirp = require('mkdirp');

gulp.task('style', function () {
    gulp.src("src/public/**/*.sass") //Выберем наш main.scss
        .pipe(sourcemaps.init())
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("public"));
});

gulp.task('css', function () {
    gulp.src("src/public/**/*.css")
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest("public"));
});

gulp.task('js', function () {
    gulp.src("src/public/**/*.js") //Найдем наш main файл
        .pipe(sourcemaps.init())
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("public")); //Выплюнем готовый файл в build
});

//content
gulp.task('content', function () {
    gulp.src("src/public/**/*.{jpg,png,gif,svg,otf,eot,svg,ttf,woff,woff2}")
        .pipe(gulp.dest("public"));
});

gulp.task('index.html', function () {
    gulp.src("src/public/index.html")
        .pipe(gulp.dest("public"));
});

gulp.task('default-json', function () {
    gulp.src("src/default-settings/**/*.json")
        .pipe(gulp.dest("/"));
});

mkdirp('public/design-thumbnails', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});

/*gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});*/

gulp.task('build', [
    'index.html',
    'style',
    'css',
    "js",
    'content',
    'default-json'
]);

gulp.task('default', ['build']);