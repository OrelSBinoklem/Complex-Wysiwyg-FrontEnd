(function($){//Модули: 

var defaultOptions = {
    nameIFrame: "",
    minWIFrame: 320,
    minHIFrame: 480
};

var resizeIFrame = function($container, options) {
    this._options = options;
    var ____ = this;

    ____._last_cursor_Y = 0;
    ____._last_cursor_X = 0;

    this._create = function()
    {
        var $iFrame = $("#"+(____._options.nameIFrame)).contents();
        
        $container.append('<div class="rif-show-dimensions panel panel-primary"><div class="panel-body"><span class="rif-width btn btn-default btn-lg">0</span> X <span class="rif-height btn btn-default btn-lg">0</span></div></div>');
        
        //Свойства для навигатора
        ____._resize = false;
        ____._cursor_Y = 0;
        ____._cursor_X = 0;
        
        //Установка обработчиков событий
        $iFrame.find('body').on('mousemove', ____._handlerMove);
        $('body').on('mousemove', ____._handlerMove);
        $('body').on('keydown', ____._handlerDown);
        $iFrame.find('body').on('keydown', ____._handlerDown);
        $('body').on('keyup', ____._handlerUp);
        $iFrame.find('body').on('keyup', ____._handlerUp);
        
        $(window).on('resize', ____._handlerResize);
        $(window[____._options.nameIFrame].window).on('resize', ____._handlerResize);
        
    }
    
    this._destroy = function() {
        var $iFrame = $("#"+(____._options.nameIFrame)).contents();
        
        $container.find(" .rif-show-dimensions").remove();
        
        $iFrame.find('body').off('mousemove', ____._handlerMove);
        $('body').off('mousemove', ____._handlerMove);
        $('body').off('keydown', ____._handlerDown);
        $iFrame.find('body').off('keydown', ____._handlerDown);
        $('body').off('keyup', ____._handlerUp);
        $iFrame.find('body').off('keyup', ____._handlerUp);
        
        $(window).off('resize', ____._handlerResize);
        $(window[____._options.nameIFrame].window).off('resize', ____._handlerResize);
    }
    
    this.reload = function() {
        ____._destroy();
        ____._create();
    }
    
    //Нажатие на комбинацию клавиш
    this._handlerDown = function(e) {
        if(e.which == 82 && e.ctrlKey && !e.shiftKey && !e.altKey)
        {
            if(!____._resize) {
                $container.trigger("rifStartResize");
                //Фиксация в пикселах (чтоб меньше багов при расчётах было) и центрирование
                var $rif = $container.find(" .rif-show-dimensions");
                $rif
                .attr("style", "")
                .css({display: "block"});
                var w = $rif.outerWidth();
                var h = $rif.outerHeight();
                var w_c = $container.find(".pmv-outer-wrap").width();
                var h_c = $container.find(".pmv-outer-wrap").height();
                
                $rif.css({
                    width: Math.round( w ),
                    height: Math.round( h ),
                    top: Math.round( (h_c - h) / 2 ),
                    left: Math.round( (w_c - w) / 2 ),
                });
                
                ____._resize = true;
                ____._cursor_X = false;
                ____._cursor_Y = false;
                
                ____._reloadShowDimensions();
            }
                
            if(e.preventDefault){ e.preventDefault()} else{e.stop()};e.returnValue = false;e.stopPropagation();return false;
        }
    }
    
    //Отпускание клавиш
    this._handlerUp = function(e) {
        if( ____._resize ) {
            var $mnif = $container.find(" .rif-show-dimensions");
            $mnif.css({display: "none"});
            
            ____._resize = false;
            
            $container.trigger("rifStopResize");
        }
    }
    
    this._handlerResize = function() {
        ____._centerIFrameAndNoEmptySpace();
        ____._reloadShowDimensions();
    }
    
    //Центрирование iFrame при ресайзе если он меньше контейнера, а также если рамер iFrame больше чем размер контенера то правый край лепим к правому и нижний к нижнему чтобы небыло пустого пространства
    //нужно для нормальной работы "map-navigator-iframe"
    this._centerIFrameAndNoEmptySpace = function() {
        var $iframe = $("#"+(____._options.nameIFrame));
        var $fittingWrap = $iframe.closest(".pmv-fitting-wrap");
        var $outerWrap = $iframe.closest(".pmv-outer-wrap");
        var w, h, w_c, t, l, h_c;
        
        w =   $fittingWrap.width();
        h =   $fittingWrap.height();
        t =   $fittingWrap.position().top;
        l =   $fittingWrap.position().left;
        w_c = $outerWrap.width();
        h_c = $outerWrap.height();
        
        if( w > w_c ) {
            if( (l + w) <  w_c ) {
                $fittingWrap.css({left: Math.round( - w + w_c )});
            }
            //fix
            if( l > 0 ) {
                $fittingWrap.css({left: Math.round( 0 )});
            }
        } else {
            $fittingWrap.css({left: Math.round( (w_c - w) / 2 )});
        }
        
        if( h > h_c ) {
            if( (t + h) <  h_c ) {
                $fittingWrap.css({top: Math.round( - h + h_c )});
            }
        } else {
            $fittingWrap.css({top: 0});
        }

        $container.trigger("rif.center-iframe");
    }
    
    //Обновление показывателя текущих размеров
    this._reloadShowDimensions = function() {
        var $fittingWrap = $("#"+(____._options.nameIFrame)).closest(".pmv-fitting-wrap");
        var w =   $fittingWrap.width();
        var h =   $fittingWrap.height();
        
        $container.find(" .rif-width").text( Math.round( w ) );
        $container.find(" .rif-height").text( Math.round( h ) );
    }
    
    //Обновление размеров IFrame
    this._handlerMove = function(e) {
        ____._last_cursor_X = e.screenX;
        ____._last_cursor_Y = e.screenY;
        
        if( ____._resize )
        {
            if(____._cursor_Y === false) {
                ____._cursor_X = ____._last_cursor_X;
                ____._cursor_Y = ____._last_cursor_Y;
            }
            
            var $iframe = $("#"+(____._options.nameIFrame));
            var $fittingWrap = $iframe.closest(".pmv-fitting-wrap");
            
            var w =   $fittingWrap.width();
            var h =   $fittingWrap.height();
            
            w += e.screenX - ____._cursor_X;
            h += e.screenY - ____._cursor_Y;
            
            ____._cursor_X = e.screenX;
            ____._cursor_Y = e.screenY;
            
            if(w < ____._options.minWIFrame) {w = ____._options.minWIFrame}
            if(h < ____._options.minHIFrame) {h = ____._options.minHIFrame}
            
            $fittingWrap.css({
                width: Math.round( w ),
                height: Math.round( h ),
                maxHeight: ""
            });

            $container.trigger("rifResize");
        }
    }
}















modules.resizeIFrame = resizeIFrame;
    
})(jQuery);