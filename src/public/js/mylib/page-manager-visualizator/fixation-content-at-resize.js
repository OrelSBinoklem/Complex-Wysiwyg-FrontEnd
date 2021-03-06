//==============================================
//"ИНТЕЛЛЕКТУАЛЬНЫЙ РЕСАЙЗ IFRAME"
//При тестировании вёрстки
//при разных разрешениях часто бывает так
//что при изменении ширины экрана
//нужный вам блок за которым вы наблюдаете
//уходит вверх либо вниз, так вот этот метод 
//фиксирует на ближайшем к центру или
//к верху и центру по горизонтали
//экрана элементу с помощью компенсации скролла
//(уедет вниз на 10px то и скрол прокрутиться
//на 10px вниз...)
//==============================================
(function($){//Модули: 

var defaultOptions = {
    //active: true,
    gorizontalFixation: "center",//left center right
    verticalFixation: "top",//top center bottom
    stopAllAnimationsAtResize: true
};

var fixationContentAtResize = function($container, options) {
    this._options = options;
    var ____ = this;
    
    this._create = function() {
        //Свойства для фиксатора
        ____.activeFixation = false;
        ____.$itemFixation = undefined;
        ____.itemFixationY = undefined;
        
        //Установка обработчиков событий
        $(window[____._options.nameIFrame].window).on('resize', ____._handlerResize);
    }
    
    this._destroy = function() {
        $(window[____._options.nameIFrame].window).off('resize', ____._handlerResize);
    }
    
    this.reload = function() {
        ____._destroy();
        ____._create();
    }
    
    this.startFixation = function() {
        if(window[____._options.nameIFrame] !== undefined) {
            ____.activeFixation = true;
            ____.$itemFixation = undefined;

            var $iFrameBody = $("#"+(____._options.nameIFrame)).contents().find('body');
            var xEl, yEl,
                scrollTop, scrollLeft, wWin, hWin, winY, winX;

            //Ищем ближайший по заданым параметрам элемент в видимой части документа (если ненаходим элементов в видимой части экрана то ничё неделаем)
            wWin = $(window[____._options.nameIFrame].window).width();
            hWin = $(window[____._options.nameIFrame].window).height();

            scrollTop = $(window[____._options.nameIFrame].window).scrollTop();
            scrollLeft = $(window[____._options.nameIFrame].window).scrollLeft();

            switch( ____._options.gorizontalFixation ) {
                case "left": winX = 0; break;
                case "center": winX = wWin / 2; break;
                case "right": winX = wWin; break;
            }

            switch( ____._options.verticalFixation ) {
                case "top": winY = 0; break;
                case "center": winY = hWin / 2; break;
                case "bottom": winY = hWin; break;
            }

            var AllEl = new Array();
            var AllDistance = new Array();
            var AllYEl = new Array();

            //Элементы должны быть нетолько видимыми но и неиметь position fixed а так же не один из их родителей
            $iFrameBody.find(' *:visible').each(function(){
                if($(this).css("position").toLowerCase() == "fixed") {
                    $(this).attr("data-this-el-position-fixed", "this-el-position-fixed");
                }
            });
            $iFrameBody.find(' *:visible')
                .not($iFrameBody.find(' [data-this-el-position-fixed="this-el-position-fixed"] *'))
                .not($iFrameBody.find(' [data-this-el-position-fixed="this-el-position-fixed"]'))
                .each(function(){

                    var offset = $(this).offset();
                    var tEl = Math.round( offset.top );
                    var lEl = Math.round( offset.left );
                    var wEl = Math.round( $(this).outerWidth() );
                    var hEl = Math.round( $(this).outerHeight() );


                    switch( ____._options.gorizontalFixation ) {
                        case "left": xEl = lEl - scrollLeft; break;
                        case "center": xEl = lEl - scrollLeft + (wEl / 2); break;
                        case "right": xEl = lEl - scrollLeft + wEl; break;
                    }
                    xEl = Math.round( xEl );

                    switch( ____._options.verticalFixation ) {
                        case "top": yEl = tEl - scrollTop; break;
                        case "center": yEl = tEl - scrollTop + (hEl / 2); break;
                        case "bottom": yEl = tEl - scrollTop + hEl; break;
                    }
                    yEl = Math.round( yEl );

                    if( xEl + wEl >= 0 && xEl <= wWin && yEl + hEl >= 0 && yEl <= hWin ) {
                        AllEl.push( $(this) );
                        AllDistance.push( Math.sqrt(Math.pow(winX - xEl, 2) + Math.pow(winY - yEl, 2)) );
                        AllYEl.push( yEl );
                    }
                });

            if(AllEl.length) {
                var min, minKey;
                min = AllDistance[0];
                minKey = 0;

                for(var key in AllEl) {
                    if(AllDistance[key] < min) {
                        min = AllDistance[key];
                        minKey = key;
                    }
                }

                ____.$itemFixation = AllEl[minKey];
                ____.itemFixationY = AllYEl[minKey];

                /*____.$itemFixation.css({
                     outline: "5px solid red",
                     outlineOffset: "-2px"
                 });*/

                if(____._options.stopAllAnimationsAtResize) {
                    var $iFrameHead = $("#"+(____._options.nameIFrame)).contents().find('head');

                    $iFrameHead.append('<style type="text/css" class="fixation-content-at-resize-stop-all-animations"></style>');
                    $iFrameHead.find(" .fixation-content-at-resize-stop-all-animations").html('body, body *{transition-duration: 0s !important;}');
                }
            }
        }
    }
    
    this.stopFixation = function() {
        ____.activeFixation = false;

        var $iFrameBody = $("#"+(____._options.nameIFrame)).contents().find('body');
        $iFrameBody.find(' *').removeAttr("data-this-el-position-fixed");

        if(____._options.stopAllAnimationsAtResize) {
            var $iFrameHead = $("#"+(____._options.nameIFrame)).contents().find('head');
            $iFrameHead.find(" .fixation-content-at-resize-stop-all-animations").remove();
        }
    }
    
    this._handlerResize = function() {
        if( ____.activeFixation && (____.$itemFixation !== undefined) ) {
            var scrollTop = $(window[____._options.nameIFrame].window).scrollTop();
             
            var offset = ____.$itemFixation.offset();
            var tEl = offset.top;
            var hEl = ____.$itemFixation.outerHeight();

            var yEl = null;
            
            switch( ____._options.verticalFixation ) {
                case "top":
                  yEl = tEl - scrollTop; 
                  break;
                case "center": 
                  yEl = tEl - scrollTop + (hEl / 2);
                  break;
                case "bottom":
                  yEl = tEl - scrollTop + hEl;
                  break;
            }

            $(window[____._options.nameIFrame].window).scrollTop( Math.round( scrollTop + yEl - ____.itemFixationY ) );

            $container.trigger("fcar.scroll");
        }
    }
}

modules.fixationContentAtResize = fixationContentAtResize;
    
})(jQuery);