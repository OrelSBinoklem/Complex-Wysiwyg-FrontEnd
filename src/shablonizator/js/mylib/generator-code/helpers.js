(function($){

    var defaultOptions = {
        
    };

    var generatorCode__helpers = function($container, options) {
        this._options = options;
        var ____ = this;
        ____.$container = $container;

        this._create = function () {
            ____._init();

            ____.showHelper = false;
            ____.animations__opened = {};

            $container.find(" .gc__helpers > .panel-body").mCustomScrollbar({
                axis: "y",
                theme: "dark",
                scrollbarPosition: "outside",
                scrollInertia: 100
            });
        }

        this._destroy = function () {
            $container.find(" .gc__helpers > .panel-body").mCustomScrollbar("destroy");

            $container.find(" .gc__helpers").remove();
        }

        this._init = function () {
            $container.append('\
                <div class="gc__helpers panel panel-default">\
                    <div class="panel-heading">\
                        Подсказки\
                    </div>\
                    <div class="panel-body">\
                        <div class="container-fluid">\
                            Подсказки\
                        </div>\
                    </div>\
                </div>');
        }

        this.refresh = function () {
            ____._destroy();
            ____._create();
        }

        this.pasteContent = function ( html ) {
            $container.find(' .gc__manager-fields').append('<div class="gc__manager-fields-events-wrap">'+html+'</div>');
        }

        //Загрузка хелпера
        this.loadHelper = function( folder ) {
            var result;
            $.ajax({
                url: "shablonizator.php",
                type: "POST",
                cache: false,
                data: ({module: 'getfile', dir: "generators/" + folder + "/" + "helper.html", text_encoding: shablonizator.textEncodingServer}),
                async: false,
                success: function(data){
                    if(data != 'error_getfile_shablonizator156418546585415')
                    {
                        result = data;
                    }
                }
            });
            return result;
        }

        /*Очистить всё*/
        this._clear = function()
        {
            $container.find(' .gc__helpers > .panel-body').empty();
        }

        this.open = function() {
            if( "openOptionsTimeLine__close" in ____.animations__opened ) {
                ____.animations__opened.openOptionsTimeLine__close.pause();
            } else {
                $container.css({
                    opacity: 0,
                    transform: "scale(0.8, 0.8)"
                });
            }
            $container.css({display: "block"});

            if( !("openOptionsTimeLine" in ____.animations__opened) ) {
                ____.animations__opened.openOptionsTimeLine = (new TimelineLite()).append([
                    TweenMax.to($container, 0.5,
                        {css:{transform: "scale(1, 1)" }}),
                    TweenMax.to($container, 0.3,
                        {css:{ opacity: 1 }})
                ]);
            } else {
                ____.animations__opened.openOptionsTimeLine.restart();
            }

            ____.showHelper = true;
        }

        this.close = function() {
            if( "openOptionsTimeLine" in ____.animations__opened ) { ____.animations__opened.openOptionsTimeLine.pause() }
            if( !("openOptionsTimeLine__close" in ____.animations__opened) ) {
                ____.animations__opened.openOptionsTimeLine__close = (new TimelineLite()).append([
                    TweenMax.to($container, 0.5,
                        {css:{ transform: "scale(0.8, 0.8)"}, onComplete: handlerComplete}),
                    TweenMax.to($container, 0.5,
                        {css:{ opacity: 0 }})
                ]);
            } else {
                ____.animations__opened.openOptionsTimeLine__close.restart();
            }
            function handlerComplete() {
                $container.css('display', 'none');
            }

            ____.showHelper = false;
        }

        this.activateSection = function( id ) {
            var $scrollContainer = options.$helpersContainer.find(' .gc > .panel-body');
            //зделать защиту если нету хелпера
            var $Helper = options.$helpersContainer.find(' [data-helper="'+idHelper+'"]').size() && options.$helpersContainer.find(' [data-helper="'+idHelper+'"]');

            var scroll = Math.round( -1 * parseFloat(options.$helpersContainer.find(' .mCSB_container').css("top")) );
            var helpContainer = {top: Math.round($scrollContainer.offset().top), height: Math.round($scrollContainer.outerHeight())};
            var helper = {top: Math.round($Helper.offset().top - scroll), height: Math.round($Helper.outerHeight())};

            //Если нижняя или верхняя стороны подсказки находяться за контейнером то прокручиваем чтоб она была по центру
            if(helper.top < helpContainer.top || helper.top + helper.height > helpContainer.top + helpContainer.height)
            {
                helpContainer.hCenter = Math.round(helpContainer.top + helpContainer.height / 2);
                helper.hCenter = Math.round(helper.top + helper.height / 2);
                var scrollTopNeeded = helper.hCenter + scroll - helpContainer.hCenter;

                if(scrollTopNeeded < 0)
                {
                    scrollTopNeeded = 0;
                }
                $scrollContainer.animate({scrollTop: scrollTopNeeded}, '500');
                $container.find(" .gc__helpers > .panel-body").mCustomScrollbar("scrollTo", scrollTopNeeded);
            }
            //==========
            $container.find(' [data-helper="'+idHelper+'"]').addClass('active');
        }

        this.deactivateSections = function() {
            var idHelper = $(this).attr('data-helper');
            $container.find(' [data-helper="'+idHelper+'"]').removeClass('active');
        }
    }
    
    modules.generatorCode__helpers = generatorCode__helpers;

})(jQuery);