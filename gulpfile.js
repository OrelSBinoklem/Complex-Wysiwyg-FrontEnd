// JavaScript Document

'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    rimraf = require('rimraf'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    through2 = require('through2').obj,
	mkdirp = require('mkdirp');

gulp.task('sb.php', function () {
    gulp.src("src/sb.php")
        .pipe(through2(function(file, enc, callback){
            var text = file.contents.toString();

            text = text.replace(/<head>[\S\s]*?<\/head>/gim, function(str, offset, s) {
                return "\<head>\n\
    <title>Шаблонизатор</title>\n\
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\
    <meta charset=\"utf-8\">\n\
    <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,400italic' rel='stylesheet' type='text/css'>\n\
    <script type=\"text/javascript\" src=\"sb/ace/ace.js\"></script>\n\
	<link rel=\"stylesheet\" href=\"sb/all.min.css\">\n\
    <script type=\"text/javascript\" src=\"sb/all.min.js\"></script>\n\
</head>";
            });

            file.contents = new Buffer( text );
            callback(null, file);
        }))
        .pipe(gulp.dest("build"));
});

gulp.task('style', function () {
    gulp.src([
        "src/sb/css/reset.css",
        "src/sb/css/ui-lightness/*.css",
        "src/sb/css/bootstrap.css",
        "src/sb/css/bootstrap-theme.css",
        "src/sb/css/font-awesome.min.css",
        "src/sb/js/selectpicker/*.css",
        "src/sb/js/malihu-custom-scrollbar/*.css",
        "src/sb/js/mylib/file-navigator/*.css",
        "src/sb/js/mylib/page-manager-visualizator/*.css",
        "src/sb/js/mylib/pixel-perfect/*.css",
        "src/sb/js/mylib/editor/*.css",
        "src/sb/js/mylib/live-style/*.css",
        "src/sb/js/mylib/generator-code/*.css",
        "src/sb/css/main.css"
    ])
        .pipe(concatCss("all.min.css"))
        .pipe(cleanCSS())
        .pipe(through2(function(file, enc, callback){//упращяем пути до файла
            var text = file.contents.toString();
            text = text.replace(/url\((["']?)([\S\s]*?)(["']?)\)/gim, function(str, p1, p2, p3, offset, s) {
                var text = p2.replace(/^[\S\s]*?([^\\\/]*\.\w{1,14}($|\?|#))/gim, function(str, p1, p2, offset, s) {
                    return "content/" + p1;
                });

                return "url(" + (p1 || "") + text + (p3 || "") + ")";
            });

            file.contents = new Buffer( text );
            callback(null, file);
        }))
        .pipe(gulp.dest("build/sb"));
});

//js
gulp.task('js', function () {
    gulp.src([
            "src/sb/js/jquery-1.11.2.min.js",
            "src/sb/js/jquery-ui-1.11.3.min.js",
            "src/sb/js/bootstrap.min.js",
            "src/sb/js/selectpicker/bootstrap-select.min.js",
            "src/sb/js/selectpicker/i18n/defaults-ru_RU.js",

            "src/sb/js/ace/ext-emmet.js",
            "src/sb/js/emmet.js",
            "src/sb/js/ace/ext-modelist.js",
            "src/sb/js/ace/ext-options.js",
            "src/sb/js/ace/ext-elastic_tabstops_lite.js",
            "src/sb/js/ace/ext-keybinding_menu.js",
            "src/sb/js/ace/ext-language_tools.js",
            "src/sb/js/ace/ext-searchbox.js",
            "src/sb/js/ace/ext-settings_menu.js",
            "src/sb/js/ace/ext-spellcheck.js",
            "src/sb/js/ace/ext-split.js",
            "src/sb/js/ace/ext-static_highlight.js",
            "src/sb/js/ace/ext-statusbar.js",
            "src/sb/js/ace/ext-textarea.js",
            "src/sb/js/ace/ext-themelist.js",
            "src/sb/js/ace/ext-whitespace.js",
            "src/sb/js/ace/keybinding-emacs.js",
            "src/sb/js/ace/keybinding-vim.js",

            "src/sb/js/jquery.zclip.js",

            "src/sb/js/malihu-custom-scrollbar/jquery.mCustomScrollbar.concat.min.js",

            "src/sb/js/greensock/TimelineMax.min.js",
            "src/sb/js/greensock/TweenMax.min.js",

            "src/sb/js/global.js",

            "src/sb/js/mylib/file-navigator/*.js",
            "src/sb/js/mylib/page-manager-visualizator/*.js",
            "src/sb/js/mylib/pixel-perfect/*.js",
            "src/sb/js/mylib/editor/*.js",
            "src/sb/js/mylib/live-style/*.js",
            "src/sb/js/mylib/generator-code/*.js",

            "src/sb/js/main.js",
        ])
        .pipe(concat("all.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/sb"));
});

gulp.task('swf:for_zclip', function () {
    gulp.src([
            "src/sb/**/*.swf"
        ])
        .pipe(gulp.dest("build/sb/"));
});

gulp.task('js:ace', function () {
    gulp.src([
            "src/sb/js/ace/**/*.js"
        ])
        .pipe(uglify())
        .pipe(gulp.dest("build/sb/ace"));
});

//content
gulp.task('content', function () {
    gulp.src([
            "src/sb/css/ui-lightness/images/*.{jpg,png,gif,svg}",
            "src/sb/fonts/*.{otf,eot,svg,ttf,woff,woff2}",
            "src/sb/js/malihu-custom-scrollbar/*.{otf,eot,svg,ttf,woff,woff2}",
            "src/sb/js/mylib/file-navigator/img/*.{jpg,png,gif,svg}",
            "src/sb/js/mylib/page-manager-visualizator/img/*.{jpg,png,gif,svg}",
            "src/sb/js/mylib/pixel-perfect/img/*.{jpg,png,gif,svg}",
            "src/sb/js/mylib/editor/img/*.{jpg,png,gif,svg}",
            "src/sb/js/mylib/live-style/img/*.{jpg,png,gif,svg}",
            "src/sb/js/mylib/generator-code/img/*.{jpg,png,gif,svg}"
        ])
        .pipe(gulp.dest("build/sb/content"));
});

gulp.task('php', function () {
    gulp.src("src/sb/**/*.{php,xml}")
        .pipe(gulp.dest("build/sb"));
});

gulp.task('sb-generators', function () {
    gulp.src("src/sb-generators/**/*.*")
        .pipe(gulp.dest("build/sb-generators"));
});

gulp.task('sb-compiler', function () {
    gulp.src("src/sb-compiler/**/*.*")
        .pipe(gulp.dest("build/sb-compiler"));
});

gulp.task('sb-scrins', function () {
    gulp.src("src/sb-scrins/**/*.{jpg,png}")
        .pipe(gulp.dest("build/sb-scrins"));
});

gulp.task('miniatyrki', function () {
    gulp.src("src/sb/miniatyrki/**/*.{jpg,png}")
        .pipe(gulp.dest("build/sb/miniatyrki"));
});

mkdirp('build/sb-scrins', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});

mkdirp('build/sb/miniatyrki', function (err) {
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
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});*/

gulp.task('build', [
    'sb.php',
    'style',
    "js",
    "swf:for_zclip",
    "js:ace",
    'content',
    'php',
    'sb-generators',
    'sb-compiler',
	'sb-scrins',
	'miniatyrki'
]);

gulp.task('default', ['build']);