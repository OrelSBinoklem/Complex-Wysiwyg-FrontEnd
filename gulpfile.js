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

gulp.task('shablonizator.php', function () {
    gulp.src("src/shablonizator.php")
        .pipe(through2(function(file, enc, callback){
            var text = file.contents.toString();

            text = text.replace(/<head>[\S\s]*?<\/head>/gim, function(str, offset, s) {
                return "\<head>\n\
    <title>Шаблонизатор</title>\n\
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\
    <meta charset=\"utf-8\">\n\
    <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,400italic' rel='stylesheet' type='text/css'>\n\
    <script type=\"text/javascript\" src=\"shablonizator/ace/ace.js\"></script>\n\
	<link rel=\"stylesheet\" href=\"shablonizator/all.min.css\">\n\
    <script type=\"text/javascript\" src=\"shablonizator/all.min.js\"></script>\n\
</head>";
            });

            file.contents = new Buffer( text );
            callback(null, file);
        }))
        .pipe(gulp.dest("build"));
});

gulp.task('style', function () {
    gulp.src([
        "src/shablonizator/css/reset.css",
        "src/shablonizator/css/ui-lightness/*.css",
        "src/shablonizator/css/bootstrap.css",
        "src/shablonizator/css/bootstrap-theme.css",
        "src/shablonizator/css/font-awesome.min.css",
        "src/shablonizator/js/selectpicker/*.css",
        "src/shablonizator/js/malihu-custom-scrollbar/*.css",
        "src/shablonizator/js/mylib/file-navigator/*.css",
        "src/shablonizator/js/mylib/page-manager-visualizator/*.css",
        "src/shablonizator/js/mylib/pixel-perfect/*.css",
        "src/shablonizator/js/mylib/editor/*.css",
        "src/shablonizator/js/mylib/live-style/*.css",
        "src/shablonizator/js/mylib/generator-code/*.css",
        "src/shablonizator/css/main.css"
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
        .pipe(gulp.dest("build/shablonizator"));
});

//js
gulp.task('js', function () {
    gulp.src([
            "src/shablonizator/js/jquery-1.11.2.min.js",
            "src/shablonizator/js/jquery-ui-1.11.3.min.js",
            "src/shablonizator/js/bootstrap.min.js",
            "src/shablonizator/js/selectpicker/bootstrap-select.min.js",
            "src/shablonizator/js/selectpicker/i18n/defaults-ru_RU.js",

            "src/shablonizator/js/ace/ext-emmet.js",
            "src/shablonizator/js/emmet.js",
            "src/shablonizator/js/ace/ext-modelist.js",
            "src/shablonizator/js/ace/ext-options.js",
            "src/shablonizator/js/ace/ext-elastic_tabstops_lite.js",
            "src/shablonizator/js/ace/ext-keybinding_menu.js",
            "src/shablonizator/js/ace/ext-language_tools.js",
            "src/shablonizator/js/ace/ext-searchbox.js",
            "src/shablonizator/js/ace/ext-settings_menu.js",
            "src/shablonizator/js/ace/ext-spellcheck.js",
            "src/shablonizator/js/ace/ext-split.js",
            "src/shablonizator/js/ace/ext-static_highlight.js",
            "src/shablonizator/js/ace/ext-statusbar.js",
            "src/shablonizator/js/ace/ext-textarea.js",
            "src/shablonizator/js/ace/ext-themelist.js",
            "src/shablonizator/js/ace/ext-whitespace.js",
            "src/shablonizator/js/ace/keybinding-emacs.js",
            "src/shablonizator/js/ace/keybinding-vim.js",

            "src/shablonizator/js/jquery.zclip.js",

            "src/shablonizator/js/malihu-custom-scrollbar/jquery.mCustomScrollbar.concat.min.js",

            "src/shablonizator/js/greensock/TimelineMax.min.js",
            "src/shablonizator/js/greensock/TweenMax.min.js",

            "src/shablonizator/js/global.js",

            "src/shablonizator/js/mylib/file-navigator/*.js",
            "src/shablonizator/js/mylib/page-manager-visualizator/*.js",
            "src/shablonizator/js/mylib/pixel-perfect/*.js",
            "src/shablonizator/js/mylib/editor/*.js",
            "src/shablonizator/js/mylib/live-style/*.js",
            "src/shablonizator/js/mylib/generator-code/*.js",

            "src/shablonizator/js/main.js",
        ])
        .pipe(concat("all.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/shablonizator"));
});

gulp.task('swf:for_zclip', function () {
    gulp.src([
            "src/shablonizator/**/*.swf"
        ])
        .pipe(gulp.dest("build/shablonizator/"));
});

gulp.task('js:ace', function () {
    gulp.src([
            "src/shablonizator/js/ace/**/*.js"
        ])
        .pipe(uglify())
        .pipe(gulp.dest("build/shablonizator/ace"));
});

//content
gulp.task('content', function () {
    gulp.src([
            "src/shablonizator/css/ui-lightness/images/*.{jpg,png,gif,svg}",
            "src/shablonizator/fonts/*.{otf,eot,svg,ttf,woff,woff2}",
            "src/shablonizator/js/malihu-custom-scrollbar/*.{otf,eot,svg,ttf,woff,woff2}",
            "src/shablonizator/js/mylib/file-navigator/img/*.{jpg,png,gif,svg}",
            "src/shablonizator/js/mylib/page-manager-visualizator/img/*.{jpg,png,gif,svg}",
            "src/shablonizator/js/mylib/pixel-perfect/img/*.{jpg,png,gif,svg}",
            "src/shablonizator/js/mylib/editor/img/*.{jpg,png,gif,svg}",
            "src/shablonizator/js/mylib/live-style/img/*.{jpg,png,gif,svg}",
            "src/shablonizator/js/mylib/generator-code/img/*.{jpg,png,gif,svg}"
        ])
        .pipe(gulp.dest("build/shablonizator/content"));
});

gulp.task('php', function () {
    gulp.src("src/shablonizator/**/*.{php,xml}")
        .pipe(gulp.dest("build/shablonizator"));
});

gulp.task('generators', function () {
    gulp.src("src/generators/**/*.*")
        .pipe(gulp.dest("build/generators"));
});

gulp.task('scss_less_compiler', function () {
    gulp.src("src/scss_less_compiler/**/*.*")
        .pipe(gulp.dest("build/scss_less_compiler"));
});

gulp.task('scrins', function () {
    gulp.src("src/shablonizator/scrins/**/*.{jpg,png}")
        .pipe(gulp.dest("build/shablonizator/scrins"));
});

gulp.task('miniatyrki', function () {
    gulp.src("src/shablonizator/miniatyrki/**/*.{jpg,png}")
        .pipe(gulp.dest("build/shablonizator/miniatyrki"));
});

mkdirp('build/shablonizator/scrins', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});

mkdirp('build/shablonizator/miniatyrki', function (err) {
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
    'shablonizator.php',
    'style',
    "js",
    "swf:for_zclip",
    "js:ace",
    'content',
    'php',
    'generators',
    'scss_less_compiler',
	'scrins',
	'miniatyrki'
]);

gulp.task('default', ['build']);