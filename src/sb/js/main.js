/****************************************************/
/*Шаблонизатор*/
/****************************************************/

//Глобальные настройки
$(document).ready(function(){
    var animations = {};
    $( ".shab__global-settings-btn" ).on("click", function () {
        if( !$(this).hasClass('active') ) {
            openOptions();
        } else {
            closeOptions();
        }
    });
    
    $( "body" ).on("click click.body.iframe", function (e) {
        if( $(e.target).closest($(".shab__global-settings-btn").add($(".shab__global-settings"))).size() == 0 ) {
            if( $(".shab__global-settings-btn").hasClass('active') ) {
                closeOptions();
            }
        }
    });

    function openOptions() {
        if( "openOptionsTimeLine__close" in animations ) { animations.openOptionsTimeLine__close.pause() }
        $(" .shab__global-settings").css({
            display: "block",
            opacity: 0,
            transform: "scale(0.8, 0.8)"
        });

        if( !("openOptionsTimeLine" in animations) ) {
            animations.openOptionsTimeLine = (new TimelineLite()).append([
                TweenMax.to($(".shab__global-settings"), 0.5,
                    {css:{transform: "scale(1, 1)" }}),
                TweenMax.to($(".shab__global-settings"), 0.3,
                    {css:{ opacity: 1 }})
            ]);
        } else {
            animations.openOptionsTimeLine.restart();
        }

        $( ".shab__global-settings-btn" ).addClass('active');
    }

    function closeOptions() {
        if( "openOptionsTimeLine" in animations ) { animations.openOptionsTimeLine.pause() }
        if( !("openOptionsTimeLine__close" in animations) ) {
            animations.openOptionsTimeLine__close = (new TimelineLite()).append([
                TweenMax.to($(".shab__global-settings"), 0.5,
                    {css:{ transform: "scale(0.8, 0.8)"}, onComplete: handlerComplete}),
                TweenMax.to($(".shab__global-settings"), 0.5,
                    {css:{ opacity: 0 }})
            ]);
        } else {
            animations.openOptionsTimeLine__close.restart();
        }
        function handlerComplete() {
            $(".shab__global-settings").css('display', 'none');
        }

        $( ".shab__global-settings-btn" ).removeClass('active');
    }

    $('#text-encoding-server').selectpicker();

    //Кодировка на хосте
    $('#text-encoding-server').selectpicker('val', shablonizator.settings.find('text_encoding_server').text());

    $('#text-encoding-server').on('change', function(){
        shablonizator.textEncodingServer = $(this).val();
        shablonizator.settings.find('text_encoding_server').text($(this).val());
        shablonizator.save_g_settings();
    });

    //Если sass, scss или less лежит в другой папке
    $('#shab__global-settings-rerouting-pattern').val( shablonizator.settings.find('rerouting_preprocessor_style pattern').text() );

    $('#shab__global-settings-rerouting-relative-folder').val( shablonizator.settings.find('rerouting_preprocessor_style relative_folder').text() );

    $('#shab__global-settings-rerouting-pattern').on('change', function(){
        shablonizator.settings.find('rerouting_preprocessor_style pattern').text($(this).val());
        if( liveStyle !== undefined ) {
            liveStyle._options.relativeFoldersForPreprocessorFiles[0].pattern = $(this).val();
        }
    });

    $('#shab__global-settings-rerouting-relative-folder').on('change', function(){
        shablonizator.settings.find('rerouting_preprocessor_style relative_folder').text($(this).val());
        if( liveStyle !== undefined ) {
            liveStyle._options.relativeFoldersForPreprocessorFiles[0].relativeFolder = $(this).val();
        }
    });

    $('#shab__global-settings-rerouting-pattern, #shab__global-settings-rerouting-relative-folder').on('blur', function(){
        shablonizator.save_g_settings();
    });
});

/****************************************************/
/*Менеджер страниц и визуализатор*/
/****************************************************/
$(document).ready(function(){
    pageManagerVisualizator = new modules.pageManagerVisualizator($("#wrap_iframe"), {
        urlXML: "sb/page-manager-visualizator.xml",
        nameIFrame: "PP_iframe",
        pixelsScrollableInSeconds: 2000,
        minWOuterScroll: 23,
        minHOuterScroll: 23,
        minWDraggable: 15,
        minHDraggable: 15,
        minWIFrame: 320,
        minHIFrame: 480,
        responsiveToMovementOfTheCursorInAConfinedSpace: false,
        gorizontalFixation: "center",
        verticalFixation: "top"
    });
    
    //Добавляем страницу
        //Добавить страницу после клика
        $('#modal-pp-add-page-href .btn-select').on('click', function(event){
            handlerAddPage( $('#modal-pp-add-page-href .pmv-href').val() );
            $('#modal-pp-add-page-href .modal').modal('hide');
        });
        $('.shab__top-menu .add_page_href').on('click', function(){
            $('#modal-pp-add-page-href .pmv-href').val( window[pageManagerVisualizator._options.nameIFrame].window.location.href );
            $('#modal-pp-add-page-href .modal').modal('show');
        });        
        //Выделение
        $('#modal-pp-add-page-href').on('shown.bs.modal', function(e){
            var input = $('#modal-pp-add-page-href .pmv-href');
            input.get(0).focus();
            input.get(0).setSelectionRange(0, input.val().length);
        });
    
    function handlerAddPage(href){
        pageManagerVisualizator.addPage( href );
    }
    
    //Удаляем страницу
    $('.shab__top-menu .select-page.selectpicker').on('selectpicker.refresh', function(){//Чтоб при клике на крестике не переключалась страница
        $('.shab__top-menu .select-page .delete').on('click', function(e){
            e.stopPropagation();
            if( confirm( "Точно удалить!" ) ) {
                pageManagerVisualizator.removePage( $(this).attr('data-href') );
            }
            return false;
        });
    });
    
    //Сменяем страницу
    $('.shab__top-menu').on('change', ' .select-page.selectpicker', function() {
        pageManagerVisualizator.selectPage( $('.shab__top-menu .select-page option:selected').first().attr('data-href') );
    });
    
    //Обновляем страницу
    $('.pmv__update-iframe-btn').on('click', pageManagerVisualizator.reloadPage);
    
    //Обновляем список страниц в верхнем меню
    pageManagerVisualizator.$container.on("pmv.create.pagelist pmv.change.pagelist", function(){
        var pageList = pageManagerVisualizator._options.pageList;
        var $selectPage = $('.shab__top-menu .select-page.selectpicker');
        
        $selectPage.empty();
        for( var href in pageList ) {
            if( pageList[href].active ) {
                $selectPage.append('<option selected="selected" data-href="'+href+'" data-content="<span data-href=\''+href+'\' class=\'delete glyphicon glyphicon-remove\'></span>&nbsp&nbsp<span class=\'option\'>'+href+'</span>"></option>');
            } else {
                $selectPage.append('<option data-href="'+href+'" data-content="<span data-href=\''+href+'\' class=\'delete glyphicon glyphicon-remove\'></span>&nbsp&nbsp<span class=\'option\'>'+href+'</span>"></option>');
            }
        }
        $selectPage.selectpicker( "refresh" );
        $selectPage.trigger( "selectpicker.refresh" );
    });
    
    //При загрузке iFrame скрываем всё окно шаблонизатора и показываем анимацию загрузки

    pageManagerVisualizator.$container.on({
        "pmv.prepaste.iframe": function() {
            $( "#loading" )
                .css({width: "100%", height: "100%"})
                .addClass( "show" );
        },
        "pmv.load.iframe": function() {
            $( "#loading" ).removeClass( "show" );
            setTimeout(function() {
                $( "#loading" ).css({width: "0", height: "0"});
            }, 500);
        }
    });

    //Чтобы невылазил справа текст адреса страницы
    $('.shab__top-menu').on('refreshed.bs.select', ".select-page.selectpicker", refreshSelectpicker);
    setTimeout(refreshSelectpicker, 1);
    function refreshSelectpicker() {
        var $container = $(".shab__top-menu .bootstrap-select.select-page");
        var $containerCurrentPage = $container.find(" .filter-option");
        var $currentPage = $containerCurrentPage.find(" .option");

        $currentPage.attr("style", "");
        $currentPage.closest(".container-current-page").attr("style", "");

        var w = ($containerCurrentPage.offset().left + $containerCurrentPage.outerWidth()) - $currentPage.offset().left;
        var delta = w - $currentPage.outerWidth();
        if( delta < 0 ) {
            if( !$currentPage.closest(".container-current-page").size() ) {
                $currentPage.wrap("<span class='container-current-page' style='width: "+ (w) +"px; overflow: hidden; display: inline-block;'></span>");
            } else {
                $currentPage.closest(".container-current-page").css({width: w +"px", overflow: "hidden", display: "inline-block"});
            }
            $currentPage.css({position: "relative", left: delta + "px"});
        }
    }
    
    pageManagerVisualizator._create();
});

/****************************************************/
/*Пиксель перфект*/
/****************************************************/
$(document).ready(function(){
    pixelPerfect = new modules.pixelPerfect($("#wrap_iframe .pmv-fitting-wrap"), {
        urlXML: "sb/pixel-perfect.xml",
        dirScrins: "design",
        dirThumbnail: "sb/design-thumbnails",
        widthThumbnail: 240,
        nameIFrame: "PP_iframe",
        $screenshotsManipulatorContainer: $('.shab-general-window__bottom'),
        thumbnailScrollAmount: 100,
        mainWindowScrollAmount: 100
    });
    
    pageManagerVisualizator.$container.on( "pmv.load.iframe", function(){
        pixelPerfect._destroy();
        pixelPerfect._create( pageManagerVisualizator.lastLoadPage );

        if( "$session" in pixelPerfect ) {
            pixelPerfect.screenshotsManipulator.refresh( pixelPerfect.$session, pixelPerfect.$listAllScrins, pixelPerfect.currentPage );
            handlerRefreshSelectSize();
        }
    });
    
    //Добавляем разрешение
    $('#modal-pp-add-group .btn-select').on('click', function(event){
        var hasError = false;
        
        //Фильтрация ввода
        if( !( /^[1-9]\d{1,3}$/gim.test( $('#modal-pp-add-group .pp-width').val() ) ) ) {
            hasError = true;
            $('#modal-pp-add-group .pp-width').closest( ".input-group" ).addClass( "has-error" );
        } else {
            $('#modal-pp-add-group .pp-width').closest( ".input-group" ).removeClass( "has-error" );
        }
        if( !(/^[1-9]\d{1,3}$/gim.test( $('#modal-pp-add-group .pp-height').val() ) ) ) {
            hasError = true;
            $('#modal-pp-add-group .pp-height').closest( ".input-group" ).addClass( "has-error" );
        } else {
            $('#modal-pp-add-group .pp-height').closest( ".input-group" ).removeClass( "has-error" );
        }
        
        if( hasError ) {
            $('#modal-pp-add-group .alert-input-error').css({display: "block"});
        } else {
            $('#modal-pp-add-group .alert-input-error').css({display: "none"});
        }
        
        if( !hasError ) {
            pixelPerfect.addSize( $('#modal-pp-add-group .pp-width').val(), $('#modal-pp-add-group .pp-height').val() );
            $('#modal-pp-add-group .modal').modal('hide');
        }
    });
    $('.shab__top-menu .add-group').on('click', function(){
        $('#modal-pp-add-group .modal').modal('show');
    });        
    
    //Удаляем разрешение
    $('.shab__top-menu .select-group.selectpicker').on('selectpicker.refresh', function(){//Чтоб при клике на крестике не переключалась страница
        $('.shab__top-menu .select-group .delete').on('click', function(e){
            e.stopPropagation();
            if( confirm( "Точно удалить!" ) ) {
                pixelPerfect.removeSize( $(this).attr( "data-width" ), $(this).attr( "data-height" ) );
            }
            return false;
        });
    });
    
    //Сменяем разрешение
    $('.shab__top-menu').on('change', ' .select-group', function() {
        var $optionSelected = $('.shab__top-menu .select-group option:selected');
        pixelPerfect.selectSize( $optionSelected.attr('data-width'), $optionSelected.attr('data-height') );
    });
    
    //Обновляем список разрешений в верхнем меню
    $('.shab__top-menu .select-group.selectpicker').selectpicker();
    pixelPerfect.$container.on("pp.change.sizelist pp.create.sizelist", function(){
        handlerRefreshSelectSize();
    });
    pixelPerfect.screenshotsManipulator.$container.on("sm.change_post_set_session", function(){
        handlerRefreshSelectSize();
    });
    function handlerRefreshSelectSize() {
        var pageList = pageManagerVisualizator._options.pageList;
        var $selectSize = $('.shab__top-menu .select-group.selectpicker');
        $selectSize.empty();
        pixelPerfect.$session.find( "page[href='"+( pageManagerVisualizator.lastLoadPage )+"'] media[width][height]" ).each(function(){
            if( $(this).attr( "active" ) == "true" ) {
                $selectSize.append('<option selected="selected" data-width="'+( $(this).attr( "width" ) )+'" data-height="'+( $(this).attr( "height" ) )+'" data-content="<span data-width=\''+( $(this).attr( "width" ) )+'\' data-height=\''+( $(this).attr( "height" ) )+'\' class=\'delete glyphicon glyphicon-remove\'></span>&nbsp;&nbsp;<span>'+( $(this).attr( "width" ) + "x" + $(this).attr( "height" ) )+'</span>"></option>');
            } else {
                $selectSize.append('<option data-width="'+( $(this).attr( "width" ) )+'" data-height="'+( $(this).attr( "height" ) )+'" data-content="<span data-width=\''+( $(this).attr( "width" ) )+'\' data-height=\''+( $(this).attr( "height" ) )+'\' class=\'delete glyphicon glyphicon-remove\'></span>&nbsp;&nbsp;<span>'+( $(this).attr( "width" ) + "x" + $(this).attr( "height" ) )+'</span>"></option>');
            }
        });
        $selectSize.selectpicker( "refresh" );
        $selectSize.trigger( "selectpicker.refresh" );
    }
    //Показать "манипулятор скриншотов"
    $('.pp__open-btn').on('click', function(){
        pixelPerfect.screenshotsManipulator.toggle( pixelPerfect.$session );
    });
    
        //Обновить кнопку
        pixelPerfect.screenshotsManipulator.$container.on({
            "sm.show": function(){
                $('.pp__open-btn').addClass( "active" );
            },
            "sm.hide": function(){
                $('.pp__open-btn').removeClass( "active" );
            }
        });
    
    //Показать верстку или скрины или 50 на 50
    $('.pp__verstka-btn').on('click', function(){
        pixelPerfect.showPageProofsOrDesign(0);
    });
    $('.pp__50p-btn').on('click', function(){
        pixelPerfect.showPageProofsOrDesign(1);
    });
    $('.pp__design-btn').on('click', function(){
        pixelPerfect.showPageProofsOrDesign(2);
    });
    
        //Горячие клавишы
        pageManagerVisualizator.$container.on( "pmv.load.iframe", function(){
            $('body')
            .add( $('#'+(pageManagerVisualizator._options.nameIFrame)).contents().find("body") )
            .on('keydown', function(e) {
                if(e.which == 81 && e.ctrlKey && !e.shiftKey && !e.altKey)//(e.which == 65 || e.which == 83 || e.which == 68)
                {
                    if($('.pp__50p-btn, .pp__design-btn').hasClass('active'))
                    {
                        pixelPerfect.showPageProofsOrDesign(0);
                    }
                    else
                    {
                        pixelPerfect.showPageProofsOrDesign(1);
                    }
                    
                    e = e || window.e; if (e.stopPropagation) {e.stopPropagation()} else {e.cancelBubble = true} e.preventDefault();
                }
            });
        });
    
        //Обновить кнопки
        pixelPerfect.$container.on("pp.changepageproofsordesign", function(e, show){
            $('.pp-verstka-design .btn').removeClass( "active btn-primary btn-success btn-info btn-warning btn-danger" ).addClass( "btn-default" );
            switch( show ){
                case 0:
                    $('.pp__verstka-btn').removeClass( "btn-default" ).addClass( "active btn-primary" ); 
                    break;
                case 1: 
                    $('.pp__50p-btn').removeClass( "btn-default" ).addClass( "active btn-warning" );
                    break;
                case 2:
                    $('.pp__design-btn').removeClass( "btn-default" ).addClass( "active btn-danger" );
                    break;
            }
        });
});

$(document).ready(function(){
    $('#testovaya_ssilka').on('click', function(event){

    });
});

/****************************************************/
/*Вспомогательная хрень*/
/****************************************************/
$(document).ready(function(){
    pageManagerVisualizator.$container.on( "pmv.load.iframe", function(){
        shablonizator.updateBasesUrlPage( pageManagerVisualizator.lastLoadPage );
    });

    //Подсказки
    $("[data-toggle='tooltip']").not($(".gc-wrap [data-toggle='tooltip']")).tooltip();
    $('[data-toggle="popover"]').not($(".gc-wrap [data-toggle='popover']")).popover();
    //==========
});

/***********************************************/
//При уходе со страницы сохраняем сессию
/***********************************************/

window.onbeforeunload = function (e) {
    pageManagerVisualizator._saveSession();
    pixelPerfect._saveSessionAndClearDeletedPages(  pageManagerVisualizator._options.pageList );
    pixelPerfect._saveSession();

    return "+++++++++++++++++++++++++\n |  СОХРАНЕНИЕ СЕССИИ  |\n+++++++++++++++++++++++++";
};