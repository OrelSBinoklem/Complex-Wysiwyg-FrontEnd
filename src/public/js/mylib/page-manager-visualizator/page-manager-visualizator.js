(function($){//Модули: getfile, setfile, .xml(), customScrollIFrame

var defaultOptions = {
    $mapNavigatorContainer: undefined,
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
    verticalFixation: "top",

    minHeightCalculateAuto: 480,
    heightCalculateRatio: 16/9,
    calculatedHeightAsMaxHeight: true,
    stopAllAnimationsAtResize: true
};

var pageManagerVisualizator = function($container, sessionModel, options) {
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
    $container.on({
        "pmv.load.iframe": mapNavigatorIFrame.reload,
        "rif.center-iframe": mapNavigatorIFrame.updateDraggable
    });
    //Синхронизируем с ресайзером
    $container.on("pmv.load.iframe", resizeIFrame.reload);
    //Синхронизируем с фиксатором контента при ресайзе
    $container.on({
        "pmv.load.iframe": fixationContentAtResize.reload,
        "rifStartResize": fixationContentAtResize.startFixation,
        "rifStopResize": fixationContentAtResize.stopFixation
    });

    this.setSizeIFrame = function( w, source_h, fast ) {
        var $fittingWrap = $("#"+(____._options.nameIFrame)).closest(".pmv-fitting-wrap");

        var h;

        w = parseInt(w);

        if(source_h == "auto") {
            h = Math.round(w / ____._options.heightCalculateRatio);
            if(h < ____._options.minHeightCalculateAuto) {
                h = ____._options.minHeightCalculateAuto;
            }
        } else {
            h = source_h;
        }

        if(fast) {
            fixationContentAtResize.startFixation();

            if(source_h == "auto" && ____._options.calculatedHeightAsMaxHeight) {
                $fittingWrap.stop().css({width: w+'px', height: '100%', maxHeight: h+'px'});
            } else {
                $fittingWrap.stop().css({width: w+'px', height: h+'px', maxHeight: ''});
            }

            fixationContentAtResize.stopFixation();
        } else {
            fixationContentAtResize.startFixation();

            if(source_h == "auto" && ____._options.calculatedHeightAsMaxHeight) {
                var $outerWrap = $("#"+(____._options.nameIFrame)).closest(".pmv-outer-wrap");

                $fittingWrap.css({height: ($fittingWrap.height())+'px', maxHeight: ''});
                
                $fittingWrap.stop().animate({width: w+'px', height: ((h < $outerWrap.height())?h:$outerWrap.height())+'px'}, 1000, "swing", function() {
                    $fittingWrap.stop().css({width: w+'px', height: '100%', maxHeight: h+'px'});

                    fixationContentAtResize.stopFixation();
                });
            } else {
                $fittingWrap.css({maxHeight: ''});
                $fittingWrap.stop().animate({width: w+'px', height: h+'px'}, 1000, "swing", function() {
                    fixationContentAtResize.stopFixation();
                });
            }
        }

    }

    this.setPositionIFrame = function(l_factor, t_factor) {
        var $iframe = $("#" + (____._options.nameIFrame));
        var $fittingWrap = $iframe.closest(".pmv-fitting-wrap");
        var $outerWrap = $iframe.closest(".pmv-outer-wrap");
        var w, h, w_c, h_c, l, t;

        w = $fittingWrap.width();
        h = $fittingWrap.height();
        w_c = $outerWrap.width();
        h_c = $outerWrap.height();

        l = Math.round( (w_c - w) * l_factor );
        t = Math.round( (h_c - h) * t_factor );

        $fittingWrap.css({
            top: t,
            left: l
        });

        resizeIFrame._centerIFrameAndNoEmptySpace();//И так сработает после всех методов - потому что события выполняються позже (КРОМЕ FIREFOX)
    }

    this.setScrollIFrame = function(l_factor, t_factor) {
        var iframe = window[____._options.nameIFrame];
        var wWindow, wDocument, leftScroll, hWindow, hDocument, topScroll;

        wWindow = $(iframe.window).width();
        wDocument = $(iframe.document).width();
        hWindow = $(iframe.window).height();
        hDocument = $(iframe.document).height();

        leftScroll = Math.round( (wDocument - wWindow) * l_factor );
        topScroll = Math.round( (hDocument - hWindow) * t_factor );

        $(iframe.window).scrollLeft((leftScroll < 0)?0:leftScroll);
        $(iframe.window).scrollTop((topScroll < 0)?0:topScroll);
    }

    this._create = function() {
        this._init();
        
        //Чтобы скролл работал не только в iFrame Но и во всём блоке
        $container.on('wheel', customScrollIFrame._handlerMouseWheel);
    }
    
    this._destroy = function() {
        //Чтобы скролл работал не только в iFrame Но и во всём блоке
        $container.off('wheel', customScrollIFrame._handlerMouseWheel);
        
        $container.find( ".pmv-outer-wrap" ).remove();
    }
    
    this._init = function() {
        $container.append('<div class="pmv-outer-wrap"><div class="pmv-fitting-wrap"></div></div>');
        $container.append('<div class="pmv-container-bl"></div><div class="pmv-container-bb"></div><div class="pmv-container-br"></div>');
        //Получем список страниц
        ____.localSession = sessionModel.getLocalSessionParams();
        options.pageList = {};
    }
    
    this.selectPage = function(href) {
        ____.currentPage = href;
        ____._destroyIFrame();
        if(href !== null) {
            ____._createIFrame(href);
        }
    }
    
    this._createIFrame = function(href) {
        $container.trigger("pmv.prepaste.iframe");
        ____.lastLoadPage = href;
        ____.currentPage = href;
        $container.find( ".pmv-fitting-wrap" ).append('<iframe id="'+(____._options.nameIFrame)+'" name="'+(____._options.nameIFrame)+'" src="'+href+'" width="100%" height="100%"></iframe>');
        $('#'+(____._options.nameIFrame)).load(function(){
            $container.trigger( "pmv.load.iframe");
            $('#'+(____._options.nameIFrame)).contents().find('body').on('click', function(e){
                $("body").trigger( "click.body.iframe" );
            });
        });
    }
    
    this._destroyIFrame = function() {
        $( '#'+(____._options.nameIFrame) ).remove();
    }
    
    this._saveSession = function() {
        /*if( "$session" in ____ ) {
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
        }*/
    }
}

    modules.pageManagerVisualizator = pageManagerVisualizator;
    
})(jQuery);