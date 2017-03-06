(function($){
    var sessionModel = function(data, socket) {
        var ____ = this;
        ____.data = data;

        /*********************************/
        /*Общая синхронизация*/
        /*********************************/

        /*Синхронизации сессий*/
        /*Страницы*/
        this.savePages = function() {
            socket.emit('modified_pages', ____.data.pages);
            console.log(____.data.pages);
        }
        /*Разрешения экрана*/
        /*Скриншоты*/

        /*********************************/
        /*Синхронизация по группам сессий*/
        /*********************************/
        this.getSessionFromGroups = function(groups) {
            if(groups.length) {

            } else {
                //Берём сессию для текущего браузера из куков

            }
        }
        /*Страницы*/
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
            })(____.data.pages);
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
                ____.data.pages.shift({
                    type: "page",
                    urn: urn
                });
            }
        }

        this.addGroup = function(name) {
            if(this.getPage(name) === false) {
                ____.data.pages.shift({
                    type: "group",
                    name: name
                });
            }
        }

        /*this.updatePage = function() {
            socket.emit('session.save', ____.data);
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
            })(____.data.pages);
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
            })(____.data.pages);
        }
    }

    modules.sessionModel = sessionModel;

})(jQuery);