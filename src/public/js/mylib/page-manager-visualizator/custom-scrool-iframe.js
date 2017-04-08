(function($){//Модули: 
//Скролл лучше неуменьшать оно и так идёт поверх контента
var defaultOptions = {
    nameIFrame: "",
    pixelsScrollableInSeconds: 2000,
    minWOuterScroll: 23,
    minHOuterScroll: 23
};

var customScrollIFrame = function($container, options) {
    this._options = options;
    var ____ = this;

    //хак для плавности скролла в ie11
    ____.$fix_animate = $( '<div class="csif-fix-animate"></div>' );
    
    this._create = function() {
        //Вставка HTML скроллов
        ____._initPasteHTML();
        
        //Скрыть скролл в iFrame
        var $iFrame = $('#'+(____._options.nameIFrame)).contents();
        $iFrame.find(' head').append('\n\
            <style id="csif-clear-scroll-body" type="text/css">\n\
                body {\n\
                    overflow: hidden !important;\n\
                }\n\
            </style>\n\
        ');
        $iFrame.find(' body').css({overflow: "hidden"});
        
        //Свойства для ползунков
        ____._Y_Scrollable = false;
        ____._X_Scrollable = false;
        ____._cursor_Y = 0;
        ____._cursor_X = 0;
        ____._topScrollIFrameTemp = 0;
        ____._leftScrollIFrameTemp = 0;
        
        //Установка обработчиков событий
        $(window[____._options.nameIFrame].window).on("resize scroll", ____.updateOuterScroll);
        $(window).on("resize", ____.updateOuterScroll);
        
        $container.find(' .csif-outer-scroll-v .scrolling').on('mousedown', ____._handlerDown_Y);
        $container.find(' .csif-outer-scroll-g .scrolling').on('mousedown', ____._handlerDown_X);
        $iFrame.find('body').on('mouseup', ____._handlerUp);
        $('body').on('mouseup', ____._handlerUp);
        $iFrame.find('body').on('mousemove', ____._handlerMove);
        $('body').on('mousemove', ____._handlerMove);
        
        $container.find(' .csif-outer-scroll-v .arrow-top').on('mousedown', ____._handlerArrowTop);
        $container.find(' .csif-outer-scroll-v .arrow-bottom').on('mousedown', ____._handlerArrowBottom);
        $container.find(' .csif-outer-scroll-g .arrow-left').on('mousedown', ____._handlerArrowLeft);
        $container.find(' .csif-outer-scroll-g .arrow-right').on('mousedown', ____._handlerArrowRight);
        $container.find(' .csif-outer-scroll-v .arrow').on('mouseup mouseleave', ____._handlerArrowLeave);
        $container.find(' .csif-outer-scroll-g .arrow').on('mouseup mouseleave', ____._handlerArrowLeave);
        
        $iFrame.find('body').on('wheel', ____._handlerMouseWheel);
        
        //Первое выполнение
         ____.updateOuterScroll();
    }
    
    this._destroy = function() {
        var $iFrame = $('#'+(____._options.nameIFrame)).contents();
        
        $container.find(" .csif-outer-scroll-v").remove();
        $container.find(" .csif-outer-scroll-g").remove();
        $container.find(" .csif-square").remove();
        
        $(window).off("resize", ____.updateOuterScroll);
        
        $iFrame.find('body').off('mouseup', ____._handlerUp);
        $('body').off('mouseup', ____._handlerUp);
        $iFrame.find('body').off('mousemove', ____._handlerMove);
        $('body').off('mousemove', ____._handlerMove);

        $container.find(' .csif-outer-scroll-v .arrow-top').off('mousedown', ____._handlerArrowTop);
        $container.find(' .csif-outer-scroll-v .arrow-bottom').off('mousedown', ____._handlerArrowBottom);
        $container.find(' .csif-outer-scroll-g .arrow-left').off('mousedown', ____._handlerArrowLeft);
        $container.find(' .csif-outer-scroll-g .arrow-right').off('mousedown', ____._handlerArrowRight);
        $container.find(' .csif-outer-scroll-v .arrow').off('mouseup mouseleave', ____._handlerArrowLeave);
        $container.find(' .csif-outer-scroll-g .arrow').off('mouseup mouseleave', ____._handlerArrowLeave);
        
        $iFrame.find('body').off('wheel', ____._handlerMouseWheel);
    }
    
    this.reload = function() {
        ____._destroy();
        ____._create();
    }
    
    //Просто вставка html
    this._initPasteHTML = function() {
        $container.append('\n\
            <div class="csif-outer-scroll-v">\n\
                <div class="csif-container">\n\
                    <div class="arrow arrow-top"><i class="glyphicon glyphicon-chevron-up"></i></div>\n\
                    <div class="arrow arrow-bottom"><i class="glyphicon glyphicon-chevron-down"></i></div>\n\
                    <div class="scrolling-container">\n\
                        <div class="scrolling"></div>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
            <div class="csif-outer-scroll-g">\n\
                <div class="csif-container">\n\
                    <div class="arrow arrow-left"><i class="glyphicon glyphicon-chevron-left"></i></div>\n\
                    <div class="arrow arrow-right"><i class="glyphicon glyphicon-chevron-right"></i></div>\n\
                    <div class="scrolling-container">\n\
                        <div class="scrolling"></div>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
            <div class="csif-square"></div>\n\
        ');
    }
    
    //Обновление ползунков "Внешнего скролла"
    this.updateOuterScroll = function() {
        var iframe = window[____._options.nameIFrame];
        var $iframe = $('#'+(____._options.nameIFrame)).contents();
        var wWindow, hWindow, wDocument, hDocument, topScroll, leftScroll,
        wOuterScroll, hOuterScroll, hConOuterScroll, wConOuterScroll, topMargin, leftMargin;
        
        wWindow = $(iframe.window).width();
        hWindow = $(iframe.window).height();
        wDocument = $(iframe.document).width();
        hDocument = $(iframe.document).height();
        
        //Узнаем прокрутку
        topScroll = $(iframe.window).scrollTop();
        leftScroll = $(iframe.window).scrollLeft();
        //==========
        
        hConOuterScroll = $container.find(' .csif-outer-scroll-v .scrolling-container').height();
        wConOuterScroll = $container.find(' .csif-outer-scroll-g .scrolling-container').width();
        
        //Вычисляем размеры элементов "за которые можно прокручивать" на внешнем скролле и отступы для смешения чтоб показать насколько прокручена страница
        hOuterScroll = Math.round(hWindow / hDocument * hConOuterScroll);
        if(hOuterScroll < ____._options.minHOuterScroll)
        {
            hOuterScroll = ____._options.minHOuterScroll;
        }
        topMargin = Math.round(topScroll / (hDocument - hWindow) * (hConOuterScroll - hOuterScroll));
        
        wOuterScroll = Math.round(wWindow / wDocument * wConOuterScroll);
        if(wOuterScroll < ____._options.minWOuterScroll)
        {
            wOuterScroll = ____._options.minWOuterScroll;
        }
        leftMargin = Math.round(leftScroll / (wDocument - wWindow) * (wConOuterScroll - wOuterScroll));
        //==========
        $container.find(' .csif-outer-scroll-v .scrolling').css({height: hOuterScroll, marginTop: topMargin});
        $container.find(' .csif-outer-scroll-g .scrolling').css({width: wOuterScroll, marginLeft: leftMargin});
    }
    
    //Нажатие на вертикальный ползунок
    this._handlerDown_Y = function(e) {
        ____._Y_Scrollable = true;
        ____._cursor_Y = e.screenY;
        ____._topScrollIFrameTemp = $(window[____._options.nameIFrame].window).scrollTop();
    }
    
    //Нажатие на горизонтальный ползунок
    this._handlerDown_X = function(e) {
        ____._X_Scrollable = true;
        ____._cursor_X = e.screenX;
        ____._leftScrollIFrameTemp = $(window[____._options.nameIFrame].window).scrollLeft();
    }
    
    //Отпускание мыши с ползунка
    this._handlerUp = function() {
        ____._Y_Scrollable = false;
        ____._X_Scrollable = false;
    }
    
    //Обновление скрытого скролла в IFrame
    this._handlerMove = function(e) {
        if( ____._Y_Scrollable || ____._X_Scrollable )
        {
            var iframe = window[____._options.nameIFrame];
            var $iframe = $("#"+(____._options.nameIFrame)).contents();
            var wWindow, hWindow, wDocument, hDocument, topScroll, leftScroll,
            wOuterScroll, hOuterScroll, hConOuterScroll, wConOuterScroll,
            resTopScroll, resLeftScroll, oneStepVertical, oneStepGorizontal;
            
            wWindow = $(iframe.window).width();
            hWindow = $(iframe.window).height();
            wDocument = $(iframe.document).width();
            hDocument = $(iframe.document).height();
            
            //Узнаем прокрутку
            topScroll = $(iframe.window).scrollTop();
            leftScroll = $(iframe.window).scrollLeft();
            //==========
            
            hConOuterScroll = $container.find(' .csif-outer-scroll-v .scrolling-container').height();
            wConOuterScroll = $container.find(' .csif-outer-scroll-g .scrolling-container').width();
            
            //Вычисляем размеры элементов "за которые можно прокручивать" на внешнем скролле и отступы для смешения чтоб показать насколько прокручена страница
            hOuterScroll = hWindow / hDocument * hConOuterScroll;
            if(hOuterScroll < ____._options.minHOuterScroll)
            {
                hOuterScroll = ____._options.minHOuterScroll;
            }
            
            wOuterScroll = wWindow / wDocument * wConOuterScroll;
            if(wOuterScroll < ____._options.minWOuterScroll)
            {
                wOuterScroll = ____._options.minWOuterScroll;
            }
            //==========
            if(____._Y_Scrollable)
            {
                oneStepVertical = (hDocument - hWindow) / (hConOuterScroll - hOuterScroll);
                resTopScroll = Math.round((e.screenY - ____._cursor_Y) * oneStepVertical + ____._topScrollIFrameTemp);
                if(resTopScroll < 0)
                {
                    resTopScroll = 0;
                }
                if(resTopScroll > hDocument - hWindow)
                {
                    resTopScroll = hDocument - hWindow;
                }
    			$(iframe.window).scrollTop(resTopScroll);
                $container.trigger("csif.scroll");
            }
            
            if(____._X_Scrollable)
            {
                oneStepGorizontal = (wDocument - wWindow) / (wConOuterScroll - wOuterScroll);
                resLeftScroll = Math.round((e.screenX - ____._cursor_X) * oneStepGorizontal + ____._leftScrollIFrameTemp);
                if(resLeftScroll < 0)
                {
                    resLeftScroll = 0;
                }
                if(resLeftScroll > wDocument - wWindow)
                {
                    resLeftScroll = wDocument - wWindow;
                }
    			$(iframe.window).scrollLeft(resLeftScroll);
                $container.trigger("csif.scroll");
            }
        }
    }
    
    //Верхняя стрелочка
    this._handlerArrowTop = function() {
        var iframe = window[____._options.nameIFrame];
        $(this).addClass('active');
        
        var topScroll = $(iframe.window).scrollTop();

        ____.$fix_animate.css({top: topScroll});
        ____.$fix_animate.stop().animate({top: 0}, //По нормальному чтото она непашет - пришлось через зад делать...
        {
            duration: Math.round(topScroll / ____._options.pixelsScrollableInSeconds * 1000),
            easing: "linear",
            complete: function(){
				$(iframe.window).scrollTop(0);
                $container.trigger("csif.scroll");
            },
            step: function(now,fx){
				$(iframe.window).scrollTop(now);
                $container.trigger("csif.scroll");
            }
        });
    }
    
    //Нижняя стрелочка
    this._handlerArrowBottom = function() {
        var iframe = window[____._options.nameIFrame];
        $(this).addClass('active');
        var hWindow, hDocument, topScroll;
        
        hWindow = $(iframe.window).height();
        hDocument = $(iframe.document).height();
        topScroll = $(iframe.window).scrollTop();
        
		var resTopScroll = hDocument - hWindow;

        ____.$fix_animate.css({top: topScroll});
        ____.$fix_animate.stop().animate({top: resTopScroll},
        {
            duration: Math.round((hDocument - hWindow - topScroll) / ____._options.pixelsScrollableInSeconds * 1000),
            easing: "linear",
            complete: function(){
				$(iframe.window).scrollTop(resTopScroll);
                $container.trigger("csif.scroll");
            },
            step: function(now,fx){
				$(iframe.window).scrollTop(now);
                $container.trigger("csif.scroll");
            }
        });
    }
    //Левая стрелочка
    this._handlerArrowLeft = function() {
        var iframe = window[____._options.nameIFrame];
        $(this).addClass('active');
        
        var leftScroll = $(iframe.window).scrollLeft();

        ____.$fix_animate.css({left: leftScroll});
        ____.$fix_animate.stop().animate({left: 0},
        {
            duration: Math.round(leftScroll / ____._options.pixelsScrollableInSeconds * 1000),
            easing: "linear",
            complete: function(){
				$(iframe.window).scrollLeft(0);
                $container.trigger("csif.scroll");
            },
            step: function(now,fx){
				$(iframe.window).scrollLeft(now);
                $container.trigger("csif.scroll");
            }
        });
    }

    //Правая стрелочка
    this._handlerArrowRight = function() {
        var iframe = window[____._options.nameIFrame];
        $(this).addClass('active');
        var wWindow, wDocument, leftScroll;
        
        wWindow = $(iframe.window).width();
        wDocument = $(iframe.document).width();
        leftScroll = $(iframe.window).scrollLeft();
        
		var resLeftScroll = wDocument - wWindow;

        ____.$fix_animate.css({left: leftScroll});
        ____.$fix_animate.stop().animate({left: resLeftScroll},
        {
            duration: Math.round((wDocument - wWindow - leftScroll) / ____._options.pixelsScrollableInSeconds * 1000),
            easing: "linear",
            complete: function(){
				$(iframe.window).scrollLeft(resLeftScroll);
                $container.trigger("csif.scroll");
            },
            step: function(now,fx){
				$(iframe.window).scrollLeft(now);
                $container.trigger("csif.scroll");
            }
        });
    }
    
    //Убрать мышку со стрелочки
    this._handlerArrowLeave = function() {
        ____.$fix_animate.stop();
        $(this).removeClass('active');
    }
    
    //Прокрутка колесом мыши
    this._mouseWheelAnimated = false;
    this._tempWheelAnimated = 0;
    this._handlerMouseWheel = function(e) {
        if(window[____._options.nameIFrame] !== undefined) {
            var deltaY;
            if("mozMovementY" in e.originalEvent) {
                deltaY = e.originalEvent.deltaY || -1 * e.originalEvent.wheelDelta;
                deltaY *= 40;
            } else if( /rv\:11/.test(navigator.userAgent) ) {
                if( (e.originalEvent.deltaY || -1 * e.originalEvent.wheelDelta) > 0 ) {
                    deltaY = 120;
                } else {
                    deltaY = -120;
                }
            } else if( /Firefox\//.test(navigator.userAgent) ) {
                deltaY = e.originalEvent.deltaY || -1 * e.originalEvent.wheelDelta;
                deltaY *= 40;
            } else {
                deltaY = e.originalEvent.deltaY || -1 * e.originalEvent.wheelDelta;
                if(Math.abs(deltaY) < 50) {
                    deltaY *= 120;
                }
            }

            var iframe = window[____._options.nameIFrame];

            topScroll = $(iframe.window).scrollTop();
            if( ____._mouseWheelAnimated ) {
                //Если пользователь резко начал крутить в другую сторону
                if(sign(____._tempWheelAnimated - topScroll) !== sign(deltaY)) {//IE НЕПОТДЕРЖИВАЕТ "Math.sign"
                    ____._tempWheelAnimated = topScroll + deltaY;
                } else {
                    ____._tempWheelAnimated += deltaY;
                }
            } else {
                ____._tempWheelAnimated = topScroll + deltaY;
            }
            function sign(number) {
                if( number > 0 ) {
                    return 1;
                } else if( number === 0 ) {
                    return 0;
                } else {
                    return -1;
                }
            }

            ____._mouseWheelAnimated = true;

            ____.$fix_animate.css({top: topScroll});
            ____.$fix_animate.stop().animate({top: ____._tempWheelAnimated},
                {
                    duration: 100,
                    easing: "linear",
                    complete: function(){
                        $(iframe.window).scrollTop(____._tempWheelAnimated);
                        ____._mouseWheelAnimated = false;

                        $container.trigger("csif.scroll");
                    },
                    step: function(now,fx){
                        $(iframe.window).scrollTop(now);

                        $container.trigger("csif.scroll");
                    }
                });
        }
    }
}

modules.customScrollIFrame = customScrollIFrame;
    
})(jQuery);