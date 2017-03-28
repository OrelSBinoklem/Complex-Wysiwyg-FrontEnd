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
                    if(!haveParam) {
                        sessionGroupsForNames[name].synchroParams.push(nameParam);
                    }
                }
            } else {
                for(var key in sessionGroupsForNames[name].synchroParams) {
                    if(nameParam == sessionGroupsForNames[name].synchroParams[key]) {
                        sessionGroupsForNames[name].synchroParams.splice(key, 1);
                        break;
                    }
                }
            }

            socket.emit('global.sessionActivatedParam', {
                name: name,
                nameParam: nameParam,
                activated: activated,
                synchroParams: sessionGroupsForNames[name].synchroParams
            });
        }
        socket.on('global.sessionActivatedParam', function(listGroupsAndActiveParameters) {
            ____.data.sessionGroupSynchronizations = listGroupsAndActiveParameters;

            ____.responseHandlers["onChangeSessionGroups"]();
        });
        
        /*Страницы*/
        /*this.savePages = function() {
            socket.emit('global.modified_pages', ____.data.globalSession.pages);
        }*/
        /*Разрешения экрана*/
        /*Скриншоты*/

        /******************************************************/
        /*Синхронизация по группам сессий и сохранение в cookies
        * если браузер неподключён ни к одной из групп*/
        /******************************************************/
        this.getLocalSessionParams = function() {
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

                            for(var param in activeGroups) {
                                if(!(param in resObj)) {
                                    resObj[param] = dataSession[param];
                                }
                            }
                        }
                        //Добавим и то что в куках
                        if($.cookie('adaptive_pixel_perfect_browser_session') !== undefined) {
                            var dataSession = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_browser_session'));
                            for(var param in dataSession) {
                                if(!(param in resObj)) {
                                    resObj[param] = dataSession[param];
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
        this.changePage = function(page) {
            socket.emit('local.change_page', page);

            //Сохраняем в куки
            if($.cookie('adaptive_pixel_perfect_browser_session') === undefined) {
                var dataSession = {
                    "pages": {
                        "currentPage": page
                    }
                }
                $.cookie('adaptive_pixel_perfect_browser_session', $.toJSON(dataSession));

            } else {
                var dataSession = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_browser_session'));
                if(!("pages" in dataSession)) {
                    dataSession.pages = {
                        "currentPage": page
                    }
                } else {
                    dataSession.pages.currentPage = page;
                }
                $.cookie('adaptive_pixel_perfect_browser_session', $.toJSON(dataSession));
            }
        }
        socket.on('local.change_page', function(page) {
            $("body").trigger("synchro.changed_page", [page]);
        });
        /*Разрешения экрана*/
        /*Айфрейм с вёрсткой*/

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