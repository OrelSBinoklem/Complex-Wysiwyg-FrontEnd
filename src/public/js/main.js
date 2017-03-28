/****************************************************/
/*Шаблонизатор*/
/****************************************************/
jQuery(function($) {
    $("body").on('keydown', function(e) {
        if(e.which == 49 && e.altKey)//(e.which == 65 || e.which == 83 || e.which == 68)
        {
            e = e || window.e; if (e.stopPropagation) {e.stopPropagation()} else {e.cancelBubble = true} e.preventDefault();
        }
    });

    var session;
    var socket = io.connect('/');

    socket.once('session.load', function (data) {
        session = new modules.sessionModel(data, socket);
        //console.log(data);
        next();
    });

    function next() {
        //Глобальные настройки
        (function() {
            var animations = {};
            $( ".shab__global-settings-btn" ).on("click", function () {
                if( !$(this).hasClass('active') ) {
                    openOptions();
                } else {
                    closeOptions();
                }
            });

            $( "body" ).on("click click.body.iframe", function (e) {
                if( $(e.target).closest($(".shab__global-settings-btn").add($(".shab__global-settings"))).size() == 0 ) {
                    if( $(".shab__global-settings-btn").hasClass('active') ) {
                        closeOptions();
                    }
                }
            });

            function openOptions() {
                if( "openOptionsTimeLine__close" in animations ) { animations.openOptionsTimeLine__close.pause() }
                $(" .shab__global-settings").css({
                    display: "block",
                    opacity: 0,
                    transform: "scale(0.8, 0.8)"
                });

                if( !("openOptionsTimeLine" in animations) ) {
                    animations.openOptionsTimeLine = (new TimelineLite()).append([
                        TweenMax.to($(".shab__global-settings"), 0.5,
                            {css:{transform: "scale(1, 1)" }}),
                        TweenMax.to($(".shab__global-settings"), 0.3,
                            {css:{ opacity: 1 }})
                    ]);
                } else {
                    animations.openOptionsTimeLine.restart();
                }

                $( ".shab__global-settings-btn" ).addClass('active');
            }

            function closeOptions() {
                if( "openOptionsTimeLine" in animations ) { animations.openOptionsTimeLine.pause() }
                if( !("openOptionsTimeLine__close" in animations) ) {
                    animations.openOptionsTimeLine__close = (new TimelineLite()).append([
                        TweenMax.to($(".shab__global-settings"), 0.5,
                            {css:{ transform: "scale(0.8, 0.8)"}, onComplete: handlerComplete}),
                        TweenMax.to($(".shab__global-settings"), 0.5,
                            {css:{ opacity: 0 }})
                    ]);
                } else {
                    animations.openOptionsTimeLine__close.restart();
                }
                function handlerComplete() {
                    $(".shab__global-settings").css('display', 'none');
                }

                $( ".shab__global-settings-btn" ).removeClass('active');
            }

            //$('#text-encoding-server').selectpicker();

            //Кодировка на хосте
            //$('#text-encoding-server').selectpicker('val', shablonizator.settings.find('text_encoding_server').text());

            /*$('#text-encoding-server').on('change', function(){
                shablonizator.textEncodingServer = $(this).val();
                shablonizator.settings.find('text_encoding_server').text($(this).val());
                shablonizator.save_g_settings();
            });*/
        })();

        /****************************************************/
        /*Синхронизация по группам сессий*/
        /****************************************************/
        (function() {
            //Свернуть-развернуть список выбора групп
            $(".shab__btn-open-groups-session").on("click", function () {
                if(!$(this).hasClass('active')) {
                    $(this).addClass('active');
                    $(".shab__session-groups-list").addClass('open');
                } else {
                    $(this).removeClass('active');
                    $(".shab__session-groups-list").removeClass('open');
                }
            });
            $("body").on("click click.body.iframe", function (e) {
                if( $(e.target).closest($(".shab__btn-open-groups-session").add($(".shab__session-groups-list")).add($("#shab-add-group-session")).add($("#shab-delete-group-session"))).length == 0 ) {
                    $(".shab__btn-open-groups-session").removeClass('active');
                    $(".shab__session-groups-list").removeClass('open');
                }
            });

            //Формирование меню групп сессий
            $(".shab__session-groups-list").prepend("<ul class='shab__session-groups-list-ul'></ul>");
            refreshMenuView();
            $(".shab__session-groups-list-ul").sortable({
                    axis: "y",
                    //handle: 'button',
                    items: "> li",
                    placeholder: "placeholder",
                    forceHelperSize: true,
                    forcePlaceholderSize: true,
                    update: function() {
                        sendSessionSortableGroups();
                    }
                })
                .disableSelection();
            function refreshMenuView() {
                if(session.data.sessionGroupSynchronizations.length) {
                    var haveCookie = $.cookie('adaptive_pixel_perfect_groups_session') !== undefined;
                    var activeGroups;

                    if(haveCookie) {
                        activeGroups = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_groups_session')).groups;
                        //список в обьект по именам групп сессий
                        var sessionGroupsForNames = {};
                        for(var key in session.data.sessionGroupSynchronizations) {
                            var one = session.data.sessionGroupSynchronizations[key];
                            sessionGroupsForNames[one.name] = one;
                        }

                        //Удаляем имена выбранных групп которых уже нету
                        activeGroups.filter(function(item, i, arr) {
                            return item in sessionGroupsForNames;
                        });
                        $.cookie('adaptive_pixel_perfect_groups_session', $.toJSON({"groups": activeGroups}));
                        if(!activeGroups.length) {
                            $.removeCookie('adaptive_pixel_perfect_groups_session');
                            haveCookie = false;
                            activeGroups = [];
                        }
                    }
                    var activeGroupsObj = {};
                    for(var i in activeGroups) {
                        activeGroupsObj[activeGroups[i]] = true;
                    }

                    //Формируем меню
                    var html = "";

                    for(var key in session.data.sessionGroupSynchronizations) {
                        var oneGroup = session.data.sessionGroupSynchronizations[key];

                        var activeParamsObj = {};
                        for(var i in oneGroup.synchroParams) {
                            activeParamsObj[oneGroup.synchroParams[i]] = true;
                        }

                        var active = (haveCookie && (oneGroup.name in activeGroupsObj))?"active":"";
                        html += '<li class="shab__session-groups-list-item '+active+'" data-name="'+(oneGroup.name)+'">' +
                            '<button class="btn btn-default btn-xs shab__session-groups-synchro-params-btn '+(("pages"       in activeParamsObj)?"active":"")+'" data-param="pages"><i class="fa fa-file-o"></i></button>' +
                            '<button class="btn btn-default btn-xs shab__session-groups-synchro-params-btn '+(("resolutions" in activeParamsObj)?"active":"")+'" data-param="resolutions"><i class="fa fa-arrows"></i></button>' +
                            '<button class="btn btn-default btn-xs shab__session-groups-synchro-params-btn '+(("iframe"      in activeParamsObj)?"active":"")+'" data-param="iframe"><i class="fa fa-desktop"></i></button>' +
                            '<button class="btn btn-default btn-xs btn-block shab__session-groups-list-btn '+active+'">'+(oneGroup.name)+'</button>' +
                            '<div class="btn btn-default btn-xs shab__session-groups-btn-drag"><span class="glyphicon glyphicon-move"></span></div>' +
                            '<button class="btn btn-default btn-xs shab__session-groups-delete-btn"><span class="glyphicon glyphicon-remove"></span></button>' +
                            '</li>';
                    }

                    $(".shab__session-groups-list-ul").empty().append(html);
                } else {
                    if($.cookie('adaptive_pixel_perfect_groups_session') !== undefined) {
                        $.removeCookie('adaptive_pixel_perfect_groups_session');
                    }
                }
            }

            //Добавить группу
            $('.shab__add-group-session').on('click', function(){
                $('#shab-add-group-session .modal').modal('show');
            });
            $('#shab-add-group-session .btn-select').on('click', function(){
                var name = $('#shab-add-group-session .shab-add-group-session__name').val();
                if($.trim(name)) {
                    var html = '<li class="shab__session-groups-list-item" data-name="'+($.trim(name))+'">' +
                        '<button class="btn btn-default btn-xs shab__session-groups-synchro-params-btn" data-param="pages"><i class="fa fa-file-o"></i></button>' +
                        '<button class="btn btn-default btn-xs shab__session-groups-synchro-params-btn" data-param="resolutions"><i class="fa fa-arrows"></i></button>' +
                        '<button class="btn btn-default btn-xs shab__session-groups-synchro-params-btn" data-param="iframe"><i class="fa fa-desktop"></i></button>' +
                        '<button class="btn btn-default btn-xs btn-block shab__session-groups-list-btn">'+($.trim(name))+'</button>' +
                        '<div class="btn btn-default btn-xs shab__session-groups-btn-drag"><span class="glyphicon glyphicon-move"></span></div>' +
                        '<button class="btn btn-default btn-xs shab__session-groups-delete-btn"><span class="glyphicon glyphicon-remove"></span></button>' +
                        '</li>';
                    $(".shab__session-groups-list-ul").append(html);

                    sendSessionAddGroup();
                } else {
                    alert("Имя недолжно быть пустым");
                }
                $('#shab-add-group-session .modal').modal('hide');
            });

            //Удалить группу
            $('.shab__session-groups-list').on('click', " .shab__session-groups-delete-btn", function(){
                $('#shab-delete-group-session .modal').modal('show');

                var name = $(this).closest(".shab__session-groups-list-item").attr("data-name");
                $('#shab-delete-group-session .shab-delete-group-session__name')
                    .attr("data-name", name)
                    .text(name);
            });
            $('#shab-delete-group-session .btn-select').on('click', function(){
                var name = $('#shab-delete-group-session .shab-delete-group-session__name').attr("data-name");
                $(".shab__session-groups-list-item[data-name='"+name+"']").remove();

                sendSessionDeleteGroup();

                $('#shab-delete-group-session .modal').modal('hide');
            });

            //Активировать-деактивировать группу
            $('.shab__session-groups-list').on('click', " .shab__session-groups-list-btn", function(){
                if($(".shab__session-groups-list.open").length) {
                    if(!$(this).hasClass("active")) {
                        $(this).addClass("active")
                            .closest(".shab__session-groups-list-item").addClass("active");
                    } else {
                        $(this).removeClass("active")
                            .closest(".shab__session-groups-list-item").removeClass("active");
                    }

                    sendSessionActivatedGroup($(this).closest(".shab__session-groups-list-item").attr("data-name"), $(this).hasClass("active"));
                }
            });

            //Активировать-деактивировать параметр группы
            $('.shab__session-groups-list').on('click', " .shab__session-groups-synchro-params-btn", function(){
                if(!$(this).hasClass("active")) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }

                sendSessionActivatedParam($(this).closest(".shab__session-groups-list-item").attr("data-name"), $(this).attr("data-param"), $(this).hasClass("active"));
            });

            function groupsSessionToJson($main) {
                var sessionGroupSynchronizations = [];
                $main.find(" .shab__session-groups-list-ul > li").each(function() {
                    var activeParams = [];
                    $(this).find(" .shab__session-groups-synchro-params-btn.active").each(function() {
                        activeParams.push($(this).attr("data-param"));
                    });
                    sessionGroupSynchronizations.push({
                        name: $(this).attr("data-name"),
                        synchroParams: activeParams
                    });
                });
                return sessionGroupSynchronizations;
            }

            //Запись и отправка данных сессии
            function sendSessionSortableGroups() {
                session.onChangeSessionGroups(groupsSessionToJson($('.shab__session-groups-list')));
            }
            function sendSessionAddGroup() {
                session.onChangeSessionGroups(groupsSessionToJson($('.shab__session-groups-list')));
            }
            function sendSessionDeleteGroup() {
                session.onChangeSessionGroups(groupsSessionToJson($('.shab__session-groups-list')));
            }
            function sendSessionActivatedGroup(name, activated) {
                session.onSessionActivatedGroup(name, activated);
            }
            function sendSessionActivatedParam(name, nameParam, activated) {
                session.onSessionActivatedParam(name, nameParam, activated);
            }

            //Приём данных сессии
            session.responseHandlers["onChangeSessionGroups"] = function() {
                refreshMenuView();
            }
            session.responseHandlers["onSessionActivatedParam"] = function() {
                refreshMenuView();
            }
        })();

        /****************************************************/
        /*Менеджер страниц и визуализатор*/
        /****************************************************/
        (function() {
            pageManagerVisualizator = new modules.pageManagerVisualizator($("#wrap_iframe"), session, {
                $mapNavigatorContainer: $('.mnif__navigator-window'),
                nameIFrame: "PP_iframe",
                pixelsScrollableInSeconds: 2000,
                minWOuterScroll: 23,
                minHOuterScroll: 23,
                minWDraggable: 15,
                minHDraggable: 15,
                minWIFrame: 320,
                minHIFrame: 480,
                responsiveToMovementOfTheCursorInAConfinedSpace: true,
                movementOfTheCursorInAConfinedSpaceSpred: 10,
                gorizontalFixation: "center",
                verticalFixation: "top"
            });

            //Скроллбар для списка страниц
            $(".pmv__pages-sortable-scrollwrap").mCustomScrollbar({
                axis: "y",
                theme: "dark",
                scrollbarPosition: "outside",
                scrollInertia: 100,
                mouseWheel: {
                    scrollAmount: 100
                }
            });

            //Открыть-закрыть меню выбора страниц
            $(".pmv__select-page-open-list").on("click", function () {
                $(this).toggleClass('active');
            });
            var dragItemList = false;
            $("body").on("click click.body.iframe", function (e) {
                if( $(e.target).closest($(".pmv__select-page-open-list").add($(".pmv__pages-window, #modal-pmv-add-page-href, #pmv__modal-add-group, #shab__page-or-group-delete, #shab__page-or-group-update"))).length == 0 && !dragItemList ) {
                    $(".pmv__select-page-open-list").removeClass('active');
                }
            });

            //Сменяем страницу
            $('.pmv__pages-sortable').on('click', ' .pmv__pages-btn-page', function() {
                $(".pmv__pages-btn-page").removeClass("active");
                $(this).addClass("active");
                pageManagerVisualizator.handlerSelectPage( $(this).closest(".pmv__pages-item").attr("data-name") );
                if( $(".pmv__select-page-open-list").hasClass('active') ) {
                    $(".pmv__select-page-open-list").removeClass('active');
                }
            });
            $("body").on("pmv.user.changepage", function(){
                session.changePage(pageManagerVisualizator.currentPage);
            });
            $("body").on("synchro.changed_page", function(e, page){
                $(".pmv__pages-btn-page").removeClass("active");
                $(".pmv__pages-item[data-name='"+page+"'] > * > .pmv__pages-btn-page").addClass("active");
                session.selectPage(page);
            });

            //Добавляем страницу
            $('#modal-pmv-add-page-href .btn-select').on('click', function(event){
                var urn = $('#modal-pmv-add-page-href .pmv-href').val();

                //Проверяем на ошибки
                $('.pmv__modal-urn-exists').css({display: ""});
                $('.pmv__modal-urn-empty').css({display: ""});
                $('.pmv__modal-add-page-content').removeClass("has-error");

                if($.trim(urn)) {
                    if(session.getPage(urn) === false) {
                        next();
                    } else {
                        $('.pmv__modal-urn-exists').css({display: "block"});
                        $('.pmv__modal-add-page-content').addClass("has-error");
                    }
                } else {
                    $('.pmv__modal-urn-empty').css({display: "block"});
                    $('.pmv__modal-add-page-content').addClass("has-error");
                }

                //Добавляем страницу
                function next() {
                    $(".pmv__pages-sortable > ul").prepend( createMenuItem("page", $.trim(urn)) );
                    $('#modal-pmv-add-page-href .modal').modal('hide');
                }
            });
            $('.pmv__add-page').on('click', function(){
                $('.pmv__modal-urn-exists').css({display: ""});
                $('.pmv__modal-urn-empty').css({display: ""});
                $('.pmv__modal-add-page-content').removeClass("has-error");

                if(pageManagerVisualizator._options.nameIFrame in window) {
                    //отделить домен от urn
                    $('#modal-pmv-add-page-href .pmv-href').val( window[pageManagerVisualizator._options.nameIFrame].window.location.href );
                }
                $('#modal-pmv-add-page-href .modal').modal('show');
            });
            $('#modal-pmv-add-page-href').on('shown.bs.modal', function(e){
                var input = $('#modal-pmv-add-page-href .pmv-href');
                //Выделение
                input.get(0).focus();
                //input.get(0).setSelectionRange(0, input.val().length);
            });

            //Добавляем группу
            $('#pmv__modal-add-group .btn-select').on('click', function(event){
                var name = $('#pmv__modal-add-group .pmv__modal-name-group').val();

                //Проверяем на ошибки
                $('#pmv__modal-add-group .pmv__modal-name-exists').css({display: ""});
                $('#pmv__modal-add-group .pmv__modal-name-empty').css({display: ""});
                $('.pmv__modal-add-group-content').removeClass("has-error");
                if($.trim(name)) {
                    if(session.getGroup(name) === false) {
                        next();
                    } else {
                        $('.pmv__modal-name-exists').css({display: "block"});
                        $('.pmv__modal-add-group-content').addClass("has-error");
                    }
                } else {
                    $('#pmv__modal-add-group .pmv__modal-name-empty').css({display: "block"});
                    $('.pmv__modal-add-group-content').addClass("has-error");
                }

                //Добавляем группу
                function next() {
                    $(".pmv__pages-sortable > ul").prepend( createMenuItem("group", $.trim(name)) );
                    $('#pmv__modal-add-group .modal').modal('hide');
                }
            });
            $('.pmv__add-group').on('click', function(){
                $('#pmv__modal-add-group .pmv__modal-name-exists').css({display: ""});
                $('#pmv__modal-add-group .pmv__modal-name-empty').css({display: ""});
                $('.pmv__modal-add-group-content').removeClass("has-error");

                $('#pmv__modal-add-group .modal').modal('show');
            });

            //Удаляем страницу или группу
            $('.pmv__pages-sortable').on('click', " .pmv__pages-btn-delete", function(){
                if($(this).closest(".pmv__pages-item").hasClass("have-nested")) {
                    $("#shab__page-or-group-delete .shab__page-or-group-delete-nested-btn").css({display: "inline-block"});
                } else {
                    $("#shab__page-or-group-delete .shab__page-or-group-delete-nested-btn").css({display: "none"});
                }

                $('#shab__page-or-group-delete .modal').modal('show');

                var name = $(this).closest(".pmv__pages-item").attr("data-name");
                var type = $(this).closest(".pmv__pages-item").attr("data-type");
                $('#shab__page-or-group-delete .shab__page-or-group__name')
                    .attr("data-name", name)
                    .text(name);
                $('#shab__page-or-group-delete .shab__page-or-group__type').text((type == "page")?"страницу":"группу");
            });
            $('#shab__page-or-group-delete .shab__page-or-group-delete-btn').on('click', function(){
                var name = $('#shab__page-or-group-delete .shab__page-or-group__name').attr("data-name");
                var $cutItems = $(".pmv__pages-item[data-name='"+name+"'] > ul > .pmv__pages-item").remove();
                $(".pmv__pages-item[data-name='"+name+"']").after($cutItems);
                $(".pmv__pages-item[data-name='"+name+"']").remove();

                var $main = $(".pmv__pages-sortable");
                clearEmptyUl($main);
                refreshNestedEl($main);
                clearCollapseNotNested($main);

                $('#shab__page-or-group-delete .modal').modal('hide');
            });
            $('#shab__page-or-group-delete .shab__page-or-group-delete-nested-btn').on('click', function(){
                var name = $('#shab__page-or-group-delete .shab__page-or-group__name').attr("data-name");
                $(".pmv__pages-item[data-name='"+name+"']").remove();

                var $main = $(".pmv__pages-sortable");
                clearEmptyUl($main);
                refreshNestedEl($main);
                clearCollapseNotNested($main);

                $('#shab__page-or-group-delete .modal').modal('hide');
            });

            //Обновляем страницу или группу
            $('.pmv__pages-sortable').on('click', " .pmv__pages-btn-edit", function(){
                $('#shab__page-or-group-update .modal').modal('show');

                var name = $(this).closest(".pmv__pages-item").attr("data-name");
                var type = $(this).closest(".pmv__pages-item").attr("data-type");
                $('#shab__page-or-group-update .shab__page-or-group__name')
                    .attr("data-name", name);
                $('#shab__page-or-group-update .shab__page-or-group-update__name').val(name);

                $('#shab__page-or-group-update .shab__page-or-group__type').attr("data-type", type).text((type == "page")?"новый URN":"новое имя");
            });
            $('#shab__page-or-group-update .btn-select').on('click', function(){
                var name = $('#shab__page-or-group-update .shab__page-or-group__name').attr("data-name");
                var type = $('#shab__page-or-group-update .shab__page-or-group__type').attr("data-type");
                var newName = $('#shab__page-or-group-update .shab__page-or-group-update__name').val();

                //Проверяем на ошибки
                $('#shab__page-or-group-update .pmv__modal-urn-exists').css({display: ""});
                $('#shab__page-or-group-update .pmv__modal-name-exists').css({display: ""});
                $('#shab__page-or-group-update .pmv__modal-empty').css({display: ""});
                $('#shab__page-or-group-update .pmv__modal-content').removeClass("has-error");

                if(type == "page") {
                    if($.trim(newName)) {
                        if(session.getPage(newName) === false) {
                            next();
                        } else {
                            $('#shab__page-or-group-update .pmv__modal-urn-exists').css({display: "block"});
                            $('#shab__page-or-group-update .pmv__modal-content').addClass("has-error");
                        }
                    } else {
                        $('#shab__page-or-group-update .pmv__modal-empty').css({display: "block"});
                        $('#shab__page-or-group-update .pmv__modal-content').addClass("has-error");
                    }
                } else {
                    if($.trim(newName)) {
                        if(session.getGroup(newName) === false) {
                            next();
                        } else {
                            $('#shab__page-or-group-update .pmv__modal-name-exists').css({display: "block"});
                            $('#shab__page-or-group-update .pmv__modal-content').addClass("has-error");
                        }
                    } else {
                        $('#shab__page-or-group-update .pmv__modal-empty').css({display: "block"});
                        $('#shab__page-or-group-update .pmv__modal-content').addClass("has-error");
                    }
                }

                //Добавляем страницу
                function next() {
                    $(".pmv__pages-sortable .pmv__pages-item[data-type='"+type+"'][data-name='"+name+"']")
                        .attr("data-name", newName)
                        .find(" > * > .pmv__pages-btn-name").text(newName);

                    $('#shab__page-or-group-update .modal').modal('hide');
                }
            });

            //Генерируем пункт меню
            function createMenuItem(type, name) {
                var _class = (type == "page")?"page":"group btn-yellow";
                return '<li class="pmv__pages-item" data-type="'+type+'" data-name="'+name+'">' +
                    '<div class="pmv__pages-item-content">' +
                    '<button class="btn btn-default btn-xs pmv__pages-btn-collapsed"><span class="glyphicon glyphicon-minus"></span><span class="glyphicon glyphicon-plus"></span></button>' +
                    '<button class="btn btn-default btn-xs btn-block pmv__pages-btn-name pmv__pages-btn-'+_class+'">'+name+'</button>' +
                    '<button class="btn btn-default btn-xs pmv__pages-btn-delete"><span class="glyphicon glyphicon-remove"></span></button>' +
                    '<button class="btn btn-default btn-xs pmv__pages-btn-edit"><span class="glyphicon glyphicon-edit"></span></button>' +
                    '<div class="btn btn-default btn-xs pmv__pages-btn-drag"><span class="glyphicon glyphicon-move"></span></div>' +
                    '</div>' +
                    '</li>';

            }

            //Обновляем список страниц в верхнем меню
            $(".pmv__pages-sortable").prepend("<ul class='pmv__pages-sortable-ul'></ul>");
            $(".pmv__pages-sortable-ul").nestedSortable({
                forcePlaceholderSize: true,
                handle: 'div',
                items: 'li',
                placeholder: 'placeholder',
                revert: 250,
                tabSize: 25,
                toleranceElement: '> div',
                listType: "ul",
                helper:	'clone',
                maxLevels: 3,
                isTree: true,
                start: function () {
                    dragItemList = true;
                },
                stop: function () {
                    dragItemList = false;
                },
                update: function( event, ui ) {
                    var $main = $(".pmv__pages-sortable");
                    clearEmptyUl($main);
                    refreshNestedEl($main);
                    clearCollapseNotNested($main);
                    session.data.pages = pagesNestedToJson($main);
                    session.savePages();
                }
            });

            pageManagerVisualizator.$container.on("pmv.change.pagelist", refreshMenuView);
            refreshMenuView();
            
            function refreshMenuView() {
                var localSession = session.getLocalSessionParams();
                dragItemList = false;
                var $main = $(".pmv__pages-sortable-ul");
                $main.empty();

                var res = (function recursion(el, html) {
                    //li
                    for(var i in el) {
                        var name = (el[i].type == "page") ? el[i].urn : el[i].name;
                        var _class = (el[i].type == "page")?"page":"group btn-yellow";
                        var active = (el[i].type == "page" && localSession && "pages" in localSession && localSession.pages.currentPage === name)?"active":"";
                        html += "<li class='pmv__pages-item "+(("collapsed" in el[i] && el[i].collapsed)?"collapsed":"")+"' data-type='"+(el[i].type)+"' data-name='"+name+"'>";
                        html += '<div class="pmv__pages-item-content">' +
                            '<button class="btn btn-default btn-xs pmv__pages-btn-collapsed"><span class="glyphicon glyphicon-minus"></span><span class="glyphicon glyphicon-plus"></span></button>' +
                            '<button class="btn btn-default btn-xs btn-block pmv__pages-btn-name pmv__pages-btn-'+_class+' '+active+'">'+name+'</button>' +
                            '<button class="btn btn-default btn-xs pmv__pages-btn-delete"><span class="glyphicon glyphicon-remove"></span></button>' +
                            '<button class="btn btn-default btn-xs pmv__pages-btn-edit"><span class="glyphicon glyphicon-edit"></span></button>' +
                            '<div class="btn btn-default btn-xs pmv__pages-btn-drag"><span class="glyphicon glyphicon-move"></span></div>' +
                            '</div>';

                        //sub
                        if("sub" in el[i]) {
                            html = recursion(el[i].sub, html+"<ul>")+"</ul>";
                        }
                        //sub (end)

                        html += "</li>";

                    }
                    //li (end)

                    return html;
                })(session.data.globalSession.pages, "");

                $main.append(res);
                refreshNestedEl($(".pmv__pages-sortable"));
                refreshCollapsed($(".pmv__pages-sortable"));
            }

            $(".pmv__pages-sortable").on("click", " .pmv__pages-btn-collapsed", function(){
                var $item = $(this).closest(".pmv__pages-item");
                if( $item.hasClass("collapsed") ) {
                    $item.removeClass("collapsed")
                        .find(" > ul").css({display: "block"});
                } else {
                    $item.addClass("collapsed")
                        .find(" > ul").css({display: "none"});
                }
            });

            //Парсинг страниц в json обьект
            function pagesNestedToJson($main) {
                var json = [], previousLevel = 0, stack = {"0":json};

                $main.find(".pmv__pages-item").each(function() {
                    var level = $(this).parents(".pmv__pages-item").length;
                    if(level > previousLevel) {
                        var obj = stack[previousLevel][stack[previousLevel].length-1];
                        if(!("sub" in obj)) {
                            obj.sub = [];
                            stack[level] = obj.sub;
                        }
                        stack[level].push(itemToJson($(this)));
                    } else {
                        stack[level].push(itemToJson($(this)));
                    }
                    previousLevel = level;
                });

                return json;
            }

                function itemToJson($item) {
                    var obj = {};
                    obj.type = $item.attr("data-type");

                    if($item.attr("data-type") == "page") {
                        obj.urn = $item.attr("data-name");
                    } else {
                        obj.name = $item.attr("data-name");
                    }

                    if($item.hasClass("collapsed")) {
                        obj.collapsed = true;
                    }
                    return obj;
                }

            //удаляем пустые тэги ul которые остаються после перестановки
            function clearEmptyUl($main) {
                $main.find(" ul").addClass("not-childrens");
                $main.find(" ul > li").each(function() {
                    $(this).parent().removeClass("not-childrens");
                });
                $main.find(" ul.not-childrens").remove();
            }

            //очитстить от коллапсов
            function clearCollapseNotNested($main) {
                $main.find(" .pmv__pages-item").each(function() {
                    if(!$(this).hasClass("have-nested")) {
                        $(this).removeClass("collapsed");
                    }
                });
            }
            function refreshNestedEl($main) {
                //Вставляем класс для вложенных
                $main.find(" .pmv__pages-item").removeClass("have-nested");
                $main.find(" ul").each(function() {
                    if($(this).parent(".pmv__pages-item").length) {
                        $(this).parent(".pmv__pages-item").addClass("have-nested");
                    }
                });
            }
            function refreshCollapsed($main) {
                //Коллапсируем рассколапсируем
                $main.find(" .pmv__pages-item.collapsed > ul").css({display: "none"});
                $main.find(" .pmv__pages-item > ul").not($main.find(" .pmv__pages-item.collapsed > ul")).css({display: "block"});
            }

            //При загрузке iFrame скрываем всё окно шаблонизатора и показываем анимацию загрузки
            pageManagerVisualizator.$container.on({
                "pmv.prepaste.iframe": function() {
                    $( "#loading" )
                        .css({width: "100%", height: "100%"})
                        .addClass( "show" );
                },
                "pmv.load.iframe": function() {
                    $( "#loading" ).removeClass( "show" );
                    setTimeout(function() {
                        $( "#loading" ).css({width: "0", height: "0"});
                    }, 500);
                }
            });

            pageManagerVisualizator._create();
        })();

        /****************************************************/
        /*Пиксель перфект*/
        /****************************************************/
        (function() {
            pixelPerfect = new modules.pixelPerfect($("#wrap_iframe .pmv-fitting-wrap"), {
                dirScrins: "design-screenshots",
                nameIFrame: "PP_iframe"
            });

            pageManagerVisualizator.$container.on( "pmv.load.iframe", function(){
                pixelPerfect._destroy();
                pixelPerfect._create();

                var screenshotsCollection = session.getCurrentRelatedScreenshotsCollection();
                if(screenshotsCollection !== null) {
                    pixelPerfect.refreshScrins(screenshotsCollection, session.getScreenshotsObjList());
                }
            });

            //Скроллбар для списка скриншотов привязанных к разрешениям и страницам
            $(".pp__screenshots-menu-scrollwrap, .pp__screenshots-files-menu-scrollwrap, .pp__screenshot-thumbnail-scrollwrap").mCustomScrollbar({
                axis: "y",
                theme: "dark",
                scrollbarPosition: "outside",
                scrollInertia: 100,
                mouseWheel: {
                    scrollAmount: 100
                },
                callbacks: {
                    onUpdate: function() {
                        /*if($(".pmv__pages-sortable-scrollwrap").hasClass("_mCS_1 mCS_no_scrollbar")) {
                            $(".pmv__pages-window").addClass("no-scrollbar");
                        } else {
                            $(".pmv__pages-window").removeClass("no-scrollbar");
                        }*/
                    }
                }
            });

            //Свернуть-развернуть список скриншотов привязанных к разрешениям и страницам
            $(".pp__btn-open-screenshots").on("click", function () {
                if(!$(this).hasClass('active')) {
                    $(this).addClass('active');
                    $(".pp__screenshots-menu-window, .pp__screenshots-files-menu-scrollwrap").addClass('open');
                } else {
                    $(this).removeClass('active');
                    $(".pp__screenshots-menu-window, .pp__screenshots-files-menu-scrollwrap").removeClass('open');
                }
            });
            $("body").on("click click.body.iframe", function (e) {
                if( $(e.target).closest($(".pp__btn-open-screenshots").add($(".pp__screenshots-menu-window, .pp__screenshots-files-menu-scrollwrap, .pp__screenshot-thumbnail-scrollwrap, .pp__resolutions-menu, #pp__modal-add-resolution, #pp__modal-delete-resolution"))).length == 0 ) {
                    $(".pp__btn-open-screenshots").removeClass('active');
                    $(".pp__screenshots-menu-window, .pp__screenshots-files-menu-scrollwrap, .pp__screenshot-thumbnail-scrollwrap").removeClass('open');
                }
            });

            //Добавляем разрешение
            $('#pp__modal-add-resolution .btn-select').on('click', function(event){
                var hasError = false;
                var w = $.trim($('#pp__modal-add-resolution .pp__modal-add-resolution-w').val());
                var h = $.trim($('#pp__modal-add-resolution .pp__modal-add-resolution-h').val());

                //Проверяем на ошибки
                if(!(/^[1-9]\w{2,4}$/gim.test(w) && parseInt(w) >= 320 && parseInt(w) <= 99999)) {
                    hasError = true;
                    $('#pp__modal-add-resolution .pp__modal-add-resolution-w-group').addClass("has-error");
                    $('#pp__modal-add-resolution .pp__modal-val-not-digit').css({display: "block"});
                }
                if(!(h == "auto" || (/^[1-9]\w{2,4}$/gim.test(h) && parseInt(h) >= 320 && parseInt(h) <= 99999))) {
                    hasError = true;
                    $('#pp__modal-add-resolution .pp__modal-add-resolution-h-group').addClass("has-error");
                    $('#pp__modal-add-resolution .pp__modal-val-not-digit').css({display: "block"});
                }
                if(!hasError) {
                    for(var i in session.data.globalSession.resolutions) {
                        var one = session.data.globalSession.resolutions[i];
                        if(parseInt(w) === one.w && (h === "auto" || parseInt(h) === one.h)) {
                            hasError = true;
                            $('#pp__modal-add-resolution .pp__modal-add-resolution-w-group').addClass("has-error");
                            $('#pp__modal-add-resolution .pp__modal-add-resolution-h-group').addClass("has-error");
                            $('#pp__modal-add-resolution .pp__modal-val-exists').css({display: "block"});
                            break;
                        }
                    }
                }

                //Добавляем страницу
                if(!hasError) {
                    var html =
                    "<li class='pp__resolutions-list-resolution' data-w='"+w+"' data-h='"+h+"'>" +
                        '<div class="pp__resolutions-list-resolution-content">' +
                            '<button class="btn btn-default btn-xs btn-block pp__resolutionforscreen-name-btn">' +
                            '<span class="pp__resolutionforscreen-name-btn-w">'+w+'</span> | <span class="pp__resolutionforscreen-name-btn-h">'+h+'</span>' +
                            '</button>' +
                            '<button class="btn btn-default btn-xs pp__resolutions-delete-btn"><span class="glyphicon glyphicon-remove"></span></button>' +
                            '<div class="btn btn-default btn-xs pp__resolutions-drag-btn"><span class="glyphicon glyphicon-move"></span></div>' +
                        '</div>' +
                        '<ul class="pp__resolutions-list-screenshots"></ul>' +
                    '</li>';

                    $(".pp__resolutions-screenshots-list").prepend(html);

                    $('#pp__modal-add-resolution .modal').modal('hide');
                }
            });
            $('.pp__add-resolution-btn').on('click', function(){
                $('#pp__modal-add-resolution .pp__modal-val-exists').css({display: ""});
                $('#pp__modal-add-resolution .pp__modal-val-not-digit').css({display: ""});
                $('#pp__modal-add-resolution .pp__modal-add-resolution-w-group').removeClass("has-error");
                $('#pp__modal-add-resolution .pp__modal-add-resolution-h-group').removeClass("has-error");
                
                $('#pp__modal-add-resolution .modal').modal('show');
            });

            //Удаляем разрешение
            $('.pp__screenshots-menu').on('click', " .pp__resolutions-delete-btn", function(){
                var w = $(this).closest(".pp__resolutions-list-resolution").attr("data-w");
                var h = $(this).closest(".pp__resolutions-list-resolution").attr("data-h");
                $('#pp__modal-delete-resolution .pp__modal-delete-resolution-w')
                    .attr("data-w", w)
                    .text(w);
                $('#pp__modal-delete-resolution .pp__modal-delete-resolution-h')
                    .attr("data-h", h)
                    .text(h);
                $('#pp__modal-delete-resolution .modal').modal('show');
            });
            $('#pp__modal-delete-resolution .btn-select').on('click', function(){
                var w = $('#pp__modal-delete-resolution .pp__modal-delete-resolution-w').attr("data-w");
                var h = $('#pp__modal-delete-resolution .pp__modal-delete-resolution-h').attr("data-h");

                $('.pp__screenshots-menu .pp__resolutions-list-resolution[data-w="'+w+'"][data-h="'+h+'"]').remove();

                $('#pp__modal-delete-resolution .modal').modal('hide');
            });

            //Привязываем скриншот
            $('.pp__screenshots-files-menu-scrollwrap').on('click', " .pp__screenshots-btn-add-screenshot", function(){
                if($(".pp__screenshots-menu-scrollwrap .pp__resolutions-list-resolution").length) {
                    var $li = $(this).closest(".pp__screenshots-item");
                    var urn = $li.attr("data-urn");
                    var $size = $li.find(" .pp__screenshots-btn-size");
                    var w = $size.attr("data-w");
                    var h = $size.attr("data-h");
                    var html = '' +
                        '<li class="pp__resolutions-list-screenshot" data-urn="'+urn+'" data-w="'+w+'" data-h="'+h+'">' +
                            '<div class="pp__screenshot-content">' +
                                '<button class="btn btn-default btn-xs btn-block pp__screenshot-name-btn">' +
                                    '<div class="btn btn-default btn-xs pp__resolutions-screenshots-btn-size" data-w="'+w+'" data-h="'+h+'">' +
                                        '<span class="pp__screenshot-name-btn-w">'+w+'</span> | <span class="pp__screenshot-name-btn-h">'+h+'</span>' +
                                    '</div>' +
                                    urn +
                                '</button>' +
                                '<button class="btn btn-default btn-xs pp__resolutions-screenshots-delete-btn"><span class="glyphicon glyphicon-remove"></span></button>' +
                                '<div class="btn btn-default btn-xs pp__resolutions-screenshots-drag-btn"><span class="glyphicon glyphicon-move"></span></div>' +
                                '<button class="pp__resolutions-screenshots-btn-deviation btn btn-default btn-xs"><i class="glyphicon glyphicon-option-vertical" aria-hidden="true"></i></button>' +
                            '</div>' +
                        '</li>';

                    $(".pp__screenshots-menu-scrollwrap .pp__resolutions-list-screenshots")
                        .first()
                        .prepend($(html).data("deviation", {
                            pos: "static",
                            l: "center",
                            t: "top",
                            lpx: 0,
                            lper: 0,
                            tpx: 0,
                            tper: 0
                        }));
                }
            });

            //Удаляем (отвязываем) скриншот
            $('.pp__screenshots-menu').on('click', " .pp__resolutions-screenshots-delete-btn", function(e){
                e.stopPropagation();
                $(this).closest(".pp__resolutions-list-screenshot").remove();
            });

            //Показываем-скрываем окно "отклонения" для скриншота
            $('.pp__screenshots-menu').on('click', " .pp__resolutions-screenshots-btn-deviation", function(e){
                var _ = $(this).closest(".pp__resolutions-list-screenshot").data("deviation");
                $(".pp__deviation").data("deviation", _);
                setParamDeviation($(".pp__deviation"), _.pos, _.l, _.t, _.lpx, _.lper, _.tpx, _.tper);

                $('.pp__deviation').addClass("open");
            });
            $("body").on("click click.body.iframe", function (e) {
                if( $(e.target).closest($(".pp__resolutions-screenshots-btn-deviation").add($(".pp__deviation"))).length == 0 ) {
                    $('.pp__deviation').removeClass("open");
                }
            });

            //Формируем список разрешений с списком привязанных скриншотов
            refreshMenuView();
            function refreshMenuView() {
                var localSession = session.getLocalSessionParams();
                //dragItemList = false;
                var $main = $(".pp__resolutions-list");
                $main.empty();

                if(localSession && "pages" in localSession && localSession.pages.currentPage !== null) {
                    var res = (function recursion(resolutions, html) {
                        for(var i in resolutions) {
                            var one = resolutions[i];
                            var w = one.w;
                            var h = one.h;
                            var active = (localSession && "resolutions" in localSession && localSession.resolutions.currentResolution.w === w && localSession.resolutions.currentResolution.h === h)?"active":"";
                            html += "<li class='pp__resolutions-list-item' data-w='"+w+"' data-h='"+h+"'>";
                            html += '<div class="pp__resolutions-list-item-content">' +
                                '<button class="btn btn-default btn-xs btn-block pp__resolution-name-btn '+active+'">' +
                                    '<span class="pp__resolution-name-btn-w">'+w+'</span> | <span class="pp__resolution-name-btn-h">'+h+'</span>' +
                                '</button>' +
                                '</div>';

                            html += "</li>";
                        }

                        return html;
                    })(session.data.globalSession.resolutions, "");

                    $main.append(res);
                }
            }

            $(".pp__screenshots-menu").prepend("<ul class='pp__resolutions-screenshots-list'></ul>");
            refreshMenuViewScreenshotsForResolutions();
            $(".pp__resolutions-screenshots-list").sortable({
                revert: true,
                cursor: 'move',
                axis: 'y',
                items: ' > li',
                distance: 5,
                placeholder: "placeholder",
                forceHelperSize: true,
                forcePlaceholderSize: true,
                /*placeholder: {
                    /!*element: function(currentItem) {
                     return $('<div class="sm-placeholder-media"></div>').height( currentItem.outerHeight() );
                     },*!/
                    update: function(container, p) {
                        return;
                    }
                },*/
                stop: function(){
                    //$container.trigger("sm.change");
                }
            });
            var globalScreenshotsRelatedData;
            function refreshMenuViewScreenshotsForResolutions() {
                var localSession = session.getLocalSessionParams();
                globalScreenshotsRelatedData = [];
                //dragItemList = false;
                var $main = $(".pp__resolutions-screenshots-list");
                $main.empty();

                if(localSession && "pages" in localSession && localSession.pages.currentPage !== null) {
                    var res = (function recursion(resolutions, html) {
                        for(var i in resolutions) {
                            var one = resolutions[i];
                            var w = one.w;
                            var h = one.h;
                            var active = (localSession && "resolutions" in localSession && localSession.resolutions.currentResolution.w === w && localSession.resolutions.currentResolution.h === h)?"active":"";
                            html += "<li class='pp__resolutions-list-resolution' data-w='"+w+"' data-h='"+h+"'>";
                            html += '<div class="pp__resolutions-list-resolution-content">' +
                                '<button class="btn btn-default btn-xs btn-block pp__resolutionforscreen-name-btn '+active+'">' +
                                    '<span class="pp__resolutionforscreen-name-btn-w">'+w+'</span> | <span class="pp__resolutionforscreen-name-btn-h">'+h+'</span>' +
                                '</button>' +
                                '<button class="btn btn-default btn-xs pp__resolutions-delete-btn"><span class="glyphicon glyphicon-remove"></span></button>' +
                                '<div class="btn btn-default btn-xs pp__resolutions-drag-btn"><span class="glyphicon glyphicon-move"></span></div>' +
                                '</div>';


                            html += "<ul class='pp__resolutions-list-screenshots'>" + createScreenshotsList(localSession.pages.currentPage, one, session.data.globalSession.designScreenshotsRelatedResolutionAndPage) + "</ul>";

                            html += "</li>";
                        }

                        return html;
                    })(session.data.globalSession.resolutions, "");

                    $main.append(res);

                    var i = 0;
                    $main.find(" .pp__resolutions-list-screenshot").each(function() {
                        $(this).data("deviation", globalScreenshotsRelatedData[i]);
                        i++;
                    });
                }
                refreshSortableScreensotsInResolutions();
            }
            createDeviation();
            function createDeviation() {
                var html = '' +
                    '<div class="pp__deviation panel panel-primary">' +
                    '<div class="panel-body">' +
                    '<div class="row">' +
                    '<div class="col-xs-6 pp__deviation-col-left">' +
                    '<form class="pp__deviation-fixed-or-static btn-group-vertical btn-toggle-one-color" data-toggle="buttons">' +
                    '<label class="btn" data-btn-color="primary">' +
                    '<input type="radio" name="sm-radio-fixed-or-static" value="1" />Static' +
                    '</label>' +
                    '<label class="btn" data-btn-color="danger">' +
                    '<input type="radio" name="sm-radio-fixed-or-static" value="0" />Fixed' +
                    '</label>' +
                    '</form>' +
                    '</div>' +
                    '<div class="col-xs-6 pp__deviation-col-right">' +
                    '<div class="pp__deviation-relative btn-group-table">' +
                    '<div class="btn-group btn-group-justified" role="group">' +
                    '<div class="btn" data-left="left" data-top="top" role="button">&nbsp</div>' +
                    '<div class="btn" data-left="center" data-top="top" role="button">&nbsp</div>' +
                    '<div class="btn" data-left="right" data-top="top" role="button">&nbsp</div>' +
                    '</div>' +
                    '<div class="btn-group btn-group-justified" role="group">' +
                    '<div class="btn disabled" data-left="left" data-top="center" role="button">&nbsp</div>' +
                    '<div class="btn disabled" data-left="center" data-top="center" role="button">&nbsp</div>' +
                    '<div class="btn disabled" data-left="right" data-top="center" role="button">&nbsp</div>' +
                    '</div>' +
                    '<div class="btn-group btn-group-justified" role="group">' +
                    '<div class="btn disabled" data-left="left" data-top="bottom" role="button">&nbsp</div>' +
                    '<div class="btn disabled" data-left="center" data-top="bottom" role="button">&nbsp</div>' +
                    '<div class="btn disabled" data-left="right" data-top="bottom" role="button">&nbsp</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row row-name-px-percent">' +
                    '<div class="col-xs-6 pp__deviation-col-left">' +
                    '<p>px</p>' +
                    '</div>' +
                    '<div class="col-xs-6 pp__deviation-col-right">' +
                    '<p>%</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row row-otklonenie-1">' +
                    '<div class="col-xs-6 pp__deviation-col-left">' +
                    '<div class="input-group">' +
                    '<input type="text" class="form-control input-sm pp__deviation-input pp__deviation-left-px">' +
                    '<div class="input-group-addon"><span class="fa fa-long-arrow-right"></span></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-xs-6 pp__deviation-col-right">' +
                    '<div class="input-group">' +
                    '<input type="text" class="form-control input-sm pp__deviation-input pp__deviation-left-percent">' +
                    '<div class="input-group-addon"><span class="fa fa-long-arrow-right"></span></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row row-otklonenie-2">' +
                    '<div class="col-xs-6 pp__deviation-col-left">' +
                    '<div class="input-group">' +
                    '<input type="text" class="form-control input-sm pp__deviation-input pp__deviation-top-px">' +
                    '<div class="input-group-addon">&nbsp<span class="fa fa-long-arrow-down"></span>&nbsp</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-xs-6 pp__deviation-col-right">' +
                    '<div class="input-group">' +
                    '<input type="text" class="form-control input-sm pp__deviation-input pp__deviation-top-percent">' +
                    '<div class="input-group-addon">&nbsp<span class="fa fa-long-arrow-down"></span>&nbsp</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $(".pp__screenshots-menu-window").append(html);
                refreshSpinner($(".pp__deviation"));
            }
            function setParamDeviation($container, pos, l, t, lpx, lper, tpx, tper) {
                var $static = $container.find(" .pp__deviation-fixed-or-static label").first();
                var $fixed = $container.find(" .pp__deviation-fixed-or-static label").last();
                if(pos == "static") {
                    $static.removeClass("btn-default").addClass("btn-primary active");
                    $static.find(" input").prop("checked", true);
                    $fixed.addClass("btn-default").removeClass("btn-danger active");
                    $fixed.find(" input").prop("checked", false);
                } else {
                    $static.addClass("btn-default").removeClass("btn-primary active");
                    $static.find(" input").prop("checked", false);
                    $fixed.removeClass("btn-default").addClass("btn-danger active");
                    $fixed.find(" input").prop("checked", true);
                }

                var $relative = $container.find(" .pp__deviation-relative");
                if(pos == "static") {
                    $relative.addClass("pp__deviation-static").removeClass("pp__deviation-fixed");
                    $relative.find(" .btn[data-top!='top']").addClass("disabled");
                } else {
                    $relative.removeClass("pp__deviation-static").addClass("pp__deviation-fixed");
                    $relative.find(" .btn[data-top!='top']").removeClass("disabled");
                }
                $relative.find(" .btn").removeClass("active btn-danger").addClass("btn-default");
                $relative.find(" .btn[data-left='"+l+"'][data-top='"+t+"']").addClass("active btn-danger").removeClass("btn-default");

                var deviationInput = $container.find(" .pp__deviation-input");
                deviationInput.filter(".pp__deviation-left-px").val(lpx);
                deviationInput.filter(".pp__deviation-left-percent").val(lper);
                deviationInput.filter(".pp__deviation-top-px").val(tpx);
                deviationInput.filter(".pp__deviation-top-percent").val(tper);
            }
            //Обновить спиннер
            function refreshSpinner($container) {
                $container.find(" .pp__deviation-left-px").add($container.find(" .pp__deviation-top-px")).spinner({
                    min: -99999,
                    max: 99999,
                    start: function(){

                    },
                    spin: function(){

                    },
                    stop: function(){

                    }
                });
                $container.find(" .pp__deviation-left-percent").add($container.find(" .pp__deviation-top-percent")).spinner({
                    min: -9999,
                    max: 9999,
                    step: 0.1,
                    start: function(){

                    },
                    spin: function(){

                    },
                    stop: function(){

                    }
                });
            }
                //Вывод привязанных скриншотов
                function createScreenshotsList(currentPage, resolution, screenshotsRelated) {
                    if(currentPage in screenshotsRelated && (resolution.w+"|"+resolution.h) in  screenshotsRelated[currentPage]) {
                        //nestet to object list
                        var screenshotsObjList = session.getScreenshotsObjList();

                        var screenshots = screenshotsRelated[currentPage][resolution.w+"|"+resolution.h];
                        var html = "";
                        for(var key in screenshots) {
                            var s =  screenshots[key];//screenshot

                            if(s.pos == "static") {
                                s.t = "top";
                            }
                            globalScreenshotsRelatedData.push({
                                pos: s.pos,
                                l: s.l,
                                t: s.t,
                                lpx: s.lpx,
                                lper: s.lper,
                                tpx: s.tpx,
                                tper: s.tper
                            });
                            //html += (s.urn, s.active, screenshotsObjList[s.urn].w, screenshotsObjList[s.urn].h, s.pos, s.l, s.t, s.lpx, s.lper, s.tpx, s.tper);++++++++++++++++++
                            html += '' +
                            '<li class="pp__resolutions-list-screenshot" data-urn="'+s.urn+'" data-w="'+screenshotsObjList[s.urn].w+'" data-h="'+screenshotsObjList[s.urn].h+'">' +
                                '<div class="pp__screenshot-content">' +
                                    '<button class="btn btn-default btn-xs btn-block pp__screenshot-name-btn '+((s.active)?"active":"")+'">' +
                                        '<div class="btn btn-default btn-xs pp__resolutions-screenshots-btn-size" data-w="'+screenshotsObjList[s.urn].w+'" data-h="'+screenshotsObjList[s.urn].h+'">' +
                                            '<span class="pp__screenshot-name-btn-w">'+screenshotsObjList[s.urn].w+'</span> | <span class="pp__screenshot-name-btn-h">'+screenshotsObjList[s.urn].h+'</span>' +
                                        '</div>' +
                                        s.urn +
                                    '</button>' +
                                    '<button class="btn btn-default btn-xs pp__resolutions-screenshots-delete-btn"><span class="glyphicon glyphicon-remove"></span></button>' +
                                    '<div class="btn btn-default btn-xs pp__resolutions-screenshots-drag-btn"><span class="glyphicon glyphicon-move"></span></div>' +
                                    '<button class="pp__resolutions-screenshots-btn-deviation btn btn-default btn-xs"><i class="glyphicon glyphicon-option-vertical" aria-hidden="true"></i></button>' +
                                '</div>' +
                            '</li>';
                        }
                        return html;
                    }
                    return "";
                }
                //Просто обновляем сортировку
                function refreshSortableScreensotsInResolutions() {
                    $(".pp__resolutions-list-screenshots").sortable({
                        revert: true,
                        cursor: 'move',
                        axis: 'y',
                        items: ' > li',
                        distance: 5,
                        connectWith: ".pp__resolutions-list-screenshots",
                        placeholder: "placeholder",
                        forceHelperSize: true,
                        forcePlaceholderSize: true,
                        /*placeholder: {
                            element: function(currentItem) {
                                return $('<div class="panel panel-default sm-placeholder-scrin"></div>').height( currentItem.outerHeight() );
                            },
                            update: function(container, p) {
                                return;
                            }
                        },*/
                        remove: function(event, ui){//"update" заменил на "remove"
                            /*if( ui.item.closest( ".sm-all-scrins" ).size() ) {
                                ui.item.remove();
                            }*/
                        },
                        stop: function(){
                            //$container.trigger("sm.change");
                        }
                    });
                }

            //Список всех скриншотов
            $(".pp__screenshots-files-menu-scrollwrap").prepend('<ul class="pp__screenshots-files-list"></ul>');
            refreshMenuAllScreenshots();
            function refreshMenuAllScreenshots() {
                var localSession = session.getLocalSessionParams();
                //dragItemList = false;
                var $main = $(".pp__screenshots-files-list");
                $main.empty();

                var res = (function recursion(el, html) {
                    //li
                    for(var i in el) {
                        var one = el[i];
                        //
                        var collapsedToObj = {};
                        for(key in session.data.globalSession.designScreenshotsFoldersUncollapsed) {
                            collapsedToObj[session.data.globalSession.designScreenshotsFoldersUncollapsed[key]] = true;
                        }
                        var _class = (one.type == "file")?"file":"folder btn-yellow";
                        html += "<li class='pp__screenshots-item "+((one.urn in collapsedToObj)?"":"collapsed")+"' data-type='"+one.type+"' data-name='"+one.name+"' data-urn='"+one.urn+"'>";
                        html += '<div class="pp__screenshots-item-content">' +
                            '<button class="btn btn-default btn-xs pp__screenshots-btn-collapsed"><span class="glyphicon glyphicon-minus"></span><span class="glyphicon glyphicon-plus"></span></button>' +
                            '<div class="btn btn-default btn-xs btn-block pp__screenshots-btn-name pp__screenshots-btn-'+_class+'">' +
                                ((one.type == "file")?
                                '<div class="btn btn-default btn-xs pp__screenshots-btn-size" data-w="'+one.w+'" data-h="'+one.h+'">' +
                                    '<span class="pp__screenshots-btn-size-w">'+one.w+'</span> | <span class="pp__screenshots-btn-size-h">'+one.h+'</span>' +
                                '</div>':"") +
                            one.name +
                            '</div>' +
                            ((one.type == "file")?'<button class="btn btn-success btn-xs pp__screenshots-btn-add-screenshot"><span class="glyphicon glyphicon-plus-sign"></span></button>':"") +
                            '</div>';

                        //sub
                        if("sub" in one) {
                            html = recursion(one.sub, html+"<ul>")+"</ul>";
                        }
                        //sub (end)

                        html += "</li>";

                    }
                    //li (end)

                    return html;
                })(session.data.globalSession.designScreenshots, "");

                $main.append(res);
                refreshMenuAllScreenshots__specific($(".pp__screenshots-files-menu-scrollwrap"));
            }
                //для вложенных добавляем класс "have-nested", удаляем "collapsed" для тех кто без вложенных, коллапсируем рассколапсируем
                function refreshMenuAllScreenshots__specific($main) {
                    //Вставляем класс для вложенных
                    $main.find(" .pp__screenshots-item").removeClass("have-nested");
                    $main.find(" ul").each(function() {
                        if($(this).parent(".pp__screenshots-item").length) {
                            $(this).parent(".pp__screenshots-item").addClass("have-nested");
                        }
                    });
                    //
                    $main.find(" .pp__screenshots-item").each(function() {
                        if(!$(this).hasClass("have-nested")) {
                            $(this).removeClass("collapsed");
                        }
                    });
                    //Коллапсируем рассколапсируем
                    $main.find(" .pp__screenshots-item.collapsed > ul").css({display: "none"});
                    $main.find(" .pp__screenshots-item > ul").not($main.find(" .pp__screenshots-item.collapsed > ul")).css({display: "block"});
                }
                //коллапсировать-рассколапсировать
                $(".pp__screenshots-files-list").on("click", " .pp__screenshots-btn-collapsed", function(){
                    var $item = $(this).closest(".pp__screenshots-item");
                    if( $item.hasClass("collapsed") ) {
                        $item.removeClass("collapsed")
                            .find(" > ul").css({display: "block"});
                    } else {
                        $item.addClass("collapsed")
                            .find(" > ul").css({display: "none"});
                    }
                });

            //Отображаем миниатюрку
            var windowThumbnail__timeoutId = null;
            $(".pp__screenshots-files-menu-scrollwrap").on("mouseenter", " .pp__screenshots-item[data-type='file']", function(){
                $(".pp__screenshot-thumbnail")
                    .empty()
                    .append('<img src="'+("/design-screenshots/design-thumbnails/"+$(this).attr("data-urn"))+'" width="320" height="auto" />');
                $(".pp__screenshot-thumbnail-scrollwrap").addClass("open");
                $(".pp__screenshots-files-menu-scrollwrap").addClass("shadow-hidden");
            });
            //Скрываем только при уводе с блоков ".pp__screenshots-files-menu-scrollwrap, .pp__screenshot-thumbnail-scrollwrap" на другой
            $(".pp__screenshots-files-menu-scrollwrap, .pp__screenshot-thumbnail-scrollwrap").on({
                "mouseenter": function() {
                    if(windowThumbnail__timeoutId !== null) {
                        clearTimeout(windowThumbnail__timeoutId);
                    }
                },
                "mouseleave": function() {
                    windowThumbnail__timeoutId = setTimeout(function() {
                        windowThumbnail__timeoutId = null;
                        $(".pp__screenshot-thumbnail-scrollwrap").removeClass("open");
                        $(".pp__screenshots-files-menu-scrollwrap").removeClass("shadow-hidden");
                    }, 10);
                }
            });

            //Сменяем разрешение
            $('.shab__top-menu').on('change', ' .select-group', function() {
                var $optionSelected = $('.shab__top-menu .select-group option:selected');
                pixelPerfect.selectSize( $optionSelected.attr('data-width'), $optionSelected.attr('data-height') );
            });

            //Показать верстку или скрины или 50 на 50
            $('.pp__verstka-btn').on('click', function(){
                pixelPerfect.showPageProofsOrDesign(0);
                refreshButtonsPageProofsOrDesign();
            });
            $('.pp__50p-btn').on('click', function(){
                pixelPerfect.showPageProofsOrDesign(1);
                refreshButtonsPageProofsOrDesign();
            });
            $('.pp__design-btn').on('click', function(){
                pixelPerfect.showPageProofsOrDesign(2);
                refreshButtonsPageProofsOrDesign();
            });

            //Горячие клавишы
            pageManagerVisualizator.$container.on( "pmv.load.iframe", function(){
                $('body')
                    .add( $('#'+(pageManagerVisualizator._options.nameIFrame)).contents().find("body") )
                    .on('keydown', function(e) {
                        if(e.which == 81 && e.ctrlKey && !e.shiftKey && !e.altKey)//(e.which == 65 || e.which == 83 || e.which == 68)
                        {
                            if($('.pp__50p-btn, .pp__design-btn').hasClass('active'))
                            {
                                pixelPerfect.showPageProofsOrDesign(0);
                            }
                            else
                            {
                                pixelPerfect.showPageProofsOrDesign(1);
                            }

                            e = e || window.e; if (e.stopPropagation) {e.stopPropagation()} else {e.cancelBubble = true} e.preventDefault();
                        }
                    });
            });

            //Обновить кнопки
            function refreshButtonsPageProofsOrDesign(show) {
                $('.pp__verstka-design .btn').removeClass("active btn-primary btn-success btn-info btn-warning btn-danger").addClass("btn-default");
                switch (show) {
                    case 0:
                        $('.pp__verstka-btn').removeClass("btn-default").addClass("active btn-primary");
                        break;
                    case 1:
                        $('.pp__50p-btn').removeClass("btn-default").addClass("active btn-warning");
                        break;
                    case 2:
                        $('.pp__design-btn').removeClass("btn-default").addClass("active btn-danger");
                        break;
                }
            }
        })();

        /****************************************************/
        /*Для тестов*/
        /****************************************************/
        $(document).ready(function(){
            $('#testovaya_ssilka').on('click', function(event){

            });
        });

        /****************************************************/
        /*Вспомогательная хрень*/
        /****************************************************/
        $(document).ready(function(){
            //Подсказки
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
            //==========
        });
    }
});

