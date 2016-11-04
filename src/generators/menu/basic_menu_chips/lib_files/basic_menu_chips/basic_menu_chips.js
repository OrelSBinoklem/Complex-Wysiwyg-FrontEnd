//Фикс работы find
(function($){
jQuery.fn.multiFind = function(selector){
    
    if(typeof selector == "string")
    {
        var selectors = selector.split(',');
        var $result;
        
        for(var key in selectors)
        {
            var one__selector = selectors[key];
            if(key == 0)
            {
                $result = this.find( " "+one__selector );
            }
            else
            {
                $result.add( this.find( " "+one__selector ) );
            }
        }
        
        return $result;
    }
    else
    {
        return this;
    }
}
})(jQuery);

(function($){
jQuery.fn.basicMenuChips = function(options){
    var responsiveOptions = $.extend({
        fullWidth: false,
        fixed: false,
        scrollTarget: true,
        activeFromTarget: true,
        slider: false,
        
        menuWrap: "div", //Селектор для метода "closest" если первым элементом будет само меню то сработает метод parent( "*" )
        menuItems: " li:not(li li)",
        selectWidthMenuItems: " li:not(li li)",
        menuItemsAndSubMenu: " li",
        widthFactor: 1,
        
        duration: 1000,
        easing: "swing",
        accountingMenuHeight: true, //число пикселей или функция
        deleteClassActiveNoFocusTargetsBlock: false,
        vertical: false
    }, options);
    
    //Базовый класс
    var BMC = function(containers){
        this.containers = containers;
        this.responsiveOptions = responsiveOptions;
        this.renderedOptions = {};
        var ____ = this;
        var options = this.renderedOptions;
        var crossModule = {
            animatingScroll: false
        };
        
        this.create = function()
        {
            var r = ____.renderedOptions;
            
            r.fullWidth = false;
            r.fixed = false;
            r.scrollTarget = false;
            r.activeFromTarget = false;
            r.slider = false;
            
            _renderNewResponsiveOptions();
            $(window).on( "resize", _renderNewResponsiveOptions);
        }
        
        this.destroy = function()
        {
            $(window).off( "resize", _renderNewResponsiveOptions);
            ____.setFullWidth(false);
            ____.setFixed(false);
            ____.setScrollTarget(false);
            ____.setActiveFromTarget(false);
            ____.setSlider(false);
        }
        
        this.setOption = function(o)
        {
            $.extend( true , ____.responsiveOptions , o );
            
            _renderNewResponsiveOptions();
        }
        
        var _renderNewResponsiveOptions = function()
        {
            var o = getOptionFromResponsiveOption();
            var r = ____.renderedOptions;
            
            var u = {FW: false, F: false, ST: false, AFT: false, S: false};

            if(r.menuWrap !== o.menuWrap)                                                {r.menuWrap = o.menuWrap;   u.FW = true; u.F = true; u.ST = true; u.AFT = true; u.S = true;}
            if(r.menuItems !== o.menuItems)                                            {r.menuItems = o.menuItems;   u.FW = true; u.F = true; u.ST = true; u.AFT = true; u.S = true;}
            if(r.selectWidthMenuItems !== o.selectWidthMenuItems){r.selectWidthMenuItems = o.selectWidthMenuItems;   u.FW = true;}
            if(r.menuItemsAndSubMenu !== o.menuItemsAndSubMenu)    {r.menuItemsAndSubMenu = o.menuItemsAndSubMenu;                                         u.AFT = true; u.S = true;}
            if(r.widthFactor !== o.widthFactor)                                    {r.widthFactor = o.widthFactor;   u.FW = true;}
            if(r.duration !== o.duration)                                                {r.duration = o.duration;                            u.ST = true;}
            if(r.easing !== o.easing)                                                        {r.easing = o.easing;                            u.ST = true;}
            if(r.accountingMenuHeight !== o.accountingMenuHeight){r.accountingMenuHeight = o.accountingMenuHeight;                            u.ST = true; u.AFT = true; u.S = true;}
            if(r.deleteClassActiveNoFocusTargetsBlock !== o.deleteClassActiveNoFocusTargetsBlock)
                                 {r.deleteClassActiveNoFocusTargetsBlock = o.deleteClassActiveNoFocusTargetsBlock;                                         u.AFT = true;}
            if(r.vertical !== o.vertical)    {r.vertical = o.vertical;                                                                                                   u.S = true;}
            
            if(u.FW)  {____.setFullWidth(false)}
            if(u.F)   {____.setFixed(false)}
            if(u.ST)  {____.setScrollTarget(false)}
            if(u.AFT) {____.setActiveFromTarget(false)}
            if(u.S)   {____.setSlider(false)}
            
            ____.setFullWidth(o.fullWidth);
            ____.setFixed(o.fixed);
            ____.setScrollTarget(o.scrollTarget);
            ____.setActiveFromTarget(o.activeFromTarget);
            ____.setSlider(o.slider);
        }
        
        /*****************************************************************/
        /*МОДУЛЬ МЕНЮ НА ВСЮ ШИРИНУ С ОДНАКОВЫМИ ОТСТУПАМИ СЛЕВА И СПРАВА*/
        /*****************************************************************/
        
        this.setFullWidth = function(fullWidth)
        {
            if(fullWidth !== options.fullWidth)
            {
                options.fullWidth = fullWidth;
                if(fullWidth)
                {
                    activateFullWidth();
                }
                else
                {
                    deactivateFullWidth();
                }
            }
        }
        
        var activateFullWidth = function()
        {
            renderedFullWidth();
            $(window).on( "resize", reloadFullWidth);
        }
        
        var renderedFullWidth = function()
        {
            ____.containers.each(function(){
                var $items, $select__items,
                countAll, summAll, containerWidth,
                select__countAll, select__summAll,
                widthFactor, extraPixels, extraPixels__oneItem, residualPixels;
                
                //Получаем основные данные и фиксируем ширину в элементах ПОТОМУ ЧТО ПО НОРМАЛЬНОМУ НЕЛЬЗЯ ПОЛУЧИТЬ НАСТОЯЩУЮ ШИРИНУ СУКА
                $items = $(this).multiFind( options.menuItems );
                $select__items = $(this).multiFind( options.selectWidthMenuItems );
                
                countAll = $items.size();
                summAll = 0;
                $items.each(function(){
                    var punkt = $(this);
                    
                    punkt.css({
                        marginLeft: Math.round(punkt.css( "margin-left" )),
                        marginRight: Math.round(punkt.css( "margin-right" )),
                        
                        paddingLeft: Math.round(punkt.css( "padding-left" )),
                        paddingRight: Math.round(punkt.css( "padding-right" )),
                        
                        borderLeftWidth: Math.round(punkt.css( "border-left-width" )),
                        borderRightWidth: Math.round(punkt.css( "border-right-width" ))
                    });
                    punkt.outerWidth(Math.ceil(punkt.outerWidth()));
                    
                    summAll += punkt.outerWidth(true);
                });
                containerWidth = $(this).width();
                
                select__countAll = $select__items.size();
                /*$select__items.each(function(){
                    select__summAll += $(this).outerWidth(true);
                });*/
                
                //Если множитель ширины недостаточен то делаем его таковым
                widthFactor = Math.ceil( summAll / Math.floor( containerWidth ) );
                if(options.widthFactor > widthFactor)
                {
                    widthFactor = options.widthFactor;
                }
                
                //Получаем пикселы которые надо добавить пунктам
                extraPixels = Math.floor( containerWidth ) * widthFactor - summAll;
                extraPixels__oneItem = Math.floor(extraPixels / select__countAll);
                residualPixels = extraPixels - extraPixels__oneItem * select__countAll;
                
                //Добавляем пикселы
                $select__items.each(function(){
                    if(residualPixels > 0)
                    {
                        $(this).outerWidth($(this).outerWidth() + extraPixels__oneItem + 1);
                        residualPixels--;
                    }
                    else
                    {
                        $(this).outerWidth($(this).outerWidth() + extraPixels__oneItem);
                    }
                });  
            });
        }
        
        var reloadFullWidth = function()
        {
            //console.time('reloadFullWidth');
            clearFullWidth();
            renderedFullWidth();
            //console.timeEnd('reloadFullWidth');
        }
        
        var deactivateFullWidth = function()
        {
            clearFullWidth();
            
            $(window).off( "resize", reloadFullWidth);
        }
        
        var clearFullWidth = function()
        {
            ____.containers.each(function(){
                
                var $items = $(this).multiFind( options.menuItems );
                
                $items.each(function(){
                    var clearStyle = $(this).attr( "style" );
                    
                    clearStyle = clearStyle
                        .replace( /margin-left:[^;]*;/gim , " " )
                        .replace( /margin-right:[^;]*;/gim , " " )
                        .replace( /padding-left:[^;]*;/gim , " " )
                        .replace( /padding-right:[^;]*;/gim , " " )
                        .replace( /border-left-width:[^;]*;/gim , " " )
                        .replace( /border-right-width:[^;]*;/gim , " " )
                        .replace( /width:[^;]*;/gim , " " )
                        
                        .replace( /\s+/gim , " " );
                    
                    $(this).attr( "style" , clearStyle );
                });
            });
        }
        
        /**************************************************/
        /*МОДУЛЬ ФИКСАТОРА МЕНЮ*/
        /**************************************************/
        
        this.setFixed = function(fixed)
        {
            if(fixed !== options.fixed)
            {
                options.fixed = fixed;
                if(fixed)
                {
                    activateFixed();
                }
                else
                {
                    deactivateFixed();
                }
            }
        }
        
        var activateFixed = function()
        {
            reloadFixed();            
            $( window ).on( "resize scroll", reloadFixed );
        }
        
        var reloadFixed = function()
        {
            //console.time('reloadFixed');
            ____.containers.each(function(){
                var $wrap = $(this).closest( options.menuWrap );
                if($wrap.size() && ($wrap.get(0) === this))
                {
                    $wrap = $(this).parent( "*" );
                }
                
                if($(window).scrollTop() > $wrap.offset().top)
                {
                    if(!$(this).hasClass( "bmc__fixed" ))
                    {
                        $(this).addClass( "bmc__fixed" );
                    }
                }
                else
                {
                    if($(this).hasClass( "bmc__fixed" ))
                    {
                        $(this).removeClass( "bmc__fixed" );
                    }
                }
            });
            //console.timeEnd('reloadFixed');
        }
        
        var deactivateFixed = function()
        {
            if($(this).hasClass( "fixed" ))
            {
                $(this).removeClass( "fixed" );
            }
            $( window ).off( "resize scroll", reloadFixed );
        }
        
        /**************************************************/
        /*МОДУЛЬ СКРОЛЛИНГ ПРИ КЛИКЕ В МЕНЮ*/
        /**************************************************/
        
        this.setScrollTarget = function(scrollTarget)
        {
            if(scrollTarget !== options.scrollTarget)
            {
                options.scrollTarget = scrollTarget;
                if(scrollTarget)
                {
                    activateScrollTarget();
                }
                else
                {
                    deactivateScrollTarget();
                }
            }
        }
        
        var activateScrollTarget = function()
        {
            ____.containers.each(function(){
                $(this).on( "click", ' a[href ^= "#"]', clickHandlerScrollTarget );
            });
        }
        
        var clickHandlerScrollTarget = function(e)
        {
            var href = $(this).attr( "href" );
            var bottomBorderMenu = 0;
            switch(typeof options.accountingMenuHeight){
               case "boolean":
                   if(options.accountingMenuHeight)
                    {
                        ____.containers.each(function(){
							bottomBorderMenu += $(this).outerHeight();
						});
                    }
                  break;
               case "number": 
                  bottomBorderMenu += options.accountingMenuHeight;
                  break;
               case "function":
                  bottomBorderMenu += options.accountingMenuHeight(____);
                  break;
            }
            
            bottomBorderMenu = Math.round( bottomBorderMenu );
            var offsetTop = href === "#" ? 0 : $(href).offset().top - bottomBorderMenu;
            
            crossModule.animatingScroll = true;
            $('html, body').stop().animate({ 
                scrollTop: offsetTop
            }, options.duration, options.easing, function(){
                crossModule.animatingScroll = false;
                crossModule.reloadActiveFromTarget();
            });
            
            e.preventDefault();
        }
        
        var reloadScrollTarget = function()
        {
            deactivateScrollTarget();
            activateScrollTarget();
        }
        
        var deactivateScrollTarget = function()
        {
            $('html, body').stop();
            ____.containers.each(function(){
                $(this).off( "click", ' a[href ^= "#"]', clickHandlerScrollTarget );
            });
        }
        
        /****************************************************************/
        /*МОДУЛЬ ДОБАВЛЯТОРА КЛАССА ACTIVE ПРИ ПРОКРУТКЕ К НУЖНОМУ БЛОКУ*/
        /****************************************************************/
        
        var $scrollBlocks;
        var lastActiveId = null;
        
        this.setActiveFromTarget = function(activeFromTarget)
        {
            if(activeFromTarget !== options.activeFromTarget)
            {
                options.activeFromTarget = activeFromTarget;
                if(activeFromTarget)
                {
                    activateActiveFromTarget();
                }
                else
                {
                    deactivateActiveFromTarget();
                }
            }
        }
        
        var activateActiveFromTarget = function()
        {
            crossModule.reloadScrollBlocks();
            
            reloadActiveFromTarget();            
            $( window ).on( "resize scroll", reloadActiveFromTarget );
        }
        
        crossModule.reloadActiveFromTarget = function()
        {
            if(options.activeFromTarget)
            {
                reloadActiveFromTarget();
            }
        }
        
        var reloadActiveFromTarget = function()
        {
            if(!crossModule.animatingScroll)
            {
                var scrollTop, $target = false, delta_min, first = true;
                
                var bottomBorderMenu = 0;
                
                
                switch(typeof options.accountingMenuHeight){
                   case "boolean":
                       if(options.accountingMenuHeight)
                        {
                            ____.containers.each(function(){
								bottomBorderMenu += $(this).outerHeight();
							});
                        }
                      break;
                   case "number": 
                      bottomBorderMenu += options.accountingMenuHeight;
                      break;
                   case "function":
                      bottomBorderMenu += options.accountingMenuHeight();
                      break;
                }
                
                bottomBorderMenu = Math.round( bottomBorderMenu );
                
                scrollTop = $(this).scrollTop();
                scrollTop += bottomBorderMenu;
                
                $scrollBlocks.each(function(){
                    var top = $(this).offset().top;
                    
                    if(scrollTop - top >= 0 && scrollTop - (Math.round(top + $(this).outerHeight(true) - parseFloat($(this).css( "margin-top" )))) < 0)
                    {
                        if(first)
                        {
                            delta_min = scrollTop - top;
                            $target = $(this);
                            first = false;
                        }
                        else
                        {
                            if(scrollTop - top < delta_min)
                            {
                                delta_min = scrollTop - top;
                                $target = $(this);
                            }
                        }
                    }
                });
                
                if($target !== false)
                {
                    if( $target.attr( "id" ) && ($target.attr( "id" ) !== undefined) && (lastActiveId !== $target.attr( "id" )) )
                    {
                        lastActiveId = $target.attr( "id" );
                        
                        var menuItems = ____.containers.multiFind( options.menuItemsAndSubMenu );
                        var menuItemsFromTarget = ____.containers.find("[href=#"+( $target.attr( "id" ) )+"]").closest( menuItems );
                        
                        menuItems.removeClass("active");
                        menuItemsFromTarget.addClass("active");
                    }
                }
                else
                {
                    lastActiveId = null;
                    if(options.deleteClassActiveNoFocusTargetsBlock)
                    {
                        ____.containers.multiFind( options.menuItemsAndSubMenu ).removeClass("active");
                    }
                }
            }
        }
        
        var deactivateActiveFromTarget = function()
        {
            ____.containers.multiFind( options.menuItemsAndSubMenu ).removeClass("active");
            
            $( window ).off( "resize scroll", reloadActiveFromTarget );
        }
        
        /****************************************************************/
        /*МОДУЛЬ ПЛАШКИ КОТОРАЯ ЕЗДИТ ПРИ ПРОКРУТКЕ*/
        /****************************************************************/
        
        this.setSlider = function(slider)
        {
            if(slider !== options.slider)
            {
                options.slider = slider;
                if(slider)
                {
                    activateSlider();
                }
                else
                {
                    deactivateSlider();
                }
            }
        }
        
        var activateSlider = function()
        {
            crossModule.reloadScrollBlocks();
            
            if(options.vertical === false)
            {
                ____.containers.after( "<div class=\"bmc__slider\"><div>" );
            }
            else
            {
                ____.containers.after( "<div class=\"bmc__slider_vertical\"><div>" );
            }
            
            reloadSlider();            
            $( window ).on( "resize scroll", reloadSlider );
        }
        
        var reloadSlider = function()
        {
            var scrollTop, $target = false, $nextTarget = false, delta_min, delta_max_next, first = true;
            
            var bottomBorderMenu = 0;
            
            
            switch(typeof options.accountingMenuHeight){
               case "boolean":
                   if(options.accountingMenuHeight)
                    {
                        ____.containers.each(function(){
                            bottomBorderMenu += $(this).outerHeight();
                        });
                    }
                  break;
               case "number": 
                  bottomBorderMenu += options.accountingMenuHeight;
                  break;
               case "function":
                  bottomBorderMenu += options.accountingMenuHeight();
                  break;
            }
            
            bottomBorderMenu = Math.round( bottomBorderMenu );
            
            scrollTop = $(this).scrollTop();
            scrollTop += bottomBorderMenu;
            
            $scrollBlocks.each(function(){
                var top = $(this).offset().top;
                
                if(scrollTop - top >= 0 && scrollTop - (Math.round(top + $(this).outerHeight(true) - parseFloat($(this).css( "margin-top" )))) < 0)
                {
                    if(first)
                    {
                        delta_min = scrollTop - top;
                        $target = $(this);
                        first = false;
                    }
                    else
                    {
                        if(scrollTop - top < delta_min)
                        {
                            delta_min = scrollTop - top;
                            $target = $(this);
                        }
                    }
                }
            });
            
            if($target !== false)
            {
                first = true;
                
                $scrollBlocks.each(function(){
                    var top = $(this).offset().top;
                    
                    if(scrollTop - top < delta_min)
                    {
                        if(first)
                        {
                            delta_max_next = scrollTop - top;
                            $nextTarget = $(this);
                            first = false;
                        }
                        else
                        {
                            if(scrollTop - top > delta_max_next)
                            {
                                delta_max_next = scrollTop - top;
                                $nextTarget = $(this);
                            }
                        }
                    }
                });

                //Анимируем плашку
                if($nextTarget === false)
                {
                    if( $target.attr( "id" ) && ($target.attr( "id" ) !== undefined) )
                    {
                        var menuItems = ____.containers.multiFind( options.menuItemsAndSubMenu );
                        ____.containers.each(function(){
                            var $wrap = $(this).closest( options.menuWrap );
                            if($wrap.size() && ($wrap.get(0) === this))
                            {
                                $wrap = $(this).parent( "*" );
                            }
                            
                            var menuItemFromTarget = $(this).find("[href=#"+( $target.attr( "id" ) )+"]").closest( menuItems );
                            
                            if(options.vertical === false)
                            {
                                var wrap_left_border = $wrap.offset().left + parseFloat($target.css( "border-left-width" ));
                                
                                var left = menuItemFromTarget.offset().left - wrap_left_border;
                                var width = menuItemFromTarget.outerWidth();
                                
                                $(this).find( " ~ .bmc__slider" ).stop(true, true).animate({  textIndent: left, width: width }, {
                                    step: function(now,fx) {
                                      if(fx.prop == "textIndent")
                                        {
                                            $(this).css('transform','translateX('+now+'px)');
                                        }
                                    },
                                    duration: 100
                                },'linear');
                            }
                            else
                            {
                                var wrap_top_border = $wrap.offset().top + parseFloat($target.css( "border-top-width" ));
                                
                                var top = menuItemFromTarget.offset().top - wrap_top_border;
                                var height = menuItemFromTarget.outerHeight();
                                
                                $(this).find( " ~ .bmc__slider_vertical" ).stop(true, true).animate({  textIndent: top, height: height }, {
                                    step: function(now,fx) {
                                      if(fx.prop == "textIndent")
                                        {
                                            $(this).css('transform','translateY('+now+'px)');
                                        }
                                    },
                                    duration: 100
                                },'linear');
                            }
                        });
                    }
                }
                else
                {
                    if( $target.attr( "id" ) && ($target.attr( "id" ) !== undefined) && $nextTarget.attr( "id" ) && ($nextTarget.attr( "id" ) !== undefined) )
                    {
                        var top = $target.offset().top - scrollTop;;
                        var height = $target.outerHeight(true) - parseFloat($target.css( "margin-top" ));
                        
                        var menuItems = ____.containers.multiFind( options.menuItemsAndSubMenu );
                        
                        ____.containers.each(function(){
                            var $wrap = $(this).closest( options.menuWrap );
                            if($wrap.size() && ($wrap.get(0) === this))
                            {
                                $wrap = $(this).parent( "*" );
                            }
                            var relativeScroll = Math.abs( top ) / height;
                            
                            var menuItemFromTarget = $(this).find("[href=#"+( $target.attr( "id" ) )+"]").closest( menuItems );
                            var menuItemFromTarget_NEXT = $(this).find("[href=#"+( $nextTarget.attr( "id" ) )+"]").closest( menuItems );
                            
                            if(options.vertical === false)
                            {
                                var wrap_left_border = $wrap.offset().left + parseFloat($target.css( "border-left-width" ));
                                
                                var left_Target = menuItemFromTarget.offset().left - wrap_left_border;
                                var width_Target = menuItemFromTarget.outerWidth();
                                var left_NEXT = menuItemFromTarget_NEXT.offset().left - wrap_left_border;
                                var width_NEXT = menuItemFromTarget_NEXT.outerWidth();
                                
                                var left = Math.round( left_Target + ((left_NEXT - left_Target) * relativeScroll) );
                                var width = Math.round( width_Target + ((width_NEXT - width_Target) * relativeScroll) );
                                
                                $(this).find( " ~ .bmc__slider" ).stop(true, true).animate({  textIndent: left, width: width }, {
                                    step: function(now,fx) {
                                        if(fx.prop == "textIndent")
                                        {
                                            $(this).css('transform','translateX('+now+'px)');
                                        }
                                    },
                                    duration: 100
                                },'linear');
                            }
                            else
                            {
                                var wrap_top_border = $wrap.offset().top + parseFloat($target.css( "border-top-width" ));
                                
                                var top_Target = menuItemFromTarget.offset().top - wrap_top_border;
                                var height_Target = menuItemFromTarget.outerHeight();
                                var top_NEXT = menuItemFromTarget_NEXT.offset().top - wrap_top_border;
                                var height_NEXT = menuItemFromTarget_NEXT.outerHeight();
                                
                                var _top = Math.round( top_Target + ((top_NEXT - top_Target) * relativeScroll) );
                                var _height = Math.round( height_Target + ((height_NEXT - height_Target) * relativeScroll) );
                                
                                $(this).find( " ~ .bmc__slider_vertical" ).stop(true, true).animate({  textIndent: _top, height: _height }, {
                                    step: function(now,fx) {
                                        if(fx.prop == "textIndent")
                                        {
                                            $(this).css('transform','translateY('+now+'px)');
                                        }
                                    },
                                    duration: 100
                                },'linear');
                            }
                        });
                    }
                }
            }
        }
        
        var deactivateSlider = function()
        {
            ____.containers.find( " ~ .bmc__slider" ).remove();
            ____.containers.find( " ~ .bmc__slider_vertical" ).remove();
            
            $( window ).off( "resize scroll", reloadSlider );
        }
        
        //Обновление scrollBlocks
        crossModule.reloadScrollBlocks = function()
        {
            var filter_dublicate = {};
            $scrollBlocks = $();
            ____.containers.find( 'a[href ^= "#"]' ).each(function(){
                var id = $(this).attr("href");
                if($( id ).size() && !(id in filter_dublicate))
                {
                    filter_dublicate[id] = null;
                    $scrollBlocks = $scrollBlocks.add( $( id ) );
                }
            });
        }
        
        //Получаем конечные опции для текущей ширины из каскада опций
        var getOptionFromResponsiveOption = function()
        {
            var resOptions = {}, responsive = {};
            
            for(var key in ____.responsiveOptions)
            {
                if(/\d{2,5}/.test(key))
                {
                    responsive[key] = ____.responsiveOptions[key];
                }
                else
                {
                    resOptions[key] = ____.responsiveOptions[key];
                }
            }
            
            resOptions = $.extend( true , {} , resOptions );//Клонируем обьект

            var arrWidthSort = new Array();
            for(var width in responsive)
            {
                arrWidthSort.push( width );
            }
            
            arrWidthSort = arrWidthSort.sort(function(a,b){return b-a;});

            for(var key in arrWidthSort)
            {
                var width = arrWidthSort[key];
                if( parseInt(width) > Math.round( $(window).width() ) )
                {
                    delete resOptions[width];
                    resOptions = $.extend( true , resOptions , responsive[width] );
                }
            }
            
            return resOptions;
        }
        
        this.create();
    };

    return new BMC(this);
}
})(jQuery);