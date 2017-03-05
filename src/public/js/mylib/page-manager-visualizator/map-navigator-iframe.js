(function($){//Модули: 

var defaultOptions = {
    nameIFrame: "",
    minWDraggable: 15,
    minHDraggable: 15,
    responsiveToMovementOfTheCursorInAConfinedSpace: false//при активации реагировать на движение в определённой области при движеннии в которой навигатор может отобразить все части вёрстки. Если отключить то при выходе из области она начнет следовать за курсором и остановиться если он сменит направление и будет реагировать
    //доделать спред(чтоб запоминалось например на 5 пикселей)
};

var mapNavigatorIFrame = function($container, options) {
    this._options = options;
    var ____ = this;

    ____._last_cursor_Y = 0;
    ____._last_cursor_X = 0;

    this._create = function()
    {
        var $iFrame = $("#"+(____._options.nameIFrame)).contents();
        
        $container.append('<div class="mnif-show-space panel panel-primary"><div class="mnif-draggable panel-body"></div></div>');
        
        //Свойства для навигатора
        ____._draggable = false;
        ____._cursor_Y = 0;
        ____._cursor_X = 0;
        ____._draggableTopTemp = 0;
        ____._draggableLeftTemp = 0;
        
        //Установка обработчиков событий
        $iFrame.find('body').on('mousemove', ____._handlerMove);
        $('body').on('mousemove', ____._handlerMove);
        $('body').on('keydown', ____._handlerDown);
        $iFrame.find('body').on('keydown', ____._handlerDown);
        $('body').on('keyup', ____._handlerUp);
        $iFrame.find('body').on('keyup', ____._handlerUp);
    }
    
    this._destroy = function()
    {
        $container.find(" .mnif-show-space").remove();
        
        var $iFrame = $("#"+(____._options.nameIFrame)).contents();
        
        $iFrame.find('body').off('mousemove', ____._handlerMove);
        $('body').off('mousemove', ____._handlerMove);
        $('body').off('keydown', ____._handlerDown);
        $iFrame.find('body').off('keydown', ____._handlerDown);
        $('body').off('keyup', ____._handlerUp);
        $iFrame.find('body').off('keyup', ____._handlerUp);
    }
    
    this.reload = function()
    {
        ____._destroy();
        ____._create();
    }
    
    //Нажатие на комбинацию клавиш
    this._handlerDown = function(e)
    {
        if(e.which == 69 && e.ctrlKey && !e.shiftKey && !e.altKey)
        {
            if( !____._draggable ) {
                //Фиксация в пикселах (чтоб меньше багов при расчётах было) и центрирование
                var $mnif = $container.find(" .mnif-show-space");
                $mnif
                .attr("style", "")
                .css({display: "block"});
                var w = $mnif.outerWidth();
                var h = $mnif.outerHeight();
                var w_c = $container.find(".pmv-outer-wrap").width();
                var h_c = $container.find(".pmv-outer-wrap").height();
                
                $mnif.css({
                    width: Math.round( w ),
                    height: Math.round( h ),
                    top: Math.round( (h_c - h) / 2 ),
                    left: Math.round( (w_c - w) / 2 ),
                });
                
                ____._draggable = true;
                ____._cursor_X = false;
                ____._cursor_Y = false;
                ____._draggableTopTemp = $container.find(".pmv-fitting-wrap").position().top;
                ____._draggableLeftTemp = $container.find(".pmv-fitting-wrap").position().left;
                
                ____.updateDraggable();
            }
                
            
            if(e.preventDefault){ e.preventDefault()}
  		    else{e.stop()};
    		e.returnValue = false;
    		e.stopPropagation();
            return false;
        }
    }
    
    //Отпускание клавиш
    this._handlerUp = function(e)
    {
        if( ____._draggable ) {
            var $mnif = $container.find(" .mnif-show-space");
            $mnif.css({display: "none"});
            ____._draggable = false;
        }
    }
    
    //Обновление карты
    this.updateDraggable = function()
    {
        var $iframe = $("#"+(____._options.nameIFrame));
        var $fittingWrap = $iframe.closest(".pmv-fitting-wrap");
        var $outerWrap = $iframe.closest(".pmv-outer-wrap");
        var $mnif = $container.find(" .mnif-show-space");
        var w, h, w_c, t, l, h_c,
        wDrag, hDrag, tDrag, lDrag, wDrag_c, hDrag_c;
        
        w =   $fittingWrap.width();
        h =   $fittingWrap.height();
        t =   $fittingWrap.position().top;
        l =   $fittingWrap.position().left;
        w_c = $outerWrap.width();
        h_c = $outerWrap.height();
        
        wDrag_c = $mnif.width();
        hDrag_c = $mnif.height();
        
        hDrag = h_c / h * hDrag_c;
        if(hDrag < ____._options.minHDraggable) {hDrag = ____._options.minHDraggable;}
        if(hDrag > hDrag_c) {hDrag = hDrag_c;}
        tDrag = t / - (h - h_c) * (hDrag_c - hDrag);
        
        wDrag = w_c / w * wDrag_c;
        if(wDrag < ____._options.minWDraggable){wDrag = ____._options.minWDraggable;}
        if(wDrag > wDrag_c) {wDrag = wDrag_c;}
        lDrag = l / - (w - w_c) * (wDrag_c - wDrag);
        
        $mnif.find( ".mnif-draggable" ).css({
            width: Math.round( wDrag ),
            height: Math.round( hDrag ),
            top: Math.round( tDrag ),
            left: Math.round( lDrag ),
        });
    }
    
    //Обновление скрытого скролла в IFrame
    this._handlerMove = function(e)
    {
        ____._last_cursor_X = e.screenX;
        ____._last_cursor_Y = e.screenY;
        
        if( ____._draggable )
        {
            if(____._cursor_Y === false) {
                ____._cursor_X = ____._last_cursor_X;
                ____._cursor_Y = ____._last_cursor_Y;
            }
            
            var $iframe = $("#"+(____._options.nameIFrame));
            var $fittingWrap = $iframe.closest(".pmv-fitting-wrap");
            var $outerWrap = $iframe.closest(".pmv-outer-wrap");
            var $mnif = $container.find(" .mnif-show-space");
            var w, h, w_c, h_c, t, l,
            wDrag, hDrag, tDrag, lDrag, wDrag_c, hDrag_c,
            stepVertical, stepGorizontal,
            resTop, resLeft;
            
            w =   $fittingWrap.width();
            h =   $fittingWrap.height();
            t =   $fittingWrap.position().top;
            l =   $fittingWrap.position().left;
            w_c = $outerWrap.width();
            h_c = $outerWrap.height();
            
            wDrag_c = $mnif.width();
            hDrag_c = $mnif.height();
            
            //Вычисляем размеры элементов "за которые можно прокручивать" на внешнем скролле и отступы для смешения чтоб показать насколько прокручена страница
            hDrag = h_c / h * hDrag_c;
            if(hDrag < ____._options.minHDraggable) {hDrag = ____._options.minHDraggable;}
            
            wDrag = w_c / w * wDrag_c;
            if(wDrag < ____._options.minWDraggable){wDrag = ____._options.minWDraggable;}
            
            //Количество пикселей при перемещении курсора на 1 пиксель
            stepVertical = - (h - h_c) / (hDrag_c - hDrag);
            stepGorizontal = - (w - w_c) / (wDrag_c - wDrag);
            
            if(h > h_c) {
                resTop = (e.screenY - ____._cursor_Y) * stepVertical + ____._draggableTopTemp;
                if( resTop > 0 ) {
                    resTop = 0;
                    if(!____._options.responsiveToMovementOfTheCursorInAConfinedSpace) {
                        ____._cursor_Y = e.screenY; ____._draggableTopTemp = t;
                    } 
                }
                if( resTop < - (h - h_c) ) {
                    resTop = - (h - h_c);
                    if(!____._options.responsiveToMovementOfTheCursorInAConfinedSpace) {
                        ____._cursor_Y = e.screenY; ____._draggableTopTemp = t;
                    } 
                }
                
                $fittingWrap.css({top: Math.round( resTop )});
            }
            
            if(w > w_c) {
                resLeft = (e.screenX - ____._cursor_X) * stepGorizontal + ____._draggableLeftTemp;
                if( resLeft > 0 ) {
                    resLeft = 0;
                    if(!____._options.responsiveToMovementOfTheCursorInAConfinedSpace) {
                        ____._cursor_X = e.screenX; ____._draggableLeftTemp = l;
                    }                    
                }
                if( resLeft < - (w - w_c) ) {
                    resLeft = - (w - w_c);
                    if(!____._options.responsiveToMovementOfTheCursorInAConfinedSpace) {
                        ____._cursor_X = e.screenX; ____._draggableLeftTemp = l;
                                            
                    } 
                }
    			
                $fittingWrap.css({left: Math.round( resLeft )});
            }
            
            ____.updateDraggable();
        }
    }
}















modules.mapNavigatorIFrame = mapNavigatorIFrame;
    
})(jQuery);