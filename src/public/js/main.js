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
                    update: function() {
                        $(".shab__session-groups-list").trigger("shab.user.change_session_group");
                    }
                })
                .disableSelection();
            function refreshMenuView() {
                if(session.sessionGroupSynchronizations.length) {
                    var haveCookie = $.cookie('adaptive_pixel_perfect_groups_session') !== undefined;
                    var activeGroups;

                    if(haveCookie) {
                        activeGroups = $.secureEvalJSON($.cookie('adaptive_pixel_perfect_groups_session')).groups;
                        //список в обьект по именам групп сессий
                        var sessionGroupsForNames = {};
                        for(var key in session.sessionGroupSynchronizations) {
                            var one = session.sessionGroupSynchronizations[key];
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

                    for(var key in session.sessionGroupSynchronizations) {
                        var oneGroup = session.sessionGroupSynchronizations[key];

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
                    $(".shab__session-groups-list").trigger("shab.user.change_session_group");
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

                $(".shab__session-groups-list").trigger("shab.user.change_session_group");

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
                }
            });

            //Активировать-деактивировать параметр группы
            $('.shab__session-groups-list').on('click', " .shab__session-groups-synchro-params-btn", function(){
                if(!$(this).hasClass("active")) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
                $(".shab__session-groups-list").trigger("shab.user.change_session_group");
            });

            $("body").on("shab.user.change_session_group", function(){
                groupsSessionToJson();
                session.modifiedSessionGroupList();
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
                session.menuJsonToGroupsSessionJson(sessionGroupSynchronizations);
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
                },
                callbacks: {
                    onUpdate: function() {
                        if($(".pmv__pages-sortable-scrollwrap").hasClass("_mCS_1 mCS_no_scrollbar")) {
                            $(".pmv__pages-window").addClass("no-scrollbar");
                        } else {
                            $(".pmv__pages-window").removeClass("no-scrollbar");
                        }
                    }
                }
            });

            //Открыть-закрыть меню выбора страниц
            $(".pmv__select-page-open-list").on("click", function () {
                $(this).toggleClass('active');
            });
            var dragItemList = false;
            $("body").on("click click.body.iframe", function (e) {
                if( $(e.target).closest($(".pmv__select-page-open-list").add($(".pmv__pages-window")).add($("#modal-pmv-add-page-href"))).length == 0 && !dragItemList ) {
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
                handlerAddPage( $('#modal-pmv-add-page-href .pmv-href').val() );
                $('#modal-pmv-add-page-href .modal').modal('hide');
            });
            $('.pmv__add-page').on('click', function(){
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
            function handlerAddPage(urn){
                //pageManagerVisualizator.addPage( href );
                console.log(urn);
            }

            //Удаляем страницу
            $('.shab__top-menu .select-page.selectpicker').on('selectpicker.refresh', function(){//Чтоб при клике на крестике не переключалась страница
                $('.shab__top-menu .select-page .delete').on('click', function(e){
                    e.stopPropagation();
                    if( confirm( "Точно удалить!" ) ) {
                        pageManagerVisualizator.removePage( $(this).attr('data-href') );
                    }
                    return false;
                });
            });

            //Обновляем страницу
            $('.pmv__update-iframe-btn').on('click', pageManagerVisualizator.reloadPage);

            //Обновляем список страниц в верхнем меню
            pageManagerVisualizator.$container.on("pmv.change.pagelist", refreshMenuView);
            refreshMenuView();
            
            function refreshMenuView() {
                var localSession = session.getLocalSessionParams();
                dragItemList = false;
                var $main = $(".pmv__pages-sortable");
                $main.empty();

                var res = (function recursion(el, html) {
                    html += "<ul>";

                    //li
                    for(var i in el) {
                        var name = (el[i].type == "page") ? el[i].urn : el[i].name;
                        var _class = (el[i].type == "page")?"page":"group btn-yellow";
                        var active = (el[i].type == "page" && localSession && "pages" in localSession && localSession.pages.currentPage === name)?"active":"";
                        html += "<li class='pmv__pages-item "+(("collapsed" in el[i] && el[i].collapsed)?"collapsed":"")+"' data-type='"+(el[i].type)+"' data-name='"+name+"'>";
                        html += '<div class="pmv__pages-item-content">' +
                            '<button class="btn btn-default btn-xs pmv__pages-btn-collapsed"><span class="glyphicon glyphicon-minus"></span><span class="glyphicon glyphicon-plus"></span></button>' +
                            '<button class="btn btn-default btn-xs btn-block pmv__pages-btn-'+_class+' '+active+'">'+name+'</button>' +
                            '<div class="btn btn-default btn-xs pmv__pages-btn-drag"><span class="glyphicon glyphicon-move"></span></div>' +
                            '</div>';

                        //sub
                        if("sub" in el[i]) {
                            html = recursion(el[i].sub, html);
                        }
                        //sub (end)

                        html += "</li>";

                    }
                    //li (end)

                    return html += "</ul>";
                })(session.globalSession.pages, "", 0);

                $main.append(res);
                $main.find(" > ul").nestedSortable({
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
                        clearEmptyUl($main);
                        refreshNestedEl($main);
                        clearCollapseNotNested($main);
                        session.data.pages = pagesNestedToJson($main);
                        session.savePages();
                    }
                });
                refreshNestedEl($main);
                refreshCollapsed($main);
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
                console.log($main.find(" ul.not-childrens").length);
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
        /*(function() {
            pixelPerfect = new modules.pixelPerfect($("#wrap_iframe .pmv-fitting-wrap"), {
                urlXML: "sb/pixel-perfect.xml",
                dirScrins: "design",
                dirThumbnail: "sb/design-thumbnails",
                widthThumbnail: 240,
                nameIFrame: "PP_iframe",
                $screenshotsManipulatorContainer: $('.shab-general-window__bottom'),
                thumbnailScrollAmount: 100,
                mainWindowScrollAmount: 100
            });

            pageManagerVisualizator.$container.on( "pmv.load.iframe", function(){
                pixelPerfect._destroy();
                pixelPerfect._create( pageManagerVisualizator.lastLoadPage );

                if( "$session" in pixelPerfect ) {
                    pixelPerfect.screenshotsManipulator.refresh( pixelPerfect.$session, pixelPerfect.$listAllScrins, pixelPerfect.currentPage );
                    handlerRefreshSelectSize();
                }
            });

            //Добавляем разрешение
            $('#modal-pp-add-group .btn-select').on('click', function(event){
                var hasError = false;

                //Фильтрация ввода
                if( !( /^[1-9]\d{1,3}$/gim.test( $('#modal-pp-add-group .pp-width').val() ) ) ) {
                    hasError = true;
                    $('#modal-pp-add-group .pp-width').closest( ".input-group" ).addClass( "has-error" );
                } else {
                    $('#modal-pp-add-group .pp-width').closest( ".input-group" ).removeClass( "has-error" );
                }
                if( !(/^[1-9]\d{1,3}$/gim.test( $('#modal-pp-add-group .pp-height').val() ) ) ) {
                    hasError = true;
                    $('#modal-pp-add-group .pp-height').closest( ".input-group" ).addClass( "has-error" );
                } else {
                    $('#modal-pp-add-group .pp-height').closest( ".input-group" ).removeClass( "has-error" );
                }

                if( hasError ) {
                    $('#modal-pp-add-group .alert-input-error').css({display: "block"});
                } else {
                    $('#modal-pp-add-group .alert-input-error').css({display: "none"});
                }

                if( !hasError ) {
                    pixelPerfect.addSize( $('#modal-pp-add-group .pp-width').val(), $('#modal-pp-add-group .pp-height').val() );
                    $('#modal-pp-add-group .modal').modal('hide');
                }
            });
            $('.shab__top-menu .add-group').on('click', function(){
                $('#modal-pp-add-group .modal').modal('show');
            });

            //Удаляем разрешение
            $('.shab__top-menu .select-group.selectpicker').on('selectpicker.refresh', function(){//Чтоб при клике на крестике не переключалась страница
                $('.shab__top-menu .select-group .delete').on('click', function(e){
                    e.stopPropagation();
                    if( confirm( "Точно удалить!" ) ) {
                        pixelPerfect.removeSize( $(this).attr( "data-width" ), $(this).attr( "data-height" ) );
                    }
                    return false;
                });
            });

            //Сменяем разрешение
            $('.shab__top-menu').on('change', ' .select-group', function() {
                var $optionSelected = $('.shab__top-menu .select-group option:selected');
                pixelPerfect.selectSize( $optionSelected.attr('data-width'), $optionSelected.attr('data-height') );
            });

            //Обновляем список разрешений в верхнем меню
            $('.shab__top-menu .select-group.selectpicker').selectpicker();
            pixelPerfect.$container.on("pp.change.sizelist pp.create.sizelist", function(){
                handlerRefreshSelectSize();
            });
            pixelPerfect.screenshotsManipulator.$container.on("sm.change_post_set_session", function(){
                handlerRefreshSelectSize();
            });
            function handlerRefreshSelectSize() {
                var pageList = pageManagerVisualizator._options.pageList;
                var $selectSize = $('.shab__top-menu .select-group.selectpicker');
                $selectSize.empty();
                pixelPerfect.$session.find( "page[href='"+( pageManagerVisualizator.lastLoadPage )+"'] media[width][height]" ).each(function(){
                    if( $(this).attr( "active" ) == "true" ) {
                        $selectSize.append('<option selected="selected" data-width="'+( $(this).attr( "width" ) )+'" data-height="'+( $(this).attr( "height" ) )+'" data-content="<span data-width=\''+( $(this).attr( "width" ) )+'\' data-height=\''+( $(this).attr( "height" ) )+'\' class=\'delete glyphicon glyphicon-remove\'></span>&nbsp;&nbsp;<span>'+( $(this).attr( "width" ) + "x" + $(this).attr( "height" ) )+'</span>"></option>');
                    } else {
                        $selectSize.append('<option data-width="'+( $(this).attr( "width" ) )+'" data-height="'+( $(this).attr( "height" ) )+'" data-content="<span data-width=\''+( $(this).attr( "width" ) )+'\' data-height=\''+( $(this).attr( "height" ) )+'\' class=\'delete glyphicon glyphicon-remove\'></span>&nbsp;&nbsp;<span>'+( $(this).attr( "width" ) + "x" + $(this).attr( "height" ) )+'</span>"></option>');
                    }
                });
                $selectSize.selectpicker( "refresh" );
                $selectSize.trigger( "selectpicker.refresh" );
            }
            //Показать "манипулятор скриншотов"
            $('.pp__open-btn').on('click', function(){
                pixelPerfect.screenshotsManipulator.toggle( pixelPerfect.$session );
            });

            //Обновить кнопку
            pixelPerfect.screenshotsManipulator.$container.on({
                "sm.show": function(){
                    $('.pp__open-btn').addClass( "active" );
                },
                "sm.hide": function(){
                    $('.pp__open-btn').removeClass( "active" );
                }
            });

            //Показать верстку или скрины или 50 на 50
            $('.pp__verstka-btn').on('click', function(){
                pixelPerfect.showPageProofsOrDesign(0);
            });
            $('.pp__50p-btn').on('click', function(){
                pixelPerfect.showPageProofsOrDesign(1);
            });
            $('.pp__design-btn').on('click', function(){
                pixelPerfect.showPageProofsOrDesign(2);
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
            pixelPerfect.$container.on("pp.changepageproofsordesign", function(e, show){
                $('.pp-verstka-design .btn').removeClass( "active btn-primary btn-success btn-info btn-warning btn-danger" ).addClass( "btn-default" );
                switch( show ){
                    case 0:
                        $('.pp__verstka-btn').removeClass( "btn-default" ).addClass( "active btn-primary" );
                        break;
                    case 1:
                        $('.pp__50p-btn').removeClass( "btn-default" ).addClass( "active btn-warning" );
                        break;
                    case 2:
                        $('.pp__design-btn').removeClass( "btn-default" ).addClass( "active btn-danger" );
                        break;
                }
            });
        })();*/

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

