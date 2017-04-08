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

            //nestet pages to object list
            var pagesObjList = {};
            (function recursion(arr) {
                for(var i in arr) {
                    var el = arr[i];
                    if(el.type == "page") {
                        pagesObjList[el.urn] = true;
                    }
                    if("sub" in el) {
                        recursion(el.sub);
                    }
                }
            })(____.data.globalSession.pages);

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
                } else {
                    //Проверяем на существование данной страницы
                    if(!(page in pagesObjList)) {
                        delete ____.data.globalSession.designScreenshotsRelatedResolutionAndPage[page];
                    }
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
    var designScreenshots = ____.data.globalSession.designScreenshots;
    ____.data.globalSession.designScreenshots = [];
    //

    fs.writeFile( path.normalize(path.join(____.dirSessionFile, '/session.json')), JSON.stringify(____.data), 'utf8', function(error) {
        if(error) {
            throw (error);
        }
    });

    ____.data.globalSession.designScreenshots = designScreenshots;
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
    ____.sinhroOneEvent('sessionActivatedParam', socket);

    /*Страницы*/
    ____.sinhroOneEvent('global.changePages', socket);
    ____.sinhroOneEvent('global.updatePageOrGroup', socket);
    /*Разрешения экрана*/
    ____.sinhroOneEvent('global.changeResolutions', socket);
    /*Скриншоты*/
    ____.sinhroOneEvent('global.changeScreenshots', socket);
    ____.sinhroOneEvent('global.fastChangeScreenshots', socket);
    ____.sinhroOneEvent('global.collapseUncollapseScreenshotsFolder', socket);

    /******************************************************/
    /*Синхронизация по группам сессий и сохранение в cookies
     * если браузер неподключён ни к одной из групп*/
    /******************************************************/

    /*Синхронизации сессий*/
    /*Страницы*/
    ____.sinhroOneEvent('local.selectPage', socket);
    /*Разрешения экрана*/
    ____.sinhroOneEvent('local.selectResolution', socket);
    ____.sinhroOneEvent('local.HTMLOrDesign', socket);
    /*Айфрейм с вёрсткой*/
    ____.sinhroOneEvent('local.resizeIFrame', socket);
    ____.sinhroOneEvent('local.changePosIFrame', socket);
    ____.sinhroOneEvent('local.scrollIFrame', socket);
}

__.prototype.sinhroOneEvent = function(name, socket) {
    var isGlobal = /^global\./gim.test(name);
    var isLocal = /^local\./gim.test(name);

    socket.on(name, function(o) {
        if(isGlobal) {
            ____.setNesteedParamInObj(o.nesteedName, o.val, ____.data.globalSession);
        } else if(isLocal) {
            ____.setNesteedParamInLocalSession(o.nesteedName, o.val, o.activeGroups);
        } else {
            ____.setNesteedParamInObj(o.nesteedName, o.val, ____.data);
        }

        //console.log(____.data.sessionGroupSynchronizations[3].data.pages.currentPage);

        //Помечаем что были изменения и отправляем событие остальным
        ____.sessionChange = true;

        socket.broadcast.emit(name, o);
    });
}

//Сохранить вложенный параметр в обьект сессии
__.prototype.setNesteedParamInLocalSession = function(nesteedName, val, activeGroups) {
    var nesteedNameArr = nesteedName.split("|");
    if(____.data.sessionGroupSynchronizations.length) {
        if (activeGroups !== undefined) {
            //список в обьект по именам групп сессий
            var sessionGroupsForNames = {};
            for (var key in ____.data.sessionGroupSynchronizations) {
                var one = ____.data.sessionGroupSynchronizations[key];
                sessionGroupsForNames[one.name] = one;
            }

            for (var key in activeGroups) {
                if(activeGroups[key] in sessionGroupsForNames) {
                    var activeParams = sessionGroupsForNames[activeGroups[key]].synchroParams;
                    var dataSession = sessionGroupsForNames[activeGroups[key]].data;

                    for (var i in activeParams) {
                        var param = activeParams[i];
                        if(nesteedNameArr[0] == param) {
                            ____.setNesteedParamInObj(nesteedName, val, dataSession);
                            break;
                        }
                    }
                }
            }
        }
    }
}

//Сохранить вложенный параметр в переданный обьект
__.prototype.setNesteedParamInObj = function(nesteedName, val, obj) {
    nesteedName = nesteedName.split("|");

    var i = 0;
    var curObj = obj;
    while(i < nesteedName.length) {
        var isArr = /^\[[\S\s]*\]$/gim.test(nesteedName[i]);
        if(!isArr) {
            if(i >= nesteedName.length - 1) {
                //Последний
                curObj[nesteedName[i]] = val;
            } else {
                if(!(nesteedName[i] in curObj)) {
                    if(/^\[[\S\s]*\]$/gim.test(nesteedName[i + 1])) {
                        curObj[nesteedName[i]] = [];
                    } else {
                        curObj[nesteedName[i]] = {};
                    }
                }
                curObj = curObj[nesteedName[i]];
            }
        } else {
            var nameVal = nesteedName[i].substring(1, nesteedName[i].length - 1).split("=");
            var propertyName = nameVal[0];
            var propertyVal = nameVal[1];

            if(i >= nesteedName.length - 1) {
                //Последний
                setInArr(propertyName, propertyVal, curObj, val);
            } else {
                curObj = getInArr(propertyName, propertyVal, curObj);
            }
        }

        i++;
    }

    function setInArr(propertyName, propertyVal, arr, val) {
        var notExists = true;
        for(var key in arr) {
            if(propertyVal == arr[key][propertyName]) {
                arr[key] = val;

                notExists = false;
                break;
            }
        }

        if(notExists) {
            arr.push(val);
        }
    }
    function getInArr(propertyName, propertyVal, arr) {
        var notExists = true;
        var res;

        for(var key in arr) {
            if(propertyVal == arr[key][propertyName]) {
                res = arr[key];

                notExists = false;
            }
        }

        if(notExists) {
            res = {};
            res[propertyName] = propertyVal;
            arr.push(res);
        }

        return res;
    }
}

module.exports = __;