'use strict';
var fs   = require('fs'),
    gulp = require('gulp'),
    path = require('path'),
    sizeOf = require('image-size');

var ____;
var __ = function(dirSessionFile) {
    this.dirSessionFile = dirSessionFile;
    ____ = this;
};

__.startSession = function(dirSessionFile) {
    this.sessionChange = false;

    return new __(dirSessionFile);
};

__.prototype.get = function() {
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
        } else {
            resolve(____.data);
        }

        //Доп. функция для продолжения выполнения
        function next() {
            fs.readFile( path.normalize(path.join(____.dirSessionFile, '/session.json')), { encoding: 'utf8' }, function(error, session) {
                if (!error) {
                    ____.data = JSON.parse(session);
                    //Сканируем скриншоты в папке
                    ____.pathThumbnails = path.normalize(path.join(____.dirSessionFile, '/design-thumbnails'));
                    ____.data.globalSession.designScreenshots = parseScreenshotsList(____.dirSessionFile);
                    //Уничтожаем скриншоты которых нету из скриншотов привязанных к разрешениям и страницам
                    RemoveNonExistentRelatedScreenshots();
                    resolve(____.data);
                } else {
                    throw (error);
                }
            });
        }

        function RemoveNonExistentRelatedScreenshots() {
            //nestet to object list
            var screenshotsObjList = {};
            (function recursion(arr) {
                for(var i in arr) {
                    var el = arr[i];
                    if(el.type == "file") {
                        screenshotsObjList[el.urn] = true;
                    }
                    if("sub" in el) {
                        recursion(el.sub);
                    }
                }
            })(____.data.globalSession.designScreenshots);

            //Проверяем на существование каждого привязанного скриншота на существование в общем списке скриншотов
            for(var page in ____.data.globalSession.designScreenshotsRelatedResolutionAndPage) {
                var resolutions = ____.data.globalSession.designScreenshotsRelatedResolutionAndPage[page];
                for(var resolution in resolutions) {
                    resolutions[resolution] = resolutions[resolution].filter(function(item) {
                        return item.urn in screenshotsObjList;
                    });
                    if(resolutions[resolution].length == 0) {
                        delete resolutions[resolution];
                    }
                }
                var counterResolutions = 0;
                for(var resolution in resolutions) {
                    counterResolutions++;
                }
                if(!counterResolutions) {
                    delete ____.data.globalSession.designScreenshotsRelatedResolutionAndPage[page];
                }
            }
        }
        function parseScreenshotsList(dir) {
            var path = path || require('path');
            var fs = fs || require('fs'),
                files = fs.readdirSync(dir);
            var filelist = [];
            files.forEach(function(file) {
                //Исключаем папку с миниатюрами
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    if(____.pathThumbnails != path.join(dir, file)) {
                        filelist.push({
                            type: "folder",
                            name: file,
                            urn: path.normalize(path.join(dir, file).slice((____.dirSessionFile+"/").length)),
                            sub: parseScreenshotsList(path.join(dir, file))
                        });
                    }
                }
                else {
                    //изображение ли это
                    if(/.(jpg|png)$/gim.test(file)) {
                        var dimensions = sizeOf(path.join(dir, file));
                        filelist.push({
                            type: "file",
                            name: file,
                            urn: path.normalize(path.join(dir, file).slice((____.dirSessionFile+"/").length)),
                            w: dimensions.width,
                            h: dimensions.height
                        });
                    }
                }
            });
            return filelist;
        }
    });
};
__.prototype.save = function() {
    //Удаляем данные которые были загружены не из файла
    ____.data.globalSession.designScreenshots = [];
    //

    fs.writeFile( path.normalize(path.join(____.dirSessionFile, '/session.json')), JSON.stringify(____.data), 'utf8', function(error) {
        if(error) {
            throw (error);
        }
    });
};

__.prototype.connect = function(socket) {
    socket.emit('session.load', ____.data);
    
    /*********************************/
    /*Общая синхронизация*/
    /*********************************/

    /*Синхронизации сессий*/
    socket.on('global.changeSessionGroups', function(listGroupsAndActiveParameters) {
        ____.data.sessionGroupSynchronizations = listGroupsAndActiveParameters;
        ____.sessionChange = true;
        
        socket.broadcast.emit('global.changeSessionGroups', listGroupsAndActiveParameters);
    });

    /*Страницы*/
    /*socket.on('global.modified_pages', function (data) {
        ____.data.globalSession.pages = data;
        ____.sessionChange = true;
    });*/
    /*Разрешения экрана*/
    /*Скриншоты*/

    /******************************************************/
    /*Синхронизация по группам сессий и сохранение в cookies
     * если браузер неподключён ни к одной из групп*/
    /******************************************************/

    /*Синхронизации сессий*/
    /*Страницы*/
    /*Разрешения экрана*/
    /*Айфрейм с вёрсткой*/
}

module.exports = __;