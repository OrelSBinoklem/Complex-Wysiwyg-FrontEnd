(function($){//Модули: getfile, setfile, .xml(), malihu-custom-scrollbar

var defaultOptions = {
    urlXML: "shablonizator/pixel-perfect.xml",
    dirScrins: "shablonizator/scrins",
    dirThumbnail: "shablonizator/miniatyrki",
    widthThumbnail: 240,
    nameIFrame: "PP_iframe",
    $screenshotsManipulatorContainer: null,//Умолчания нету
    thumbnailScrollAmount: 100,
    mainWindowScrollAmount: 100
};

var pixelPerfect = function($container, options) {
    this._options = options;
    var ____ = this;
    ____.$container = $container;
    
    var screenshotsManipulator = new modules.screenshotsManipulator( ____._options.$screenshotsManipulatorContainer, this._options);
    ____.screenshotsManipulator = screenshotsManipulator;
    
    this._create = function( href )
    {
        ____.setCurrentPage( href );
        
        $container.append('<div class="pp-design"></div>');
        
        //свойства
        ____.$listAllScrins;
        ____.intervalRefreshByResizeDocument;
        ____.wIFrame;
        
        ____.changePositionTemp = {};
        
        //Установка событий
        $(window[____._options.nameIFrame].window).on("scroll", ____._refreshByScroll);
        $(window[____._options.nameIFrame].window).on('resize', ____._refreshByResizeDocument);
        ____.intervalRefreshByResizeDocument = setInterval(function(){
            var iframe = window[____._options.nameIFrame];
            if( ____.wIFrame === undefined || ____.wIFrame != Math.round( $(iframe.document).width() ) ) {
                ____.wIFrame = Math.round( $(iframe.document).width() );
                ____._refreshByResizeDocument();
            }
        }, 1000);
        $container.on( "pp.change.sizelist", function(){
            ____._saveSession();
            
            screenshotsManipulator.refresh( ____.$session, ____.$listAllScrins, ____.currentPage );
        });
        $container.on("pp.create.sizelist", function(){
            screenshotsManipulator._create();
            
            screenshotsManipulator.createListScrins( ____.$session, ____.$listAllScrins, ____.currentPage );
        });
        
        screenshotsManipulator.$container.on("sm.change", function(){
            screenshotsManipulator._setSession( ____.$session, ____.$listAllScrins, ____.currentPage );

            ____.reload();

            ____._saveSession();

            screenshotsManipulator.$container.trigger( "sm.change_post_set_session" );
        });
        screenshotsManipulator.$container.on("sm.change.size", function(e, w, h){
            ____.setSizeIFrame( w, h );
        });
        screenshotsManipulator.$container.on("sm.changeoffsetstart", ____._refreshByChangePositionStart);
        screenshotsManipulator.$container.on("sm.changeoffset", ____._refreshByChangePosition);
        
        ____._restoreSession();
    }
    
    this._destroy = function() {
        clearInterval( ____.intervalRefreshByResizeDocument );
        ____._saveSession();
        $container.find( " .pp-design" ).remove();
    }
    
    this.setCurrentPage = function( href ) {
        ____.currentPage = href;
    }
    
    this.addSize = function( w, h ) {
        var $page = ____.$session.find( " page[href='" + ____.currentPage + "']" );
        if( $page.size() == 0 ) {
            ____.$session.find( " wrap" ).append( $('<page href="' + ____.currentPage + '"></page>') );
            $page = ____.$session.find( " page[href='" + ____.currentPage + "']" );
        }
        
        var $media = $page.find( " media[width="+( w )+"][height="+( h )+"]" );
        if( $media.size() ) {
            alert( "Такое разрешение уже есть в списке!" );
            
            if( $media.attr( "active" ) != "true" ) {
                //если неактивно
                ____.selectSize( w, h );
            }
        } else {
            $page.append( $('<media width="'+( w )+'" height="'+( h )+'" active="false" ></media>') );
            ____.selectSize( w, h );
        }
    }
    
    this.removeSize = function( w, h ) {
        var $page = ____.$session.find( " page[href='" + ____.currentPage + "']" );
        if( $page.size() ) {
            var $media = $page.find( " media[width="+( w )+"][height="+( h )+"]" );
            if( $media.size() ) {
                var removeMediaActive = $media.attr( "active" ) == "true";
                $media.remove();
                
                if( $page.find( " media[width][height]" ).size() && removeMediaActive ) {
                    var $firstMedia = $page.find( " media[width][height]" ).first();
                    $firstMedia.attr( "active", "true" );
                    ____.selectSize( $firstMedia.attr( "width" ), $firstMedia.attr( "height" ) );
                }
                
                $container.trigger("pp.change.sizelist");
                ____.reload();
            }
        }
    }
    
    this.selectSize = function( w, h ) {
        var $page = ____.$session.find( " page[href='" + ____.currentPage + "']" );
        if( $page.size() ) {
            var $media = $page.find( " media[width="+( w )+"][height="+( h )+"]" );
            if( $media.size() ) {
                if( $media.attr( "active" ) != "true" ) {
                    $page.find( " media[width][height]" ).attr( "active", "false" );
                    $media.attr( "active", "true" );
                    $container.trigger("pp.change.sizelist");
                    ____.setSizeIFrame( w, h );
                } else {
                    $page.find( " media[width][height]" ).attr( "active", "false" );
                    $media.attr( "active", "true" );
                }
                ____.reload();
            }
        }
    }

        this.setSizeIFrame = function( w, h ) {
            var $fittingWrap = $("#"+(____._options.nameIFrame)).closest(".pmv-fitting-wrap");
            $fittingWrap.stop().animate({width: w+'px', height: h+'px'}, 1000);
        }
    
    this.reload = function() {
        ____._deleteScrins();
        ____._pasteScrins();
    }
    
    this._refreshByChangePositionStart = function(e, $input) {
        //проверять активен ли текущий медиазапрос (проверяеться при вызове события)
        ____._refreshIndexesForScrins();
        
        ____.changePositionTemp.currentScreenIsActive = false;
        
        var $scrin = $input.closest( ".sm-scrin" );
        if( $scrin.is( "[data-active-index]" ) ) {
            var indexActiveScrin = parseInt( $scrin.attr( "data-active-index" ) );
            
            var $relative = $scrin.find(' .sm-deviation-relative .btn.active');
            var left = $relative.attr( "data-left" );
            var top = $relative.attr( "data-top" );
            
            var l, t;
            switch( left ) {
                case "left":
                    l = 0;
                    break;
                case "center":
                    l = 50;
                    break;
                case "right":
                    l = 100;
                    break;
            }
            switch( top ) {
                case "top":
                    t = 0;
                    break;
                case "center":
                    t = 50;
                    break;
                case "bottom":
                    t = 100;
                    break;
            }
            
            ____.changePositionTemp.currentScreenIsActive = true;
            
            ____.changePositionTemp.l = l;
            ____.changePositionTemp.t = t;
            
            ____.changePositionTemp.$currentInput = $input;
            ____.changePositionTemp.$currentScrin = $container.find( " .pp-design > *" ).eq( indexActiveScrin );
        }
    }
    
    this._refreshByChangePosition = function() {
        if( ____.changePositionTemp.currentScreenIsActive ) {
            var $currentInput = ____.changePositionTemp.$currentInput;
            var $currentScrin = ____.changePositionTemp.$currentScrin;
            
            var l = ____.changePositionTemp.l;
            var t = ____.changePositionTemp.t;
            
            var val = parseInt( $currentInput.val() );
            
            if( $currentInput.hasClass( "sm-deviation-left-px" ) ) {
                $currentScrin.find( " .pp-wrap-deviation-pixels" ).css({left: val});
                
            } else if ( $currentInput.hasClass( "sm-deviation-left-percent" ) ) {
                $currentScrin.find( " .pp-wrap-deviation-percent" ).css({left: ( l + val )+"%"});
                
            } else if ( $currentInput.hasClass( "sm-deviation-top-px" ) ) {
                $currentScrin.find( " .pp-wrap-deviation-pixels" ).css({top: val});
                
            } else if ( $currentInput.hasClass( "sm-deviation-top-percent" ) ) {
                console.log( t + val );
                $currentScrin.find( " .pp-wrap-deviation-percent" ).css({top: ( t + val )+"%"});
            }
        }
    }
    
    this._refreshByScroll = function() {
        var $design = $container.find( " .pp-design" );
        var iframe = window[____._options.nameIFrame];
        
        $design.find( " .pp-screen-static" ).css({
            top: "-" + Math.round( $(iframe.window).scrollTop() ) + "px",
            left: "-" + Math.round( $(iframe.window).scrollLeft() ) + "px"
        });
    }
    
    this._refreshByResizeDocument = function() {
        var $design = $container.find( " .pp-design" );
        var iframe = window[____._options.nameIFrame];
        
        $design.find( " .pp-screen-static" ).css({
            width: Math.round( $(iframe.document).width() )
        });
    }
    
    this._pasteScrins = function() {
        var $design = $container.find( " .pp-design" );
        var resScrins = "";
        ____.$session.find( "page[href='"+ ____.currentPage +"'] media[active='true'] scrin[active='true']" ).each(function(){
            var arrDeviation = $(this).attr( "deviation" ).split("|");
            var lastIndex = arrDeviation.length - 1;
            
            var position = arrDeviation[0];
            var left = arrDeviation[1];
            var top = ( position == "static" ) ? "top" : arrDeviation[2];
            var l_px =  parseInt( arrDeviation[lastIndex-3] );
            var l_per = parseInt( arrDeviation[lastIndex-2] );
            var t_px =  parseInt( arrDeviation[lastIndex-1] );
            var t_per = parseInt( arrDeviation[lastIndex] );
            
            var $scrin = ____.$listAllScrins.find( "scrin[src='"+( $(this).attr( "src" ) )+"']" );
            var wImg = $scrin.attr( "width" );
            var hImg = $scrin.attr( "height" );
        
            var l, t, l_img, t_img;
            switch( left ) {
                case "left":
                    l = 0;
                    l_img = 0;
                    break;
                case "center":
                    l = 50;
                    l_img = -50;
                    break;
                case "right":
                    l = 100;
                    l_img = -100;
                    break;
            }
            switch( top ) {
                case "top":
                    t = 0;
                    t_img = 0;
                    break;
                case "center":
                    t = 50;
                    t_img = -50;
                    break;
                case "bottom":
                    t = 100;
                    t_img = -100;
                    break;
            }
            resScrins += '\
                <div class="pp-screen-'+( ( position == "static" ) ? "static" : "fixed" )+'">\
                    <div style="left: '+( l_per + l )+'%; top: '+( t_per + t )+'%;" class="pp-wrap-deviation-percent">\
                        <div style="width: ' + wImg + 'px; height: ' + hImg + 'px; left: ' + l_px + 'px; top: ' + t_px + 'px;" class="pp-wrap-deviation-pixels">\
                            <img src="'+( shablonizator.base_url + ____._options.dirScrins + "/" + $(this).attr( "src" ) )+'" style="width: ' + wImg + 'px; height: ' + hImg + 'px; left: ' + l_img + '%; top: ' + t_img + '%;"/>\
                        </div>\
                    </div>\
                </div>';
        });
        $design.append( resScrins );
            
        ____._refreshByScroll();
        ____._refreshByResizeDocument();
    }
    
    this._deleteScrins = function() {
        $container.find( " .pp-design" ).empty();
    }
    
    this.showPageProofsOrDesign = function( show ) {
        //0 - показать верстку,
        //1 - показать на половину и верстку и дизайн,
        //2 - показать дизайн
        switch ( show ) {
            case 0:
                $("#pp_wrap_design").css({opacity: 0});
                $( '#'+(____._options.nameIFrame) ).css({opacity: 1});
                break;
            case 1:
                $("#pp_wrap_design").css({opacity: 1});
                $( '#'+(____._options.nameIFrame) ).css({opacity: 0.5});
                break;
            case 2:
                $("#pp_wrap_design").css({opacity: 1});
                $( '#'+(____._options.nameIFrame) ).css({opacity: 0});
                break;
        }
        
        $container.trigger( "pp.changepageproofsordesign", show );
        
        ____.$session.find( "show_page_proofs_or_design" ).text( show );
        ____._saveSession();
    }
    
    this._restoreSession = function() {
        if( !("$session" in ____) ) {
            //Отдаём запрос на создание миниатюрок из скринов и получаем список всех скринов и их разрешения
            
            $.ajax({
                url: "shablonizator.php",
                type: "POST",
                cache: false,
                data: ({
                    module: 'pixel_perfect',
                    dir_scrins: ____._options.dirScrins,
                    dir_miniatyrki: ____._options.dirThumbnail,
                    width_miniatyrki: ____._options.widthThumbnail
                }),
                async: false,
                success: function(data){
                    ____.$listAllScrins = $($.parseXML("<wrap>"+data+"</wrap>"));
                }
            });
            
            //Загружаем сессию
            $.ajax({
                url: "shablonizator.php",
                type: "POST",
                cache: false,
                data: ({module: 'getfile', dir: ____._options.urlXML, text_encoding: 'UTF-8'}),
                async: false,
                success: function(data){
                    ____.$session = $($.parseXML(data));
                    //Удаляем скрины из сессии которых уже нет (например пользователь удалил из папки)
                    ____.$session.find( "scrin" ).each(function(){
                        if( ____.$listAllScrins.find( "scrin[src='"+($(this).attr( "src" ))+"']" ).size() == 0 ) {
                            $(this).remove();
                        }
                    });
                }
            });
            
            $container.trigger("pp.create.sizelist");
        }
        
        ____._pasteScrins();
        
        ____.showPageProofsOrDesign( parseInt(____.$session.find( "show_page_proofs_or_design" ).text()) );
        
        screenshotsManipulator._restoreSession( ____.$session );
    }
    
    this._saveSession = function() {
        if( "$session" in ____ ) {
            var resxml = ____.$session.xml().join('');
            
            //Записываем в файл
            $.ajax({
                url: "shablonizator.php",
                async: true,
                cache: false,
                type: "POST",
                data: ({module: 'setfile', dir: ____._options.urlXML, file_text: resxml, text_encoding: 'UTF-8'})
            });
        }
    }
    
        //надо удалять страницы которых уже нет
        this._saveSessionAndClearDeletedPages = function( pageList ) {
            ____.$session.find( "page" ).each(function(){
                if( !( $(this).attr( "href" ) in pageList ) ) {
                    $(this).remove();
                }
            });
        }
    
    //Кроссмодульные методы
    //Обновления индексов для "_refreshByChangePosition" чтобы можно было легко находить скрин в дизайне по левой панели
    this._refreshIndexesForScrins = function() {
        var index = 0;
        
        screenshotsManipulator.$container.find( " .sm-container .sm-media" ).each(function(){
            index = 0;
            $(this).find( " .sm-scrin" ).each(function(){
                if( $(this).hasClass( "active" ) ) {
                    $(this).attr( "data-active-index", index );
                    index++;
                }
            });
        });
    }
}
    
    
    
    
    
    
    
    

    modules.pixelPerfect = pixelPerfect;
    
})(jQuery);