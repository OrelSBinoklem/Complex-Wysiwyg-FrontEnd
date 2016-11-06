(function($){//Модули: getfile, setfile, .xml(), customScrollIFrame

var defaultOptions = {
    urlXML: "sb/page-manager-visualizator.xml",
    nameIFrame: "PP_iframe",
    pixelsScrollableInSeconds: 2000,
    minWOuterScroll: 23,
    minHOuterScroll: 23,
    minWDraggable: 15,
    minHDraggable: 15,
    minWIFrame: 320,
    minHIFrame: 480,
    responsiveToMovementOfTheCursorInAConfinedSpace: false,
    
    gorizontalFixation: "center",
    verticalFixation: "top"
};

var pageManagerVisualizator = function($container, options) {
    this._options = options;
    var ____ = this;
    ____.$container = $container;
    
    var customScrollIFrame = new modules.customScrollIFrame($container, this._options);
    var mapNavigatorIFrame = new modules.mapNavigatorIFrame($container, this._options);
    var resizeIFrame = new modules.resizeIFrame($container, this._options);
    var fixationContentAtResize = new modules.fixationContentAtResize($container, this._options);
    
    //Синхронизируем с кастомным скроллом
    customScrollIFrame._initPasteHTML();
    $container.on("pmv.load.iframe", function(){
        customScrollIFrame.reload();
    });
    //Синхронизируем с мап навигатором
    $container.on("pmv.load.iframe", mapNavigatorIFrame.reload);
    //Синхронизируем с ресайзером
    $container.on("pmv.load.iframe", resizeIFrame.reload);
    //Синхронизируем с фиксатором контента при ресайзе
    $container.on({
        "pmv.load.iframe": fixationContentAtResize.reload,
        "rif.start.resize": fixationContentAtResize.startFixation,
        "rif.stop.resize": fixationContentAtResize.stopFixation
    });
    
    this._create = function() {
        this._init();
        
        //Чтобы скролл работал не только в iFrame Но и во всём блоке
        $container.on('wheel', customScrollIFrame._handlerMouseWheel);
    }
    
    this._destroy = function() {
        //Чтобы скролл работал не только в iFrame Но и во всём блоке
        $container.off('wheel', customScrollIFrame._handlerMouseWheel);
        ____._saveSession();
        
        $container.find( ".pmv-outer-wrap" ).remove();
    }
    
    this._init = function() {
        $container.append('<div class="pmv-outer-wrap"><div class="pmv-fitting-wrap"></div></div>');
        $container.append('<div class="pmv-container-bl"></div><div class="pmv-container-bb"></div><div class="pmv-container-br"></div>');
        //Получем список страниц
        options.pageList = {};
        ____._restoreSession( "pagelist" );
        $container.on("pmv.load.iframe", function(){
            ____._restoreSession( "size_iframe" );
            ____._restoreSession( "scroll_iframe" );
            ____._restoreSession( "position_iframe" );
            
            resizeIFrame._centerIFrameAndNoEmptySpace();//И так сработает после всех методов - потому что события выполняються позже (КРОМЕ FIREFOX)
        });
    }
    
    this.addPage = function(href) {
        if( !(href in ____._options.pageList) ) {
            //Если такой страницы нету
            for( var key in ____._options.pageList ) {
                ____._options.pageList[key].active = false;
            }
            ____._options.pageList[href] = {active: true};
            $container.trigger("pmv.change.pagelist");
            ____.selectPage(href);
        } else {
            if( !(____._options.pageList[href].active) ) {
                //Если страница есть но она неактивна - делаем её активной
                for( var key in ____._options.pageList ) {
                    ____._options.pageList[key].active = false;
                }
                ____._options.pageList[href].active = true;
                $container.trigger("pmv.change.pagelist");
                ____.selectPage(href);
            }
        }
    }
    
    this.removePage = function(href) {
        var firstPage = false;
        if( href in ____._options.pageList ) {
            if(____._options.pageList[href].active) {
                //Если страница активна то удаляем её и переводим фокус в первую страницу (если она есть)
                delete ____._options.pageList[href];
                for( var key in ____._options.pageList ) {
                    ____._options.pageList[key].active = true;
                    firstPage = key;
                    break;
                }
                $container.trigger("pmv.change.pagelist");
                ____._destroyIFrame();
            } else {
                //Если неактивна удаляем
                delete ____._options.pageList[href];
                $container.trigger("pmv.change.pagelist");
                ____._saveSession();
            }
            
            if(firstPage !== false) {____._createIFrame(firstPage)};
        }
    }
    
    this.reloadPage = function() {
        for(var key in ____._options.pageList) {
            if(____._options.pageList[key].active) {
                ____.selectPage(key);
                break;
            }
        }
    }
    
    this.selectPage = function(href) {
        var changePage = false;
        
        for(var key in ____._options.pageList) {
            if( href == key ) {
                if( ____._options.pageList[key].active === false) {
                    changePage = true;
                }
                ____._options.pageList[key].active = true;
            } else {
                ____._options.pageList[key].active = false;
            }
        }
        
        if( changePage ) {
            $container.trigger("pmv.change.pagelist");
        }
        ____._destroyIFrame();
        ____._createIFrame(href);
    }
    
    this._createIFrame = function(href) {
        $container.trigger("pmv.prepaste.iframe");
        ____.lastLoadPage = href;
        $container.find( ".pmv-fitting-wrap" ).append('<iframe id="'+(____._options.nameIFrame)+'" name="'+(____._options.nameIFrame)+'" src="'+href+'" width="100%" height="100%"></iframe>');
        $( '#'+(____._options.nameIFrame) ).load(function(){
            $container.trigger( "pmv.load.iframe" );
            $( '#'+(____._options.nameIFrame) ).contents().find('body').on('click', function(e){
                $( "body" ).trigger( "click.body.iframe" );
            });
        });
    }
    
    this._destroyIFrame = function() {
        ____._saveSession();        
        $( '#'+(____._options.nameIFrame) ).remove();
    }
    
    this._restoreSession = function( specific ) {
        if( !("$session" in ____) ) {
            $.ajax({
                url: "sb.php",
                type: "POST",
                cache: false,
                data: ({module: 'getfile', dir: ____._options.urlXML, text_encoding: 'UTF-8'}),
                async: false,
                success: function(data){
                    ____.$session = $($.parseXML(data));
                    ____.$session.find( "pages page" ).each(function(){
                        ____._options.pageList[$(this).attr("href")] = {
                            active: ($(this).attr("active") == "true") ? true : false
                        }
                    });
                    $container.trigger("pmv.create.pagelist");
                }
            });
        }
        
        switch( specific ) {
            //Загрузка активной страницы 
            case "pagelist":
                for(var key in ____._options.pageList) {
                    if(____._options.pageList[key].active) {
                        ____.selectPage(key);
                        break;
                    }
                } 
                break;
            case "scroll_iframe":
                var iframe = window[____._options.nameIFrame];
                var scrollTop, scrollLeft;
                
                var $page = ____.$session.find( " page[href='"+____.lastLoadPage+"'][scrolltop][scrollleft]" );
                if( $page.size() && ____.lastLoadPage in ____._options.pageList ) {
                    scrollTop = parseInt( $page.attr( "scrolltop" ) );
                    scrollLeft = parseInt( $page.attr( "scrollleft" ) );
                    
                    $(iframe.window).scrollTop( scrollTop );
                    $(iframe.window).scrollLeft( scrollLeft );
                }
                break;
            case "position_iframe": 
                var iframe = window[____._options.nameIFrame];
                var $iframe = $("#"+(____._options.nameIFrame));
                var $fittingWrap = $iframe.closest(".pmv-fitting-wrap");
                var t, l;
                
                var $page = ____.$session.find( " page[href='"+____.lastLoadPage+"'][l][t]" );
                if( $page.size() && ____.lastLoadPage in ____._options.pageList ) {
                    l = parseInt( $page.attr( "l" ) );
                    t = parseInt( $page.attr( "t" ) );
                    
                    $fittingWrap.css({
                        left: l,
                        top: t
                    });
                }
                break;
            case "size_iframe":
                var iframe = window[____._options.nameIFrame];
                var $iframe = $("#"+(____._options.nameIFrame));
                var $fittingWrap = $iframe.closest(".pmv-fitting-wrap");
                var w, h;
                
                var $page = ____.$session.find( " page[href='"+____.lastLoadPage+"'][w][h]" );
                if( $page.size() ) {
                    w = parseInt( $page.attr( "w" ) );
                    h = parseInt( $page.attr( "h" ) );
                    
                    $fittingWrap.css({
                        width: w,
                        height: h
                    });
                }
                break;
        }
    }
    
    this._saveSession = function() {
        if( "$session" in ____ ) {
            //Сохраняем страницы (синхронизируем pageList и xml)
                var $pages = ____.$session.find( " pages" );
                var pre_href;
                //вставляем которых нет в xml
                for(var href in ____._options.pageList) {
                    var page = ____._options.pageList[href];
                    
                    var $page = $pages.find( "page[href='"+(href)+"']" );
                    if( $page.size() ) {
                        $page.attr( "active", page.active );
                    } else {
                        if( pre_href ) {
                            var $page = $pages.find( "page[href='"+(pre_href)+"']" );
                            $page.after( '<page href="'+(href)+'" active="'+(page.active)+'" />' );
                        } else {
                            $pages.append( '<page href="'+(href)+'" active="'+(page.active)+'" />' );
                        }
                    }
                    pre_href = href;
                }
                //удаляем которых нет в pageList
                $pages.find( " page" ).each(function(){
                    if( !($(this).attr( "href" ) in ____._options.pageList) ) {
                        $(this).remove();
                    }
                });
            
            //Сохраняем состояние iFrame (если он есть)
            if( ____._options.nameIFrame in window ) {
                var $thisPage = ____.$session.find( "pages page[href='"+(____.lastLoadPage)+"']" );
                if( $thisPage.size() ) {
                    var iframe = window[____._options.nameIFrame];
                    var $iframe = $("#"+(____._options.nameIFrame));
                    var $fittingWrap = $iframe.closest(".pmv-fitting-wrap");
                    
                    $thisPage
                        .attr( "scrolltop", Math.round( $(iframe.window).scrollTop() || 0) )
                        .attr( "scrollleft",  Math.round( $(iframe.window).scrollLeft() || 0) )
                        .attr( "l", Math.round( $fittingWrap.position().left) )
                        .attr( "t", Math.round( $fittingWrap.position().top) )
                        .attr( "w", Math.round( $fittingWrap.width()) )
                        .attr( "h", Math.round( $fittingWrap.height()) );
                }
            }
            
            //'<\?xml version="1.0" encoding="UTF-8"\?>'+
            var resxml = ____.$session.xml().join('');
            
            //Записываем в файл
            $.ajax({
                url: "sb.php",
                async: true,
                cache: false,
                type: "POST",
                data: ({module: 'setfile', dir: ____._options.urlXML, file_text: resxml, text_encoding: 'UTF-8'})
            });
        }
    }
    
    this._restoreSessionFromSubModules = function() {
        resizeIFrame._restoreSession();
        customScrollIFrame._restoreSession();
        mapNavigatorIFrame._restoreSession();
        
        resizeIFrame._centerIFrameAndNoEmptySpace();//И так сработает после всех методов - потому что события выполняються позже (КРОМЕ FIREFOX)
    }          
}
    
    
    
    
    
    
    
    
/*jQuery.fn.responsiveBlock = function(options){
    options = $.extend({
        defColor:"white",
        hoverColor:"red"
    }, options});

    var make = function(){
        
    };

    return this.each(make);*/
    modules.pageManagerVisualizator = pageManagerVisualizator;
    
})(jQuery);