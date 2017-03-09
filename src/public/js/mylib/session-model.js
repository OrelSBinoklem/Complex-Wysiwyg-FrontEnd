(function($){
    var sessionModel = function(data, socket) {
        var ____ = this;
        ____.data = data;
        ____.globalSession = ____.data.globalSession;
        ____.sessionGroupSynchronizations = ____.data.sessionGroupSynchronizations;

        /*********************************/
        /*Общая синхронизация*/
        /*********************************/

        /*Синхронизации сессий*/
        this.menuJsonToGroupsSessionJson = function(listGroupsAndActiveParameters) {
            var sessionGroupsForNames = {};
            for(var key in ____.sessionGroupSynchronizations) {
                var one = ____.sessionGroupSynchronizations[key];
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
            ____.sessionGroupSynchronizations = listGroupsAndActiveParameters;
        }

        this.modifiedSessionGroupList = function() {
            socket.emit('global.modified_session_group_list', ____.sessionGroupSynchronizations);
        }

        /*Страницы*/
        this.savePages = function() {
            socket.emit('global.modified_pages', ____.globalSession.pages);
        }
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
        this.selectSessionGroup = function() {
            socket.emit('local.select_session_group', ____.globalSession.pages);
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
            })(____.globalSession.pages);
        }

            this.getCurrentPage = function() {
                return (function recursion(el) {

                    for(var i in el) {
                        if(el[i].type == "page" && el[i].urn == ____.data.currentPage) {
                            return el[i];
                        } else if("sub" in el[i]) {
                            var r = recursion(el[i].sub);
                            if(r !== false) {
                                return r;
                            }
                        }
                    }

                    return false;
                })(____.data.pages);
            }

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
            })(____.data.pages);
        }

        this.addPage = function(urn) {
            if(this.getPage(urn) === false) {
                ____.globalSession.pages.shift({
                    type: "page",
                    urn: urn
                });
            }
        }

        this.addGroup = function(name) {
            if(this.getPage(name) === false) {
                ____.globalSession.pages.shift({
                    type: "group",
                    name: name
                });
            }
        }

        /*this.updatePage = function() {
            socket.emit('session.save', ____.globalSession);
        }*/

        this.deletePage = function(urn, nestedDelete) {
            return (function recursion(el) {

                for(var i in el) {
                    if(el[i].type == "page" && el[i].urn == urn) {
                        //Удаляем
                        var deletedPage = el.splice(i, 1);
                        if(nestedDelete !== true && "sub" in deletedPage) {
                            el.splice.apply(null, [i, 0].push(deletedPage.sub));
                        }

                        return true;
                    } else if("sub" in el[i]) {
                        var r = recursion(el[i].sub);
                        if(r !== false) {
                            return r;
                        }
                    }
                }

                return false;
            })(____.globalSession.pages);
        }

        this.deleteGroup = function(name, nestedDelete) {
            return (function recursion(el) {

                for(var i in el) {
                    if(el[i].type == "group" && el[i].name == name) {
                        //Удаляем
                        var deletedPage = el.splice(i, 1);
                        if(nestedDelete !== true && "sub" in deletedPage) {
                            el.splice.apply(null, [i, 0].push(deletedPage.sub));
                        }

                        return true;
                    } else if("sub" in el[i]) {
                        var r = recursion(el[i].sub);
                        if(r !== false) {
                            return r;
                        }
                    }
                }

                return false;
            })(____.globalSession.pages);
        }
    }

    modules.sessionModel = sessionModel;

})(jQuery);