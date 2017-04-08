(function($){
    var sessionModel = function(data, socket) {
        var ____ = this;
        ____.data = data;
        ____.responseHandlers = {};

        /*********************************/
        /*Общая синхронизация*/
        /*********************************/

        /*Синхронизации сессий*/
        this.onChangeSessionGroups = function(listGroupsAndActiveParameters) {
            var sessionGroupsForNames = {};
            for(var key in ____.data.sessionGroupSynchronizations) {
                var one = ____.data.sessionGroupSynchronizations[key];
                sessionGroupsForNames[one.name] = one;
            }

            for(var i in listGroupsAndActiveParameters) {
                var one = listGroupsAndActiveParameters[i];
                if(one.name in sessionGroupsForNames) {
                    one.data = sessionGroupsForNames[one.name].data;
                } else {
                    one.data = {};
                }
            }
            ____.data.sessionGroupSynchronizations = listGroupsAndActiveParameters;



            socket.emit('global.changeSessionGroups', listGroupsAndActiveParameters);
        }
        socket.on('global.changeSessionGroups', function(listGroupsAndActiveParameters) {
            ____.data.sessionGroupSynchronizations = listGroupsAndActiveParameters;

            ____.responseHandlers["onChangeSessionGroups"]();
        });

        this.onSessionActivatedParam = function(name, nameParam, activated) {
            var sessionGroupsForNames = {};
            for(var key in ____.data.sessionGroupSynchronizations) {
                var one = ____.data.sessionGroupSynchronizations[key];
                sessionGroupsForNames[one.name] = one;
            }

            if(activated) {
                var haveParam = false;
                for(var key in sessionGroupsForNames[name].synchroParams) {
                    if(nameParam == sessionGroupsForNames[name].synchroParams[key]) {
                        haveParam = true;
                        break;
                    }
                }
                if(!haveParam) {
                    sessionGroupsForNames[name].synchroParams.push(nameParam);
                }
            } else {
                for(var key in sessionGroupsForNames[name].synchroParams) {
                    if(nameParam == sessionGroupsForNames[name].synchroParams[key]) {
                        sessionGroupsForNames[name].synchroParams.splice(key, 1);
                        break;
                    }
                }
            }

            socket.emit('sessionActivatedParam', {
                nesteedName: "sessionGroupSynchronizations|[name="+name+"]|synchroParams",
                val: sessionGroupsForNames[name].synchroParams,

                name: name,
                nameParam: nameParam,
                activated: activated
            });
        }
        socket.on('sessionActivatedParam', function(o) {
            ____.saveNesteedParamInSession(o.nesteedName, o.val);

            ____.responseHandlers["onSessionActivatedParam"](o.name, o.nameParam, o.activated);
        });
        
        /*Страницы*/
        this.onChangePages = function(pages) {
            socket.emit('global.changePages', {
                nesteedName: "pages",
                val: pages
            });

            ____.saveNesteedParamInGlobalSession("pages", pages);
        }
        socket.on('global.changePages', function(o) {
            ____.saveNesteedParamInGlobalSession(o.nesteedName, o.val);

            ____.responseHandlers["onChangePages"]();
        });

        this.onUpdatePageOrGroup = function(pages) {
            socket.emit('global.updatePageOrGroup', {
                nesteedName: "pages",
                val: pages
            });

            ____.saveNesteedParamInGlobalSession("pages", pages);
        }
        socket.on('global.updatePageOrGroup', function(o) {
            ____.saveNesteedParamInGlobalSession(o.nesteedName, o.val);

            ____.responseHandlers["onUpdatePageOrGroup"]();
        });

        /*Разрешения экрана*/
        this.onChangeResolutions = function(resolutions) {
            socket.emit('global.changeResolutions', {
                nesteedName: "resolutions",
                val: resolutions
            });

            ____.saveNesteedParamInGlobalSession("resolutions", resolutions);
        }
        socket.on('global.changeResolutions', function(o) {
            ____.saveNesteedParamInGlobalSession(o.nesteedName, o.val);

            ____.responseHandlers["onChangeResolutions"]();
        });

        /*Скриншоты*/
        this.onChangeScreenshots = function(screenshotsForCurPage) {
            var lS = ____.getLocalSessionParams();
            if(lS && "pages" in lS && lS.pages.currentPage !== null) {
                socket.emit('global.changeScreenshots', {
                    nesteedName: "designScreenshotsRelatedResolutionAndPage|"+lS.pages.currentPage,
                    val: screenshotsForCurPage
                });
            }

            ____.saveNesteedParamInGlobalSession("designScreenshotsRelatedResolutionAndPage|"+lS.pages.currentPage, screenshotsForCurPage);
        }
        socket.on('global.changeScreenshots', function(o) {
            ____.saveNesteedParamInGlobalSession(o.nesteedName, o.val);

            ____.responseHandlers["onChangeScreenshots"]();
        });

        this.onFastChangeScreenshots = function(screenshotsForCurPage) {
            var lS = ____.getLocalSessionParams();
            if(lS && "pages" in lS && lS.pages.currentPage !== null) {
                socket.emit('global.fastChangeScreenshots', {
                    nesteedName: "designScreenshotsRelatedResolutionAndPage|"+lS.pages.currentPage,
                    val: screenshotsForCurPage
                });
            }

            ____.saveNesteedParamInGlobalSession("designScreenshotsRelatedResolutionAndPage|"+lS.pages.currentPage, screenshotsForCurPage);
        }
        socket.on('global.fastChangeScreenshots', function(o) {
            ____.saveNesteedParamInGlobalSession(o.nesteedName, o.val);

            ____.responseHandlers["onFastChangeScreenshots"]();
        });

        this.onCollapseUncollapseScreenshotsFolder = function(designScreenshotsFoldersUncollapsed) {
                socket.emit('global.collapseUncollapseScreenshotsFolder', {
                    nesteedName: "designScreenshotsFoldersUncollapsed",
                    val: designScreenshotsFoldersUncollapsed
                });

            ____.saveNesteedParamInGlobalSession("designScreenshotsFoldersUncollapsed", designScreenshotsFoldersUncollapsed);
        }
        socket.on('global.collapseUncollapseScreenshotsFolder', function(o) {
            ____.saveNesteedParamInGlobalSession(o.nesteedName, o.val);

            ____.responseHandlers["onCollapseUncollapseScreenshotsFolder"]();
        });

        /******************************************************/
        /*Синхронизация по группам сессий и сохранение в cookies
        * если браузер неподключён ни к одной из групп*/
        /******************************************************/
        //Получаем каскад параметров из локальной сессии но также параметры полученные из обьекта сесси но которых нету в куках - записываем в куки
        this.getLocalSessionParams = function(notCookie) {
            if(____.data.sessionGroupSynchronizations.length) {
                if($.cookie('adaptive_pixel_perfect_groups_session') !== undefined) {
                    var sessionGroups = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_groups_session')).groups;

                    //список в обьект по именам групп сессий
                    var sessionGroupsForNames = {};
                    for(var key in ____.data.sessionGroupSynchronizations) {
                        var one = ____.data.sessionGroupSynchronizations[key];
                        sessionGroupsForNames[one.name] = one;
                    }

                    //Удаляем имена выбранных групп которых уже нету
                    sessionGroups.filter(function(item, i, arr) {
                        return item in sessionGroupsForNames;
                    });

                    $.cookie('adaptive_pixel_perfect_groups_session', $.toJSON({"groups": sessionGroups}));
                    if(!sessionGroups.length) {
                        $.removeCookie('adaptive_pixel_perfect_groups_session');
                        return notObjectSession();
                    } else {
                        var resObj = {};
                        for(var key in sessionGroups) {
                            var activeGroups = sessionGroupsForNames[sessionGroups[key]].synchroParams;
                            var dataSession = sessionGroupsForNames[sessionGroups[key]].data;

                            for(var i in activeGroups) {
                                var param = activeGroups[i];
                                if(!(param in resObj) && param in dataSession) {
                                    resObj[param] = dataSession[param];
                                }
                            }
                        }

                        //Пишем в куки
                        (function() {
                            var isExistParams = false;
                            var dataSession;
                            if($.cookie('adaptive_pixel_perfect_browser_session') !== undefined) {
                                dataSession = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_browser_session'));
                            } else {
                                dataSession = {};
                            }

                            for(var key in resObj) {
                                isExistParams = true;
                                dataSession[key] = resObj[key];
                            }
                            if(isExistParams) {
                                $.cookie('adaptive_pixel_perfect_browser_session', $.toJSON(dataSession));
                            }
                        })();

                        //Добавим и то что в куках
                        if(!(notCookie !== undefined && notCookie)) {
                            if($.cookie('adaptive_pixel_perfect_browser_session') !== undefined) {
                                var dataSession = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_browser_session'));
                                for(var param in dataSession) {
                                    if(!(param in resObj)) {
                                        resObj[param] = dataSession[param];
                                    }
                                }
                            }
                        }

                        return resObj;
                    }
                } else {
                    return notObjectSession();
                }
            } else {
                if($.cookie('adaptive_pixel_perfect_groups_session') !== undefined) {
                    $.removeCookie('adaptive_pixel_perfect_groups_session');
                }
                return notObjectSession();
            }

            function notObjectSession() {
                //Берём сессию для текущего браузера из куков
                if($.cookie('adaptive_pixel_perfect_browser_session') !== undefined) {
                    //Берём сессию для текущего браузера из куков
                    return $.secureEvalJSON($.cookie('adaptive_pixel_perfect_browser_session'));
                } else {
                    return false;
                }
            }
        }

        /*Синхронизации сессий*/
        this.onSessionActivatedGroup = function(name, activated) {
            var sessionGroups = undefined;
            if(____.data.sessionGroupSynchronizations.length) {
                if(activated) {
                    if($.cookie('adaptive_pixel_perfect_groups_session') !== undefined) {
                        sessionGroups = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_groups_session')).groups;
                    } else {
                        sessionGroups = [];
                    }
                    //Если данной группы нет то добавляем
                    var haveGroup = false;
                    for(var key in sessionGroups) {
                        if(sessionGroups[key] === name) {
                            haveGroup = true;
                            break;
                        }
                    }
                    if(!haveGroup) {
                        sessionGroups.push(name);
                    }
                    //
                    validate();
                } else {
                    if($.cookie('adaptive_pixel_perfect_groups_session') !== undefined) {
                        sessionGroups = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_groups_session')).groups;
                        //Удаляем группу если есть
                        for(var key in sessionGroups) {
                            if(sessionGroups[key] === name) {
                                sessionGroups.splice(key, 1);
                                break;
                            }
                        }
                        //
                        validate();
                    }
                }
            }

            function validate() {
                //список в обьект по именам групп сессий
                var sessionGroupsForNames = {};
                for(var key in ____.data.sessionGroupSynchronizations) {
                    var one = ____.data.sessionGroupSynchronizations[key];
                    sessionGroupsForNames[one.name] = one;
                }

                //Удаляем имена выбранных групп которых уже нету
                sessionGroups.filter(function(item, i, arr) {
                    return item in sessionGroupsForNames;
                });
                $.cookie('adaptive_pixel_perfect_groups_session', $.toJSON({"groups": sessionGroups}));
                if(!sessionGroups.length) {
                    $.removeCookie('adaptive_pixel_perfect_groups_session');
                }
            }
        }

        /*Страницы*/
        this.onSelectPage = function(page) {
            socket.emit('local.selectPage', {
                nesteedName: "pages|currentPage",
                val: page,
                activeGroups: ____.getSynchroGroupsThisBrowser()
            });

            //Сохраняем
            ____.setNesteedParamInLocalSessionAndCookie("pages|currentPage", page);
        }
        socket.on('local.selectPage', function(o) {
            ____.setNesteedParamInLocalSession("pages.currentPage", o.val, o.activeGroups);

            ____.responseHandlers["onSelectPage"](o);
        });

        /*Разрешения экрана*/
        this.onSelectResolution = function(resolution) {
            socket.emit('local.selectResolution', {
                nesteedName: "resolutions|currentResolution",
                val: resolution,
                activeGroups: ____.getSynchroGroupsThisBrowser()
            });

            //Сохраняем
            ____.setNesteedParamInLocalSessionAndCookie("resolutions|currentResolution", resolution);
        }
        socket.on('local.selectResolution', function(o) {
            ____.setNesteedParamInLocalSession(o.nesteedName, o.val, o.activeGroups);

            ____.responseHandlers["onSelectResolution"](o);
        });

        this.onHTMLOrDesign = function(state) {
            socket.emit('local.HTMLOrDesign', {
                nesteedName: "resolutions|showPageProofsOrDesign",
                val: state,
                activeGroups: ____.getSynchroGroupsThisBrowser()
            });

            //Сохраняем
            ____.setNesteedParamInLocalSessionAndCookie("resolutions|showPageProofsOrDesign", state);
        }
        socket.on('local.HTMLOrDesign', function(o) {
            ____.setNesteedParamInLocalSession(o.nesteedName, o.val, o.activeGroups);

            ____.responseHandlers["onHTMLOrDesign"]();
        });

        /*Айфрейм с вёрсткой*/
        this.onResizeIFrame = function(size) {
            socket.emit('local.resizeIFrame', {
                nesteedName: "iframe|size",
                val: size,
                activeGroups: ____.getSynchroGroupsThisBrowser()
            });

            //Сохраняем
            ____.setNesteedParamInLocalSessionAndCookie("iframe|size", size);
        }
        socket.on('local.resizeIFrame', function(o) {
            ____.setNesteedParamInLocalSession("iframe|size", o.val, o.activeGroups);

            ____.responseHandlers["onResizeIFrame"](o);
        });

        this.onChangePosIFrame = function(position) {
            socket.emit('local.changePosIFrame', {
                nesteedName: "iframe|position",
                val: position,
                activeGroups: ____.getSynchroGroupsThisBrowser()
            });

            //Сохраняем
            ____.setNesteedParamInLocalSessionAndCookie("iframe|position", position);
        }
        socket.on('local.changePosIFrame', function(o) {
            ____.setNesteedParamInLocalSession("iframe|position", o.val, o.activeGroups);

            ____.responseHandlers["onChangePosIFrame"](o);
        });

        this.onScrollIFrame = function(position) {
            socket.emit('local.scrollIFrame', {
                nesteedName: "iframe|scroll",
                val: position,
                activeGroups: ____.getSynchroGroupsThisBrowser()
            });

            //Сохраняем
            ____.setNesteedParamInLocalSessionAndCookie("iframe|scroll", position);
        }
        socket.on('local.scrollIFrame', function(o) {
            ____.setNesteedParamInLocalSession("iframe|scroll", o.val, o.activeGroups);

            ____.responseHandlers["onScrollIFrame"](o);
        });

        /******************************************************/
        /*Сохранение данных и другие вспомогательные методы*/
        /******************************************************/

        //Сохранить вложенный параметр в обьект сессии
        this.saveNesteedParamInSession = function(nesteedName, val) {
            ____.setNesteedParamInObj(nesteedName, val, ____.data);
        }

        //Сохранить вложенный параметр в куки и обьект глобальной сессии
        this.saveNesteedParamInGlobalSession = function(nesteedName, val) {
            ____.setNesteedParamInObj(nesteedName, val, ____.data.globalSession);
        }

        //Сохранить вложенный параметр в куки и обьект локальной сессии
        this.setNesteedParamInLocalSessionAndCookie = function(nesteedName, val) {
            ____.setNesteedParamInCookie(nesteedName, val);
            ____.setNesteedParamInLocalSessionWithActiveGroups(nesteedName, val);
        }

        //Сохранить вложенный параметр в обьект сессии с учётом активных групп
        this.setNesteedParamInLocalSessionWithActiveGroups = function(nesteedName, val) {
            ____.setNesteedParamInLocalSession(nesteedName, val, ____.getSynchroGroupsThisBrowser())
        }

            //Сохранить вложенный параметр в обьект сессии
            this.setNesteedParamInLocalSession = function(nesteedName, val, activeGroups) {
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
                                        //console.log(dataSession);
                                        ____.setNesteedParamInObj(nesteedName, val, dataSession);
                                        //console.log(dataSession);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
                this.getSynchroGroupsThisBrowser = function() {
                    if ($.cookie('adaptive_pixel_perfect_groups_session') !== undefined) {
                        return $.secureEvalJSON($.cookie('adaptive_pixel_perfect_groups_session')).groups;
                    }
                    return undefined;
                }

        //Сохранить вложенный параметр в куки
        this.setNesteedParamInCookie = function(nesteedName, val) {
            var dataSession;
            if($.cookie('adaptive_pixel_perfect_browser_session') === undefined) {
                dataSession = {};
            } else {
                dataSession = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_browser_session'));
            }
            ____.setNesteedParamInObj(nesteedName, val, dataSession);
            $.cookie('adaptive_pixel_perfect_browser_session', $.toJSON(dataSession));
        }

        //Сохранить вложенный параметр в переданный обьект
        this.setNesteedParamInObj = function(nesteedName, val, obj) {
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

        //Получить обьект страницы
        this.getPage = function(urn) {
            return (function recursion(el) {

                for(var i in el) {
                    if(el[i].type == "page" && el[i].urn == urn) {
                        return el[i];
                    } else if("sub" in el[i]) {
                        var r = recursion(el[i].sub);
                        if(r !== false) {
                            return r;
                        }
                    }
                }

                return false;
            })(____.data.globalSession.designScreenshots);
        }

        //Получить обьект группы
        this.getGroup = function(name) {
            return (function recursion(el) {

                for(var i in el) {
                    if(el[i].type == "group" && el[i].name == name) {
                        return el[i];
                    } else if("sub" in el[i]) {
                        var r = recursion(el[i].sub);
                        if(r !== false) {
                            return r;
                        }
                    }
                }

                return false;
            })(____.data.globalSession.pages);
        }

        //Получить коллекцию скриншотов привязанных к текущей странице и разрешению
        this.getCurrentRelatedScreenshotsCollection = function() {
            var localSession = ____.getLocalSessionParams();

            //Проверка страницы
            if(localSession && "pages" in localSession && localSession.pages.currentPage !== null) {
                var currentPage = localSession.pages.currentPage;

                //Проверка разрешения
                if("resolutions" in localSession && localSession.resolutions.currentResolution !== null) {
                    var resolution = localSession.resolutions.currentResolution;

                    var screenshots = ____.data.globalSession.designScreenshots,
                        screenshotsRelated = ____.data.globalSession.designScreenshotsRelatedResolutionAndPage;

                    //Проверка привязанных скриншотов
                    if(currentPage in screenshotsRelated && (resolution.w+"|"+resolution.h) in  screenshotsRelated[currentPage]) {
                        return screenshotsRelated[currentPage][resolution.w+"|"+resolution.h];
                    }
                }
            }
            return null;
        }

        //Получить скриншоты в виде обьекта {urn: obj}
        this.getScreenshotsObjList = function() {
            var screenshotsObjList = {};
            (function recursion(arr) {
                for (var i in arr) {
                    var el = arr[i];
                    if (el.type == "file") {
                        screenshotsObjList[el.urn] = el;
                    }
                    if ("sub" in el) {
                        recursion(el.sub);
                    }
                }
            })(____.data.globalSession.designScreenshots);
            return screenshotsObjList;
        }
    }

    modules.sessionModel = sessionModel;

})(jQuery);