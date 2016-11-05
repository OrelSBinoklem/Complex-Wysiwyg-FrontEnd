(function($){//Модули: getfile, setfile, .xml(), customScrollIFrame

var defaultOptions = {
    dirThumbnail: "shablonizator/miniatyrki",
    widthThumbnail: 240,
    thumbnailScrollAmount: 100,
    mainWindowScrollAmount: 100
};

var screenshotsManipulator = function($container, options) {
    this._options = options;
    var ____ = this;
    ____.$container = $container;
    //this._options.$container = $container;//заменяло контенер пиксель перфект
    
    this._create = function( href )
    {
        //HTML
        $container.append('<div class="sm-container-scroll-wrap"><ul class="sm-container twitter-bootstrap-3"></ul></div>');
        $container.append('<div class="sm-thumbnail"><div class="sm-thumbnail-img-container"></div></div>');
        $container.find( " .sm-container-scroll-wrap" ).mCustomScrollbar({
            axis: "y",
            theme: "dark",
            scrollbarPosition: "outside",
            scrollInertia: 100,
            mouseWheel: {
                scrollAmount: ____._options.thumbnailScrollAmount
            }
        });
        $container.find( " .sm-thumbnail" ).mCustomScrollbar({
            axis: "y",
            theme: "dark",
            scrollbarPosition: "outside",
            scrollInertia: 100,
            mouseWheel: {
                scrollAmount: ____._options.thumbnailScrollAmount
            }
        });
        
        //Установка обработчиков событий
        $( "body" ).on("click click.body.iframe", ____.handlerClickBeyondLimits);
        
        $container.on("click", " .btn-deviation", ____.handlerOpenDeviation);
        
        $container.on("click", " .sm-media .h-group", ____.handlerClickMedia);
        $container.on("click", " .sm-media .sm-scrin", ____.handlerClickScrin);
        
        $container.on("click", " .sm-deviation-fixed-or-static .btn", ____.handlerChangeStaticOrFixed);
        $container.on("click", " .sm-deviation-relative .btn", ____.handlerChangeRelativePosition);
        
        $container.on( "mouseenter", " .sm-scrin", ____._handlerShowThumbnail);
        $container.on( "mouseleave", ____._handlerHideThumbnail);
    }
    
    this._destroy = function()
    {
        $container.find( " .sm-container-scroll-wrap" ).remove();
    }
    
    //Открытие окна для изменения положения скрина
    this.handlerOpenDeviation = function(e){
        e.preventDefault();
        
        if( $(this).find( " ~ .sm-deviation" ).css( "display" ) == "none" ) {
            $container.find( " .sm-deviation" ).css({display: "none"});
            $(this).find( " ~ .sm-deviation" ).css({display: "block"});
        } else {
            $container.find( " .sm-deviation" ).css({display: "none"});
        }
    }
    
    //Закрытие окна для изменения положения скрина
    this.handlerCloseDeviation = function(e){
        if( $(e.target).closest(".btn-deviation, .sm-deviation").size() == 0 ) {
            $container.find( " .sm-deviation" ).css({display: "none"});
        }
    }
    
    //Выбор разрешения
    this.handlerClickMedia = function(e){
        $container.find( " .sm-media" ).removeClass( "active" );
        var $currentSMMedia = $(this).closest( ".sm-media" );
        $currentSMMedia.addClass( "active" );
        $container.trigger("sm.change");//и это тоже должно сработать после вызова "sm.change.size"//НЕСРАБОТАЛО
        $container.trigger("sm.change.size", [parseInt($currentSMMedia.attr("data-width")), parseInt($currentSMMedia.attr("data-height"))]);
    }
    
    //Выбор скрина
    this.handlerClickScrin = function(e){
        if( !$(e.target).closest(".btn-deviation, .sm-deviation").size() ) {
            $(this).toggleClass( "active" );  
            $container.trigger("sm.change");
        }
    }
    
    //Изменение позиционирования скрина fixed или static
    this.handlerChangeStaticOrFixed = function(){
        var $deviation = $(this).closest( ".sm-deviation" );
        
        //fix
        $(this).closest( ".sm-deviation-fixed-or-static" ).find( "input" ).prop("checked", false);
        $(this).find( " input" ).prop("checked", "checked");
        
        if($(this).find( " input" ).val() == 1)
        //static
        {   
            var leftPos = $deviation.find(' .sm-deviation-relative .btn.active').first().attr( "data-left" );
            
            $deviation.find(' .sm-deviation-relative .btn-group:nth-child(2) .btn').addClass('disabled');
            $deviation.find(' .sm-deviation-relative .btn-group:nth-child(3) .btn').addClass('disabled');
            
            $deviation.find(' .sm-deviation-relative .btn').removeClass('active btn-danger').addClass( "btn-default" );
            $deviation.find(' .sm-deviation-relative .btn-group:nth-child(1) .btn[data-left="'+ leftPos +'"]').removeClass('btn-default').addClass('active btn-danger');
            
            $deviation.find(' .sm-deviation-relative')
                .removeClass('sm-deviation-fixed')
                .addClass('sm-deviation-static');
        }
        //fixed
        else {
            $deviation.find(' .sm-deviation-relative .btn').removeClass('disabled');
            
            $deviation.find(' .sm-deviation-relative')
                .removeClass('sm-deviation-static')
                .addClass('sm-deviation-fixed');
        }
        
        $container.trigger("sm.change");
    }
    
    //Изменение точки крепления скрина к экрану
    this.handlerChangeRelativePosition = function(){
        if( !$(this).hasClass( "disabled" ) ) {
            $(this).closest( ".sm-deviation" ).find(' .sm-deviation-relative .btn').removeClass('active btn-danger').addClass( "btn-default" );
            $(this).removeClass('btn-default').addClass( "active btn-danger" );
            
            $container.trigger("sm.change");
        }
    }
    
    this.handlerClickBeyondLimits = function(e){
        ____.handlerCloseDeviation(e);
    }
    
    this.fastShow = function( $session ) {
        $container.find( " .sm-container-scroll-wrap" ).css({display: "block"});
        
        $session.find( "screenshots_manipulator" ).text( "show" );
        
        $container.trigger("sm.show");
    }
    
    this.show = function( $session ) {
        if( "openSMTimeLine__close" in ____ ) { ____.openSMTimeLine__close.pause() }
        $container.find( " .sm-container-scroll-wrap" ).css({
            display: "block",
            opacity: 0,
            transform: "scale(0.8, 0.8)"
        });
        
        if( !("openSMTimeLine" in ____) ) {
            ____.openSMTimeLine = (new TimelineLite()).append([
                TweenMax.to($container.find( " .sm-container-scroll-wrap" ), 0.5,
                    {css:{transform: "scale(1, 1)" }}),
                TweenMax.to($container.find( " .sm-container-scroll-wrap" ), 0.3,
                    {css:{ opacity: 1 }})
            ]);
        } else {
            ____.openSMTimeLine.restart();
        }
        
        $session.find( "screenshots_manipulator" ).text( "show" );
        
        $container.trigger("sm.show");
    }
    
    this.hide = function( $session ) {
        ____._handlerHideThumbnail();
        
        if( "openSMTimeLine" in ____ ) { ____.openSMTimeLine.pause() }
        if( !("openSMTimeLine__close" in ____) ) {
            ____.openSMTimeLine__close = (new TimelineLite()).append([
                TweenMax.to($container.find( " .sm-container-scroll-wrap" ), 0.5,
                    {css:{ transform: "scale(0.8, 0.8)"}, onComplete: handlerComplete}),
                TweenMax.to($container.find( " .sm-container-scroll-wrap" ), 0.5,
                    {css:{ opacity: 0 }})
            ]);
        } else {
            ____.openSMTimeLine__close.restart();
        }
        function handlerComplete() {
            $container.find( " .sm-container-scroll-wrap" ).css('display', 'none');
        }
        
        $session.find( "screenshots_manipulator" ).text( "hidden" );
        
        $container.trigger("sm.hide");
    }
    
    this.toggle = function( $session ) {
        if( $session.find( "screenshots_manipulator" ).text() == "show" ) {
            ____.hide( $session );
        } else if( $session.find( "screenshots_manipulator" ).text() == "hidden" ) {
            ____.show( $session );
        }
    }
    
    this._handlerShowThumbnail = function() {
        src = shablonizator.base_url + ____._options.dirThumbnail + "/" + $(this).attr( "data-src" );
        $container.find( " .sm-thumbnail img" ).remove();
        
        $container.find( " .sm-thumbnail-img-container" )
            .append( '<img src="'+ src +'" alt="" />' )
        var $thumbnail = $container.find( " .sm-thumbnail" );
        $thumbnail
            .stop()
            .fadeIn()
            .css({width: ____._options.widthThumbnail, top: parseInt($thumbnail.css("top")) - ($thumbnail.offset().top)});
    }
    
    this._handlerHideThumbnail = function() {
        $container.find( " .sm-thumbnail" )
            .stop()
            .fadeOut(400, function(){
                $container.find( " .sm-thumbnail img" ).remove();
            });
    }
    
    this.refresh = function( $session, $listAllScrins, currentPage ) {
        ____.removeListScrins();
        ____.createListScrins( $session, $listAllScrins, currentPage );
    }
    
    this.createListScrins = function( $session, $listAllScrins, currentPage ) {
        var result = "";
        
        var $page = $session.find( " page[href='" + currentPage + "']" );
        $page.find( " media" ).each(function(){
            result += '<li class="sm-media'+( ( $(this).attr( "active" ) == "true" ) ? " active" : "" )+' clearfix" data-width="'+( $(this).attr( "width" ) )+'" data-height="'+( $(this).attr( "height" ) )+'">';
            result += '<h4 class="h-group"><span class="sm-w-h">'+( $(this).attr( "width" ) )+'x'+( $(this).attr( "height" ) )+'</span></h4>';
            
            $(this).find( " scrin" ).each(function(){
                var arrDeviation = $(this).attr( "deviation" ).split("|");
                var lastIndex = arrDeviation.length - 1;
                
                var position = arrDeviation[0];
                var left = arrDeviation[1];
                var top = ( position == "static" ) ? "top" : arrDeviation[2];
                var l_px =  parseInt( arrDeviation[lastIndex-3] );
                var l_per = parseInt( arrDeviation[lastIndex-2] );
                var t_px =  parseInt( arrDeviation[lastIndex-1] );
                var t_per = parseInt( arrDeviation[lastIndex] );
                
                var $scrin = $listAllScrins.find( " scrin[src='"+( $(this).attr( "src" ) )+"']" );
                var wScrin = $scrin.attr( "width" );
                var hScrin = $scrin.attr( "height" );
                
                //Список разрешений со скринами
                result += '\
                <div class="sm-scrin'+( ( $(this).attr( "active" ) == "true" ) ? " active" : "" )+' panel panel-primary" data-src="'+ $(this).attr( "src" ) +'">\
                    <div class="panel-body">\
                        <strong class="sm-name-scrin">'+ $(this).attr( "src" ) +'</strong>\
                        <div class="floatr-fix">\
                            '+ ____.createDeviation( position, left, top, l_px, l_per, t_px, t_per ) +'\
                            <span class="sm-w-h-scrin text-right"><kbd>'+ wScrin +'</kbd> x <kbd>'+ hScrin +'</kbd></span>\
                        </div>\
                    </div>\
                </div>';
            });
            result += '</li>';
        });
        
        //Список всех скринов
        result += '<li class="sm-all-scrins"><h4 class="h-group">Все скрины:</h4>';
        $listAllScrins.find( " scrin" ).each(function(){
            result += '\
            <div class="sm-scrin panel panel-default" data-src="'+ $(this).attr( "src" ) +'">\
                <div class="panel-body">\
                    <strong class="sm-name-scrin">'+ $(this).attr( "src" ) +'</strong>\
                    <div class="floatr-fix">\
                        <span class="sm-w-h-scrin"><kbd>'+ $(this).attr( "width" ) +'</kbd> x <kbd>'+ $(this).attr( "height" ) +'</kbd></span>\
                    </div>\
                </div>\
            </div>';
        });
        result += '</li>';
        
        $container.find( " .sm-container" ).append( result );
        
        ____.refreshUiSortableAndSpinner();
    }
        //Создать окно отклонения
        this.createDeviation = function( position, left, top, l_px, l_per, t_px, t_per ) {
            var result = "";
            
            result += '\
            <div class="btn-deviation btn btn-default btn-xs"><span class="glyphicon glyphicon-move"></span></div>\
            <div class="sm-deviation panel panel-primary">\
                <div class="panel-body">\
                    <div class="row">\
                        <div class="col-xs-6 sm-deviation-col-left">\
                            <form class="sm-deviation-fixed-or-static btn-group-vertical btn-toggle-one-color" data-toggle="buttons">\
            					<label class="btn btn-'+( ( position == "static" ) ? "primary active" : "default" )+'" data-btn-color="primary">\
            						<input type="radio" name="sm-radio-fixed-or-static"'+( ( position == "static" ) ? " checked" : "" )+' value="1" />Static\
            					</label>\
            					<label class="btn btn-'+( ( position == "fixed" ) ? "danger active" : "default" )+'" data-btn-color="danger">\
            						<input type="radio" name="sm-radio-fixed-or-static"'+( ( position == "fixed" ) ? " checked" : "" )+' value="0" />Fixed\
            					</label>\
            				</form>\
                        </div>\
                        <div class="col-xs-6 sm-deviation-col-right">\
                            <div class="sm-deviation-relative sm-deviation-'+ position +' btn-group-table">\
                                <div class="btn-group btn-group-justified" role="group">\
                                    <div class="'+( ( left == "left"   && top == "top" )    ? " active btn-danger" : " btn-default" )+' btn" data-left="left" data-top="top" role="button">&nbsp</div>\
                                    <div class="'+( ( left == "center" && top == "top" )    ? " active btn-danger" : " btn-default" )+' btn" data-left="center" data-top="top" role="button">&nbsp</div>\
                                    <div class="'+( ( left == "right"  && top == "top" )    ? " active btn-danger" : " btn-default" )+' btn" data-left="right" data-top="top" role="button">&nbsp</div>\
                                </div>\
                                <div class="btn-group btn-group-justified" role="group">\
                                    <div class="'+( ( left == "left"   && top == "center" ) ? " active btn-danger" : " btn-default" )+' btn'+( ( position == "static" ) ? " disabled" : "" )+'" data-left="left" data-top="center" role="button">&nbsp</div>\
                                    <div class="'+( ( left == "center" && top == "center" ) ? " active btn-danger" : " btn-default" )+' btn'+( ( position == "static" ) ? " disabled" : "" )+'" data-left="center" data-top="center" role="button">&nbsp</div>\
                                    <div class="'+( ( left == "right"  && top == "center" ) ? " active btn-danger" : " btn-default" )+' btn'+( ( position == "static" ) ? " disabled" : "" )+'" data-left="right" data-top="center" role="button">&nbsp</div>\
                                </div>\
                                <div class="btn-group btn-group-justified" role="group">\
                                    <div class="'+( ( left == "left"   && top == "bottom" ) ? " active btn-danger" : " btn-default" )+' btn'+( ( position == "static" ) ? " disabled" : "" )+'" data-left="left" data-top="bottom" role="button">&nbsp</div>\
                                    <div class="'+( ( left == "center" && top == "bottom" ) ? " active btn-danger" : " btn-default" )+' btn'+( ( position == "static" ) ? " disabled" : "" )+'" data-left="center" data-top="bottom" role="button">&nbsp</div>\
                                    <div class="'+( ( left == "right"  && top == "bottom" ) ? " active btn-danger" : " btn-default" )+' btn'+( ( position == "static" ) ? " disabled" : "" )+'" data-left="right" data-top="bottom" role="button">&nbsp</div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="row row-name-px-percent">\
                        <div class="col-xs-6 sm-deviation-col-left">\
                            <p>px</p>\
                        </div>\
                        <div class="col-xs-6 sm-deviation-col-right">\
                            <p>%</p>\
                        </div>\
                    </div>\
                    <div class="row row-otklonenie-1">\
                        <div class="col-xs-6 sm-deviation-col-left">\
                            <div class="input-group">\
                                <input type="text" class="form-control input-sm sm-deviation-input sm-deviation-left-px" value="'+ l_px +'">\
                                <div class="input-group-addon"><span class="fa fa-long-arrow-right"></span></div>\
                            </div>\
                        </div>\
                        <div class="col-xs-6 sm-deviation-col-right">\
                            <div class="input-group">\
                                <input type="text" class="form-control input-sm sm-deviation-input sm-deviation-left-percent" value="'+ l_per +'">\
                                <div class="input-group-addon"><span class="fa fa-long-arrow-right"></span></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="row row-otklonenie-2">\
                        <div class="col-xs-6 sm-deviation-col-left">\
                            <div class="input-group">\
                                <input type="text" class="form-control input-sm sm-deviation-input sm-deviation-top-px" value="'+ t_px +'">\
                                <div class="input-group-addon">&nbsp<span class="fa fa-long-arrow-down"></span>&nbsp</div>\
                            </div>\
                        </div>\
                        <div class="col-xs-6 sm-deviation-col-right">\
                            <div class="input-group">\
                                <input type="text" class="form-control input-sm sm-deviation-input sm-deviation-top-percent" value="'+ t_per +'">\
                                <div class="input-group-addon">&nbsp<span class="fa fa-long-arrow-down"></span>&nbsp</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>';
            
            return result;
        }
    
    this.removeListScrins = function() {
        $container.find( " .sm-container" ).empty();
    }
    
    this.refreshUiSortableAndSpinner = function() {
        $container.find( " .sm-container" ).sortable({
            revert: true,
            update: function(event, ui){
                
            },
            cursor: 'move',
            axis: 'y',
            items: ' > .sm-media',
            distance: 5,
            placeholder: {
                element: function(currentItem) {
                    return $('<div class="sm-placeholder-media"></div>').height( currentItem.outerHeight() );
                },
                update: function(container, p) {
                    return;
                }
            },
            stop: function(){
                $container.trigger("sm.change");
            }
        });
        
        $container.find( " .sm-container .sm-media" ).sortable({
            revert: true,
            cursor: 'move',
            axis: 'y',
            items: ' > .sm-scrin',
            distance: 5,
            connectWith: " .sm-container .sm-media, .sm-container .sm-all-scrins",
            placeholder: {
                element: function(currentItem) {
                    return $('<div class="panel panel-default sm-placeholder-scrin"></div>').height( currentItem.outerHeight() );
                },
                update: function(container, p) {
                    return;
                }
            },
            remove: function(event, ui){//"update" заменил на "remove"
                if( ui.item.closest( ".sm-all-scrins" ).size() ) {
                    ui.item.remove();
                }
            },
            stop: function(){
                $container.trigger("sm.change");
            }
        });
        
        $container.find( " .sm-container .sm-all-scrins" ).sortable({
            revert: true,
            cursor: 'move',
            axis: 'y',
            items: ' > .sm-scrin',
            distance: 5,
            connectWith: " .sm-container .sm-media",
            placeholder: {
                element: function(currentItem) {
                    return $('<div class="panel panel-default sm-placeholder-scrin"></div>').height( currentItem.outerHeight() );
                },
                update: function(container, p) {
                    return;
                }
            },
            remove: function(event, ui){//"update" заменил на "remove"
                var $clone = ui.item.clone();
                $clone.insertAfter(ui.item);
                
                $clone.find( " .floatr-fix" ).prepend( ____.createDeviation( "static", "center", "top", 0, 0, 0, 0 ) );
                ____.refreshSpinner();
                $(this).sortable('cancel');
            },
            stop: function(){
                $container.trigger("sm.change");
            }
        });
        
        ____.refreshSpinner();
        
        
    }
        //Обновить спиннер
        this.refreshSpinner = function() {
            var currentMediaActive = false;
            
            $container.find( " .sm-deviation-input" ).spinner({
                min: -99999,
                max: 99999,
                start: function(){
                    currentMediaActive = $(this).closest( ".sm-media" ).hasClass( "active" );
                    
                    if( currentMediaActive ) {
                        $container.trigger("sm.changeoffsetstart", [$(this)]);
                    }
                },
                spin: function(){
                    if( currentMediaActive ) {
                        $container.trigger("sm.changeoffset");
                    }
                },
                stop: function(){
                    $container.trigger("sm.change");
                }
            });
        }
        
    this._restoreSession = function( $session ) {
        if( $session.find( "screenshots_manipulator" ).text() == "show" ) {
            ____.fastShow( $session );
        } else if( $session.find( "screenshots_manipulator" ).text() == "hidden" ) {
            ____.hide( $session );
        }
    }
    
    this._setSession = function( $session, $listAllScrins, currentPage ) {
        var $page = $session.find( " page[href='" + currentPage + "']" );
        
        if( $page.size() == 0 ) {
            $session.find( " wrap" ).append( '<page href="' + currentPage + '"></page>' );
            $page = $session.find( " page[href='" + currentPage + "']" );
        } else {
            $page.empty();
        }
        
        //console.time('_setSession');
        var result = "";
        $container.find( " .sm-container .sm-media" ).each(function(){
            result += '<media width="'+ $(this).attr( "data-width" ) +'" height="'+ $(this).attr( "data-height" ) +'" active="'+ $(this).hasClass( "active" ) +'">';
            $(this).find( " .sm-scrin" ).each(function(){
                var position = ( $(this).find(' .sm-deviation-fixed-or-static input:checked').val() == 1 ) ? "static" : "fixed";
                var $relative = $(this).find(' .sm-deviation-relative .btn.active');
                var left = $relative.attr( "data-left" );
                var top = $relative.attr( "data-top" );
                var l_px =  $(this).find(' .sm-deviation-left-px').val();
                var l_per = $(this).find(' .sm-deviation-left-percent').val();
                var t_px =  $(this).find(' .sm-deviation-top-px').val();
                var t_per = $(this).find(' .sm-deviation-top-percent').val();
                
                result += '<scrin src="'+ $(this).attr( "data-src" ) +'" active="'+ $(this).hasClass( "active" ) +'" deviation="'+ position +'|'+ left +'|'+ top +'|'+ l_px +'|'+ l_per +'|'+ t_px +'|'+ t_per +'"></scrin>';
            });
            result += '</media>';
        });
        
        $page.append( $( result ) );
        //console.timeEnd('_setSession');
    }
}
    
    
    
    
    
    
    
    

    modules.screenshotsManipulator = screenshotsManipulator;
    
})(jQuery);