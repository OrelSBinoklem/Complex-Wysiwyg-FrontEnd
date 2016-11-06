(function($){//Модули:

    var defaultOptions = {
        $helpersContainer: $(""),
        maxLinesEditorsForTabCopyInsert: 60
    };

    var generatorCode = function($container, options) {
        this._options = options;
        var ____ = this;
        ____.$container = $container;

        var generatorCode__managerFields = new modules.generatorCode__managerFields($container, this._options);
        var generatorCode__TabsCopyInsert = new modules.generatorCode__TabsCopyInsert($container, this._options);
        var generatorCode__helpers = new modules.generatorCode__helpers(options.$helpersContainer, this._options);

        this._create = function() {
            ____._init();

            generatorCode__managerFields._create();
            generatorCode__TabsCopyInsert._create();
            generatorCode__helpers._create();

            ____.generatedCode = undefined;
            ____.generatorFolder = undefined;
            ____.showTooltip = false;
            ____.showHelper = false;

            ____.parsedOptions = {};

            ____.generators = {};

            $container.on('gcmf.updated', ____.handlerChangeContentOptions);

            //Очистка генератора кода
            $container.on('click', ' .gc > .panel-heading .btn-clear', ____.handlerResetGenerator);
            //Активация и дезактивация подсказочек
            $container.on('click', ' .row-header .btn-trigger-tooltip', ____.handlerToggleTooltip);
            //Активация и дезактивация хелпера
            $container.on('click', ' .row-header .btn-trigger-helper', ____.handlerToggleHelper);

            $container.find(" .footer-tab .nav-tabs a").off("click", generatorCode__TabsCopyInsert._handlerTabsCopyInsert);
            $container.find(" .footer-tab .nav-tabs a").on("click", ____._handlerTabsCopyInsert);
            //Показать подсказку в хелпере при наведении на определённый элемент
            $container.on({
                "mouseenter": function(){
                    generatorCode__helpers.activateSection( $(this).attr('data-helper') );
                },
                "mouseleave": function(){
                    generatorCode__helpers.deactivateSections();
                }
            }, " .gc__manager-fields [data-helper]");
        }

        this._destroy = function() {
            
        }

        this._init = function() {
            //Первичная вставка html кода
            $container.append('\
                <div class="gc panel panel-default">\
                    <div class="panel-heading">\
                        Геренатор кода\
                        <button type="button" class="btn btn-default btn-sm btn-clear"><span data-toggle="tooltip" data-placement="top" data-original-title="Очистить всё!"><span class="glyphicon glyphicon-trash"></span></span></button>\
                    </div>\
                    <div class="gc__panel-body panel-body">\
                        <div class="container-fluid">\
                            <div class="row row-header">\
                                <div class="col-dop-item">\
                                    <div class="btn-toolbar">\
                                        <div class="btn-group">\
                                            <button type="button" class="btn btn-default btn-trigger-tooltip"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Включить всплывающие подсказки!"><span class="glyphicon glyphicon-question-sign"></span></span></button>\
                                            <button type="button" class="btn btn-default btn-trigger-helper"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Включить панель с подсказками!"><span class="glyphicon glyphicon-question-sign"></span>&nbsp;<span class="glyphicon glyphicon-arrow-right"></span></span></button>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="clear"></div>\
                            </div>\
                            <hr />\
                            <div class="gc__manager-fields"><div class="gc__manager-fields-events-wrap"></div></div>\
                        </div>\
                    </div>\
                </div>');

            ____.refreshSelectpicker();
            ____.refreshTooltip();
        }

        this.refresh = function() {
            ____._destroy();
            ____._create();
        }

        /*Очистить всё*/
        this._clear = function() {
            generatorCode__managerFields._clear();

            ____.generatorFolder = undefined;
            ____.generatedCode = undefined;

            generatorCode__TabsCopyInsert._clear();
            generatorCode__helpers._clear();
        }

        this.handlerChangeContentOptions = function() {
            ____.refreshTooltip();
        }

        this.handlerResetGenerator = function() {
            ____.createAndRefreshGenerator(____.generatorFolder);
        }
        
        var animations__generator = {};
        this.open = function() {
            if( "openOptionsTimeLine__close" in animations__generator ) {
                animations__generator.openOptionsTimeLine__close.pause();
            } else {
                $container.css({
                    opacity: 0,
                    transform: "scale(0.8, 0.8)"
                });
            }
            $container.css({display: "block"});

            if( !("openOptionsTimeLine" in animations__generator) ) {
                animations__generator.openOptionsTimeLine = (new TimelineLite()).append([
                    TweenMax.to($container, 0.5,
                        {css:{transform: "scale(1, 1)" }}),
                    TweenMax.to($container, 0.3,
                        {css:{ opacity: 1 }})
                ]);
            } else {
                animations__generator.openOptionsTimeLine.restart();
            }

            if(____.showHelper)
            {
                generatorCode__helpers.open();
            }

            ____.refreshTooltip();
            $container.trigger("gc.open");
        }

        this.close = function() {
            if( "openOptionsTimeLine" in animations__generator ) { animations__generator.openOptionsTimeLine.pause() }
            if( !("openOptionsTimeLine__close" in animations__generator) ) {
                animations__generator.openOptionsTimeLine__close = (new TimelineLite()).append([
                    TweenMax.to($container, 0.5,
                        {css:{ transform: "scale(0.8, 0.8)"}, onComplete: handlerComplete}),
                    TweenMax.to($container, 0.5,
                        {css:{ opacity: 0 }})
                ]);
            } else {
                animations__generator.openOptionsTimeLine__close.restart();
            }
            function handlerComplete() {
                $container.css('display', 'none');
            }

            if(____.showHelper)
            {
                generatorCode__helpers.close();
            }

            $container.trigger("gc.close");
        }

        //создание и обновление генератора кода
        this.createAndRefreshGenerator = function( folder ) {
            ____._clear();
            ____.generatorFolder = folder;

            if( !(folder in ____.generators) ) {
                ____.loadGenerator( folder );
            }
            generatorCode__managerFields.pasteContent( ____.generators[folder].options.html );
            generatorCode__managerFields.reinitForNewContent();
            generatorCode__helpers.pasteContent( ____.generators[folder].helper );
        }

        //Получаем сгенерированный код
        this.generateCode = function() {
            if( generatorCode__managerFields.validityCheck() ) {
                return false;
            }

            var code = {
                copy: '',
                insert: '',
                files: {},//ещё одно свойство по имени редактора в самом обьекте text и mode
            };

            //Парсим опции
            var options = generatorCode__managerFields.parseParamsFormOptions();

            //Исполняем функции "генераторы" кода
            code.copy   =  ____.generators[____.generatorFolder].tabsCopyInsert.copy.call({}, options);
            code.insert =  ____.generators[____.generatorFolder].tabsCopyInsert.insert.call({}, options);
            for( var nameFile in ____.generators[____.generatorFolder].tabsCopyInsert.files ) {
                var fn = ____.generators[____.generatorFolder].tabsCopyInsert.files[nameFile];
                code.files[nameFile] = fn.call({}, options);
            }

            //Записываем
            ____.generatedCode = code;

            return true;
        }

        this.loadGenerator = function( folder ) {
            if( !(folder in ____.generators) ) {
                ____.generators[folder] = {};
                ____.generators[folder].options = generatorCode__managerFields.loadOptions( folder );
                ____.generators[folder].tabsCopyInsert = generatorCode__TabsCopyInsert.loadGenerator( folder );
                ____.generators[folder].helper = generatorCode__helpers.loadHelper( folder );
            }
        }

        this._handlerTabsCopyInsert = function (e) {
            if( ____.generatorFolder !== undefined ) {
                if (!$(this).closest('.nav-tabs').find(' li').hasClass('active')) {
                    if( ____.generateCode() ) {
                        generatorCode__TabsCopyInsert.pasteCodeFooterTab(____.generatedCode);

                        openClose.call(this);
                    }
                } else {
                    openClose.call(this);
                }

                function openClose() {
                    if (!$(this).parent('li').hasClass('active')) {
                        var id;

                        $container.find(' .footer-tab .nav-tabs li').removeClass('active');
                        $(this).parent('li').addClass('active');

                        if (id = $(this).attr('href')) {
                            $container.find(' .footer-tab .tab-pane').css({opacity: 0, zIndex: 1});
                            $container.find(' .footer-tab .tab-pane.' + id.substring(1)).css({zIndex: 2});

                            $container.find(' .footer-tab').stop().animate({height: '100%'}, 500);
                            $container.find(' .footer-tab .tab-pane.' + id.substring(1)).stop().animate({opacity: 1}, 500);
                        }
                    }
                    else {
                        $container.find(' .footer-tab .nav-tabs li').removeClass('active');
                        $container.find(' .footer-tab').stop().animate({height: $container.find('.footer-tab .nav-tabs').outerHeight() + ''}, 500);
                        $container.find(' .footer-tab .tab-pane').stop().animate({opacity: 0}, 500);
                    }
                }
            } else {
                alert("Не выбран генератор!");
            }

            e.preventDefault();
        }

        this.handlerToggleTooltip = function() {
            if(____.showTooltip)
            {
                ____.disableTooltip();
            }
            else
            {
                ____.activateTooltip();
            }
        }

        this.handlerToggleHelper = function() {
            if(!____.showHelper)
            {
                generatorCode__helpers.open();

                $container.find(" .row-header .btn-trigger-helper").addClass('active');
                ____.showHelper = true;
            }
            else
            {
                $container.find(" .row-header .btn-trigger-helper").removeClass('active');
                generatorCode__helpers.close();
                ____.showHelper = false;
            }
        }

        //активация подсказок
        this.activateTooltip = function() {
            if(!this.showTooltip)
            {
                $container.find(" [data-toggle='tooltip']").tooltip();
                $container.find(' [data-toggle="popover"]').popover();

                $container.find(" .row-header .btn-trigger-tooltip").addClass('active');
                this.showTooltip = true;
            }
        }

        //отключение подсказок
        this.disableTooltip = function() {
            if(this.showTooltip)
            {
                $container.find(" [data-toggle='tooltip']:not(.row-header [data-toggle='tooltip'], .btn-clear [data-toggle='tooltip'])").tooltip('destroy');
                $container.find(' [data-toggle="popover"]').popover('destroy');

                $container.find(" .row-header .btn-trigger-tooltip").removeClass('active');
                this.showTooltip = false;
            }
        }

        //обновление подсказок
        this.refreshTooltip = function() {
            if(this.showTooltip)
            {
                $container.find(" [data-toggle='tooltip']").tooltip();
                $container.find(' [data-toggle="popover"]').popover();

                $container.find(" .row-header .btn-trigger-tooltip").addClass('active');
            }
            else
            {
                $container.find(" [data-toggle='tooltip']:not(.row-header [data-toggle='tooltip'], .btn-clear [data-toggle='tooltip'])").tooltip('destroy');
                $container.find(" .row-header [data-toggle='tooltip']").tooltip();
                $container.find(" .btn-clear [data-toggle='tooltip']").tooltip();
                $container.find(' [data-toggle="popover"]').popover('destroy');

                $container.find(" .row-header .btn-trigger-tooltip").removeClass('active');
            }
        }

        this.refreshSelectpicker = function() {
            $container.find(' .selectpicker').selectpicker();

            //Переносим подсказки из тега "select" в код "Selectpicker"
            $container.find(' .selectpicker').each(function(){
                var bootstrapSelect = $(this).find(' + .bootstrap-select');

                $(this.attributes).each(function() {
                    if(/^data/gim.test(this.name))
                    {
                        bootstrapSelect.attr(this.name, this.value);
                    }
                });
            });
        }
    }

    modules.generatorCode = generatorCode;

})(jQuery);