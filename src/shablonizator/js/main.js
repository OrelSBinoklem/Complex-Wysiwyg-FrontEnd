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
        urlXML: "shablonizator/page-manager-visualizator.xml",
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
        //Навигатор по файлам для "менеджера страниц"
        pageManagerVisualizatorFileManager = $('.pp__file-navigator').fileManager('shablonizator/raskritie_papki_pixel_perfect.xml');
        $('.shab__top-menu').on('click', ' .add_page', function(){
            //позакрывать всё остальное в левой части шаблонизатора
            pageManagerVisualizatorFileManager.open({selected: 'files'});
        });
        pageManagerVisualizatorFileManager.on('selected', function(e) {
            handlerAddPage(e[0].url);
        });
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
        urlXML: "shablonizator/pixel-perfect.xml",
        dirScrins: "shablonizator/scrins",
        dirThumbnail: "shablonizator/miniatyrki",
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

/****************************************************/
/*Редактор*/
/****************************************************/
$(document).ready(function(){
    editor = new modules.editor($('.shab-general-window__bottom'), {
        urlXML: "shablonizator/editor.xml",
        snippetsFolder: 'shablonizator/js/ace/snippets/',
        defTheme: "ace/theme/monokai",
        fileManagerXML: "shablonizator/raskritie_papki_editor.xml",
        $fileManagerContainer: $('.shab-general-window__bottom'),
        showSnippetsForTheCurrentLanguageOnly: true,
        additionalSnippetsForLanguages: {
            "ace/mode/html": ["ace/mode/css", "ace/mode/javascript"],
            "ace/mode/javascript": ["ace/mode/html", "ace/mode/css"],
            "ace/mode/php": ["ace/mode/html", "ace/mode/css", "ace/mode/javascript"]
        },
        snippetsMenuScrollAmount: 100
    });
    
    editor._create();
});

/****************************************************/
/*Редактор стилей на лету*/
/****************************************************/
$(document).ready(function(){
    liveStyle = new modules.liveStyle($('.shab-general-window__bottom'), {
        searchPreprocessorFilesInCurrentFolder: true,
        relativeFoldersForPreprocessorFiles: [{
            pattern: shablonizator.settings.find('rerouting_preprocessor_style pattern').text(),
            ignoreCase: true,
            relativeFolder: shablonizator.settings.find('rerouting_preprocessor_style relative_folder').text()
        }]
    });
    liveStyle._create();

    var lastPage = false;
    var selectFile = "";
    var isInitLiveStyle = false;
    var isChanged = false;
    var isProcessed = false;

    createMenuLiveStyleForEditor();

    editor.insertFile( "document", "", "html" );
    editor.insertFile( "processingjavascript", "", "javascript" );

    $( ".shab-ls__btn-file-document" ).on( "click", handlerSelectDocument );
    $( ".shab-ls__btn-file-ready-js" ).on( "click", handlerSelectJSReady );
    $( ".shab-ls__menu-ready-files" ).on( "click", ".shab-ls__menu-style-files li", handlerSelectStyleFiles );

    pageManagerVisualizator.$container.on( "pmv.load.iframe", function(){
        isChanged = false;
        isProcessed = false;
        liveStyle._parseStyleFilesFromDocument( $('#'+(pageManagerVisualizator._options.nameIFrame)).contents(), pageManagerVisualizator.lastLoadPage );
        liveStyle._downloadMissingFilesFromImports__allFromLinkTags( pageManagerVisualizator.lastLoadPage );

        //Обновляем файл "Document"
        if( lastPage === false || lastPage != pageManagerVisualizator.lastLoadPage ) {
            lastPage = pageManagerVisualizator.lastLoadPage;
        }

        editor.files["insert:document"].session.setValue( $('#'+(pageManagerVisualizator._options.nameIFrame)).contents().find("html").html() );
        synchronizationEditorFilesWithFilesFromTheLivingStyles();
        if( !isInitLiveStyle ) {
            editor.selectFile( "insert:document" );
            selectFile = "insert:document";
        }

        refreshMenuStileFiles();
        refreshMenuActiveItem();

        isInitLiveStyle = true;
    });

    editor.editor.on( "changeSession", function () {
        if( selectFile !== editor.currentFile ) {
            selectFile = editor.currentFile;
            refreshMenuActiveItem();

            if( selectFile == "insert:document" || selectFile === null ) {
                editor.editor.setReadOnly(true);
            } else {
                editor.editor.setReadOnly(false);
            }
        }
    });

    editor.editor.on( "change", handlerEditorChange);

    //Создаём дополнительный вызов "processTheNewCodeInTheEditor" с задержкой потому что в редакторе есть баг - если быстро менять цифру зажав Ctrl + стрелки то цифра меняеться но событие change несрабатывает
    var handlerEditorChange__IdTimeout = null;
    function handlerEditorChange() {
        processTheNewCodeInTheEditor();

        if( handlerEditorChange__IdTimeout !== null ) {
            clearTimeout( handlerEditorChange__IdTimeout );
        }
        handlerEditorChange__IdTimeout = setTimeout( processTheNewCodeInTheEditor, 200 );
    }

    function processTheNewCodeInTheEditor() {
        var currentURL;
        if ((currentURL = /^url:(.+)$/gm.exec(editor.currentFile)) !== null) {
            currentURL = currentURL[1];
            if( currentURL in liveStyle.files ) {

                liveStyle._downloadMissingFilesFromImports__allFromLinkTags( pageManagerVisualizator.lastLoadPage );
                liveStyle.files[currentURL].code = editor.files[editor.currentFile].editCode;
                liveStyle.files[currentURL].codeLineComment = liveStyle._insertCommentSrcLine( currentURL, liveStyle.files[currentURL].fileExtension, editor.files[editor.currentFile].editCode );

                synchronizationEditorFilesWithFilesFromTheLivingStyles();

                refreshMenuStileFiles();
                refreshMenuActiveItem();

                handlerChangeStyle();
            }
        }
    }

    function createMenuLiveStyleForEditor() {
        //Скрываем кнопку "открыть файл в редакторе" (в редакторе будут редактироваться только файлы нужные для "Редактор стилей на лету")
        $( ".e__container .e__btn-file-manager" ).css({display: "none"});
        //Добавляем кнопки "Document" и "Ready JS"
        $( ".e__menu-row" ).append(
            "<div class=\"btn-group\">" +
                "<button class='btn btn-sm btn-default shab-ls__btn-file-document'>Document</button>" +
                "<button class='btn btn-sm btn-default shab-ls__btn-file-ready-js'>Ready JS</button>" +
            "</div>"
        );
        $( ".e__menu .container-fluid" ).append(
            "<div class='row shab-ls__menu-ready-files'></div>"
        );
    }

        function refreshMenuStileFiles() {
                //Выводим меню с загруженными файлами стилей из текущей страницы
                //Формируем dropdown menu
                var HTML__dropdownMenu = "";
                HTML__dropdownMenu +=
                    '<div class="shab-ls__menu-style-files dropdown">';
                HTML__dropdownMenu +=
                        '<a role="button" data-toggle="dropdown" class="btn btn-block btn-inverse">' +
                        '<span class="text">Ничего не выбрано</span> <span class="caret"></span>' +
                        '</a>';
                HTML__dropdownMenu +=
                        '<ul class="dropdown-menu multi-level" role="menu">';
                for( var i in liveStyle.filesUrlFromLinkTag ) {
                    var file = liveStyle.files[liveStyle.filesUrlFromLinkTag[i]];
                    var url__preprocessor_style__inDocument = liveStyle.filesUrlFromLinkTag[i];
                    var url__style__inDocument;
                    if( "urlCssFileCompileResults" in file ) {
                        url__style__inDocument = file.urlCssFileCompileResults;
                    } else {
                        url__style__inDocument = url__preprocessor_style__inDocument;
                    }
                    HTML__dropdownMenu +=
                            '<li class="dropdown-header">' + url__style__inDocument + '</li>';
                    if( !file.importsPositionAndUrl.length ) {
                        HTML__dropdownMenu +=
                            '<li class="shab-ls__item-document"><a href="#" data-url="' + url__preprocessor_style__inDocument + '">' + url__preprocessor_style__inDocument + '</a></li>';
                    } else {
                        HTML__dropdownMenu +=
                            '<li class="dropdown-submenu shab-ls__item-document">' +
                                '<a tabindex="-1" href="#" data-url="' + url__preprocessor_style__inDocument + '">' + url__preprocessor_style__inDocument + '</a>' +
                                '<ul class="dropdown-menu">';
                        imports__tree( file, 1 );
                        function imports__tree( file, level ) {
                            for( var j in file.importsPositionAndUrl ) {
                                if( file.availableFile ) {
                                    var url__import = file.importsPositionAndUrl[j].url;
                                    HTML__dropdownMenu +=
                                    '<li class="shab-ls__item-import"><a href="#" data-url="' + url__import + '">' + (new Array(level)).join("&mdash; ") + url__import + '</a></li>';
                                    imports__tree( liveStyle.files[url__import], level + 1 );
                                }
                            }
                        }
                        HTML__dropdownMenu +=
                                '</ul>' +
                            '</li>';
                    }
                }
                HTML__dropdownMenu +=
                        '</ul>' +
                    '</div>';
                //Формируем dropdown menu (конец)

                $( ".shab-ls__menu-style-files" ).remove();
                $( ".shab-ls__menu-ready-files" ).prepend( HTML__dropdownMenu );
                editor.refreshPositionMenuAndEditor();
            }

        function refreshMenuActiveItem() {
            $( ".shab-ls__menu-style-files li, .shab-ls__btn-file-document, .shab-ls__btn-file-ready-js" ).removeClass( "active active-children" );
            $( ".shab-ls__menu-style-files > a .text" ).text( "Ничего не выбрано" );
            if( editor.currentFile !== null ) {
                var url;
                if ((url = /^url:(.+)$/gm.exec(editor.currentFile)) !== null) {
                    url = url[1];
                    var $targetItem = $( ".shab-ls__menu-style-files [data-url='" + url + "']" ).parent( "li" );
                    if( $targetItem.size() ) {
                        $( ".shab-ls__menu-style-files > a .text" ).text( url );
                        $targetItem.addClass( "active" );
                        if( $targetItem.hasClass("shab-ls__item-import") ) {
                            $targetItem.closest( ".shab-ls__item-document" ).addClass( "active-children" );
                        }
                    }
                } else if( editor.currentFile == "insert:document" ) {
                    $( ".shab-ls__btn-file-document" ).addClass( "active" );
                } else if( editor.currentFile == "insert:processingjavascript" ) {
                    $( ".shab-ls__btn-file-ready-js" ).addClass( "active" );
                }
            } else {

            }
        }

    function synchronizationEditorFilesWithFilesFromTheLivingStyles() {
        var tempCurrentFile = editor.currentFile;

        /*Грузим в редактор файлы стилей
         и удаляем отключённые с проекта*/
        //Вставляем файлы которых нет
        for( var i in liveStyle.filesUrl ) {
            var file = liveStyle.files[liveStyle.filesUrl[i]];
            var url = liveStyle.filesUrl[i];
            if( (!("availableFile" in file) || file.availableFile) && !("url:" + url in editor.files) ) {
                editor.openFileByURL( url, undefined, file.code );
            }
        }
        //Закрываем лишние файлы
        for( var i in editor.files ) {
            var url;
            if ((url = /^url:(.+)$/gm.exec(editor.files[i])) !== null) {
                url = url[1];
                if( url in liveStyle.files ) {
                    var file = liveStyle.files[url];
                    if( ("availableFile" in file) && !file.availableFile ) {
                        editor.closeFileByURL( url );
                    }
                } else {
                    editor.closeFileByURL( url );
                }
            }
        }
        /*Грузим в редактор файлы стилей
         и удаляем отключённые с проекта (конец)*/

        if( tempCurrentFile != editor.currentFile ) {
            if( tempCurrentFile in editor.files ) {
                editor.selectFile( tempCurrentFile );
            } else {
                editor.selectFile( "insert:document" );
            }
        }
    }

    function handlerSelectDocument() {
        editor.selectFile( "insert:document" );
        selectFile = "insert:document";
    }

    function handlerSelectJSReady() {
        editor.selectFile( "insert:processingjavascript" );
        selectFile = "insert:processingjavascript";
    }

    function handlerSelectStyleFiles(e) {
        if( $(this).is($(e.target).closest("li")) ) {
            var url = $(this).find( "> a" ).attr( "data-url" );
            editor.selectFile( "url:" + url );
            selectFile = "url:" + url;
        }
    }

    /*Обработка изменений стилей в редакторе -компиляция препроцессоров
    и отбражение результата в главном iFrame*/
    function handlerChangeStyle() {
        isChanged = true;
        startCodeProcessing();
    }

    function startCodeProcessing() {
        if( isChanged && !isProcessed ) {
            isProcessed = true;
            isChanged = false;
            codeProcessing();
        }
    }

    function endCodeProcessing() {
        //Хак чтобы небыло переполнения стека функций
        isProcessed = false;
        if( isChanged ) {
            isProcessed = true;//на всяк пожарный
            setTimeout(function() {
                isProcessed = false;
                startCodeProcessing();
            }, 1);
        }
    }

    function codeProcessing() {
        var concateAllStyles = liveStyle.concateAllStyles();
        var concateAllStylesAndPrepared = liveStyle.compileAndReplaceUrlAllStyles( concateAllStyles, pageManagerVisualizator.lastLoadPage, function() {
            var thereIsALinkLessFile = false;
            for( var i in liveStyle.filesUrlFromLinkTag ) {
                var oneConcate = concateAllStyles[liveStyle.filesUrlFromLinkTag[i]];
                var file = liveStyle.files[liveStyle.filesUrlFromLinkTag[i]];
                if (oneConcate.compiledNeeded && !(oneConcate.compiledError)) {
                    if (file.$container.is("link") && oneConcate.fileExtension == "less") {
                        thereIsALinkLessFile = true;
                    }
                }
            }
            if( thereIsALinkLessFile ) {
                liveStyle._deleteStyleTagsCreatedClientLessCompiler( $('#'+(pageManagerVisualizator._options.nameIFrame)).contents() );
            }

            liveStyle._insertCompileCodeInDocument( concateAllStyles );
            liveStyle._saveCssFileCompileResults__deleteMapFile( concateAllStyles );

            endCodeProcessing();
        });
    }
    /*Обработка изменений стилей в редакторе -компиляция препроцессоров
    и отбражение результата в главном iFrame (конец)*/
});

/****************************************************/
/*Генератор кода*/
/****************************************************/

$(document).ready(function(){
    var gcmf__fileManager = $('#gc-filemanager').fileManager('shablonizator/raskritie_papki_gc.xml');
    var gctci__fileManager = $('#gc-filemanager-insert-files').fileManager('shablonizator/raskritie_papki_gc_insert_files.xml');

    generatorCode = new modules.generatorCode($('.gc-wrap'), {
        $helpersContainer: $('#gc-helpers'),
        maxLinesEditorsForTabCopyInsert: 60,
        gcmf__fileManager: gcmf__fileManager,
        mainEditor: editor,
        gctci__fileManager: gctci__fileManager,
        scssCompiller: modules.liveStyle._compilePreprocessorCode,
        basePathGenerators: "generators/",
        formatter: shablonizator.formatter
    });

    //Открыть меню выбора простого модуля
    $( "body" ).on("click click.body.iframe", function (e) {

        if( $(e.target).closest($(".gc__select-generator-btn").add($(".gc__select-generator"))).size() == 0 ) {
            if( $(".gc__select-generator-btn").hasClass('active') ) {
                closeMenu();
            }
        }
    });

    var animations = {};
    $( ".gc__select-generator-btn" ).on("click", function () {
        if( !$(this).hasClass('active') ) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    function openMenu() {
        if( "openOptionsTimeLine__close" in animations ) {
            animations.openOptionsTimeLine__close.pause();
        } else {
            $(" .gc__select-generator").css({
                opacity: 0,
                transform: "scale(0.8, 0.8)"
            });
        }
        $(" .gc__select-generator").css({display: "block"});

        if( !("openOptionsTimeLine" in animations) ) {
            animations.openOptionsTimeLine = (new TimelineLite()).append([
                TweenMax.to($(".gc__select-generator"), 0.5,
                    {css:{transform: "scale(1, 1)" }}),
                TweenMax.to($(".gc__select-generator"), 0.3,
                    {css:{ opacity: 1 }})
            ]);
        } else {
            animations.openOptionsTimeLine.restart();
        }

        $( ".gc__select-generator-btn" ).addClass('active');
    }

    function closeMenu() {
        if( "openOptionsTimeLine" in animations ) { animations.openOptionsTimeLine.pause() }
        if( !("openOptionsTimeLine__close" in animations) ) {
            animations.openOptionsTimeLine__close = (new TimelineLite()).append([
                TweenMax.to($(".gc__select-generator"), 0.5,
                    {css:{ transform: "scale(0.8, 0.8)"}, onComplete: handlerComplete}),
                TweenMax.to($(".gc__select-generator"), 0.5,
                    {css:{ opacity: 0 }})
            ]);
        } else {
            animations.openOptionsTimeLine__close.restart();
        }
        function handlerComplete() {
            $(".gc__select-generator").css('display', 'none');
        }

        $( ".gc__select-generator-btn" ).removeClass('active');
    }

    //Открыть меню выбора простого модуля иди плагина
    $( ".gc__select-generator-btn--html-plus-css" ).on("click", function () {
        if( !$(this).hasClass('active') ) {
            $(this).addClass('active');
            $( ".gc__select-generator-btn--html-plus-css" ).addClass('active');
            $( ".gc__select-generator-btn--plugins" ).removeClass('active');

            $(".gc__select-generator--plugins").removeClass('active')
                .css({display: "none"});
            $(".gc__select-generator--html-plus-css").addClass('active')
                .fadeIn();
        }
    });

    $( ".gc__select-generator-btn--plugins" ).on("click", function () {
        if( !$(this).hasClass('active') ) {
            if( !$(this).hasClass('active') ) {
                $( ".gc__select-generator-btn--html-plus-css" ).removeClass('active');
                $( ".gc__select-generator-btn--plugins" ).addClass('active');

                $(".gc__select-generator--html-plus-css").removeClass('active')
                    .css({display: "none"});
                $(".gc__select-generator--plugins").addClass('active')
                    .fadeIn();
            }
        }
    });

    //Генерация html кода из xml
    $.ajax({
        url: "shablonizator.php",
        type: "POST",
        cache: false,
        data: ({module: 'getfile', dir: "shablonizator/generator-code.xml", text_encoding: 'UTF-8'}),
        async: false,
        success: function(data){
            createMenu( $($.parseXML(data)) );
            $(".gc__select-generator__panel-body").mCustomScrollbar({
                axis: "yx",
                theme: "dark",
                scrollbarPosition: "outside",
                scrollInertia: 100
            });
        }
    });

    function createMenu( $xml ) {
        $(".gc__select-generator--html-plus-css").append( generateMenu( $xml.find("htmlpluscss") ) );
        $(".gc__select-generator--plugins").append( generateMenu( $xml.find("plugins") ) );
    }
    
    function generateMenu( $xml ) {
        var HTML = '';

        var $list = $xml.find(' > *');

        if($list.size() == 0)
        {
            return '';
        }

        HTML += '<ul>';
        $list.each(function(){
            if($(this).get(0).nodeName == 'folder') {
                //Папка
                HTML +=
                '<li class="folder f-close">\
                    <a href="">' + $(this).attr('name') + '</a>\
                    <span class="disclosures">\
                        <i class="fa fa-plus-square-o"></i><i class="fa fa-minus-square-o"></i>\
                        <i class="fa fa-folder"></i><i class="fa fa-folder-open"></i>\
                    </span>\
                    ' + generateMenu($(this)) + '\
                </li>';
            } else {
                //Модуль
                if( $(this).find(' > *').size() ) {
                    HTML +=
                        '<li class="module f-close">\
                            <a href="'+$(this).attr('url')+'">' + $(this).attr('name') + '</a>\
                            <span class="disclosures">\
                                <i class="fa fa-plus-square-o"></i><i class="fa fa-minus-square-o"></i>\
                                <i class="fa fa-th-large"></i>\
                            </span>\
                            ' + generateMenu($(this)) + '\
                        </li>';
                } else {
                    HTML +=
                        '<li class="module f-close">\
                            <a href="'+$(this).attr('url')+'">' + $(this).attr('name') + '</a>\
                            <span class="disclosures">\
                                <i class="fa fa-square"></i>\
                            </span>\
                        </li>';
                }
            }
        });
        HTML += '<div class="clear"></div></ul>';
        return HTML;
    }

        //Выделение линии группы на которую навели вместе с её содержимым
        $(".gc__select-generator").on({
            mouseover: function(e){
                $(".gc__select-generator").find(' .f-open').removeClass('hover');
                $(this).addClass('hover');
                e.stopPropagation();
            },
            mouseout: function(e){
                $(".gc__select-generator").find(' .f-open').removeClass('hover');
                e.stopPropagation();
            }
        }, ' .f-open');

        //Развернуть
        $(".gc__select-generator").on('click', ' .disclosures > .fa-plus-square-o', handlerOpenAndCloseSiblings);

        //Свернуть
        $(".gc__select-generator").on('click', ' .f-open > .disclosures > .fa-minus-square-o', handlerClose);

        function handlerOpenAndCloseSiblings(){
            handlerOpen.call(this);

            $(this)
            .closest('.f-open')
            .siblings(".f-open")
            .each(function() {
                handlerClose.call(this);
            });
        }

        function handlerOpen() {
            var $item = $(this).closest('.f-close');

            //Для плавного появления
            $item.css({height: Math.round($item.outerHeight())});

            $item.removeClass('f-close').addClass('f-open').addClass('f-visible');
            $item.find(' > ul').css({display: 'block'});

            var hA = Math.round($item.find(' > a').outerHeight(true));
            var hUl = Math.round($item.find(' > ul').outerHeight());
            $item.stop().animate({height: hA + hUl + 10}, 500, function(){//.file-manager .f-open > a {margin-bottom: 10px;}
                $item.css({height: 'auto'});
            });
        }

        function handlerClose() {
        var $item = $(this).closest('.f-open');
        $item.find(' > ul').css({display: 'block'});
        $item.addClass('f-visible').removeClass('f-open').addClass('f-close');

        //Для плавного скрытия
        var hA = Math.round($item.find(' > a').outerHeight(true));
        var hUl = Math.round($item.find(' > ul').outerHeight());
        $item.stop().animate({height: 20}, 500, function(){//Высота одной строки папки .file-manager .f-open > a {margin-bottom: 10px;}
            $item.css({height: 'auto'});
            $item.find(' > ul').css({display: 'none'});
            $item.removeClass('f-visible');
        });
    }

        //Развернуть весь первый уровень
        $(".gc__select-generator__uncollapse").on('click', function() {
            $(".gc__select-generator-level-1.active > ul > .f-close")
                .each(function() {
                    handlerOpen.call(this);
                });
        });

        //Свернуть всё
        $(".gc__select-generator__collapse").on('click', function() {
        $(".gc__select-generator-level-1.active .f-open")
            .each(function() {
                handlerClose.call(this);
            });
    });

    //Открыть закрыть генератор
    $( ".gc__open-generator-btn" ).on("click", function () {
        if( !$(this).hasClass('active') ) {
            generatorCode.open();
        } else {
            generatorCode.close();
        }
    });

    $('.gc-wrap').on({
        "gc.open": function () {
            $( ".gc__open-generator-btn" ).addClass('active');
        },
        "gc.close": function () {
            $( ".gc__open-generator-btn" ).removeClass('active');
        }
    });

    //Выбираем генератор кода
    $('.gc__select-generator').on('click', ' .gc__select-generator-level-1 a', function(e){
        e.preventDefault();

        closeMenu();

        if(generatorCode.generatorFolder !== $(this).attr('href'))
        {
            generatorCode.createAndRefreshGenerator($(this).attr('href'));
        }
        generatorCode.open();
    });

    generatorCode._create();
});

$(document).ready(function(){
    $('#testovaya_ssilka').on('click', function(event){
            /*modules.liveStyle._compilePreprocessorCode("\n\
.class1 {\n\
    .class2 {\n\
        color: red;\n\
        .class3 {\n\
            color: green;\n\
        }\n\
    }\n\
}\n\
", "less", true, function ( error__ajax, error__compile, css, map ) {
                console.log( error__ajax, error__compile, css );
            });*/

            /*modules.liveStyle._compilePreprocessorCode("\n\
.class1\n\
    .class2\n\
        color: red\n\
        .class3\n\
            color: green\n\
", "sass", true, function ( error__ajax, error__compile, css, map ) {
                console.log( error__ajax, error__compile, css, map );
        });*/


            /*modules.liveStyle._compilePreprocessorCode("\n\
.class1 {\n\
    color: red;\n\
    .class2 {\n\
        color: blue;\n\
    }\n\
}\n\
", "scss", true, function ( error__ajax, error__compile, css, map ) {
                console.log( error__ajax, error__compile, css, map );
        });*/
    });
});

/****************************************************/
/*Вспомогательная хрень*/
/****************************************************/
$(document).ready(function(){
    pageManagerVisualizator.$container.on( "pmv.load.iframe", function(){
        shablonizator.updateBasesUrlPage( pageManagerVisualizator.lastLoadPage );
        /*console.log("shablonizator.base_url:"+shablonizator.base_url);
        console.log("shablonizator.base_url_full:"+shablonizator.base_url_full);
        console.log("shablonizator.base_url_page:"+shablonizator.base_url_page);
        console.log("shablonizator.base_url_page_full:"+shablonizator.base_url_page_full);*/
        /*if( /rv\:11/.test(navigator.userAgent) ) {
            function preventDefault(e) {
                e = e || window.event;
                if (e.preventDefault)
                    e.preventDefault();
                e.returnValue = false;
            }
            window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
            //ВСТАВИТЬ НЕНАСТОЯЩИЙ БЛОК А ФИКТИВНЫЙ И ЕГО ИСПОЛЬЗОВАТЬ
            $("body").append( '<div class="csif-fix-animate"></div>' );
            var _mouseWheelAnimated = false;
            var _tempWheelAnimated = 0;
            $('body').on('wheel', function(e){
                var deltaY = e.originalEvent.deltaY || -1 * e.originalEvent.wheelDelta;

                topScroll = $(window).scrollTop();
                if( _mouseWheelAnimated ) {
                    //Если пользователь резко начал крутить в другую сторону
                    if( sign(_tempWheelAnimated - topScroll) !== sign(deltaY) ) {
                        _tempWheelAnimated = topScroll + deltaY;
                    } else {
                        _tempWheelAnimated += deltaY;
                    }
                } else {
                    _tempWheelAnimated = topScroll + deltaY;
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

                _mouseWheelAnimated = true;

                $(" .csif-fix-animate").css({top: topScroll});
                $(" .csif-fix-animate").stop().animate({top: _tempWheelAnimated},
                    {
                        duration: 100,
                        easing: "linear",
                        complete: function(){
                            $(window).scrollTop(_tempWheelAnimated);
                            _mouseWheelAnimated = false;
                        },
                        step: function(now,fx){
                            $(window).scrollTop(now);
                        }
                    });
            });
        }*/
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
    //NavigatorFiles.savePapkiAllNavigators();
    pageManagerVisualizator._saveSession();
    pixelPerfect._saveSessionAndClearDeletedPages(  pageManagerVisualizator._options.pageList );
    pixelPerfect._saveSession();
    editor._saveSession();

    //Остались ли несохранённые файлы в редакторе
    var countNoSaveFiles = 0;
    for(var id in editor.files)
    {
        var file = editor.files[id];
        if(file.loadCode !== file.editCode)
        {
            countNoSaveFiles++;
        }
    }

    if(countNoSaveFiles === 1)
    {
        return "+++++++++++++++++++++++++\n |  ЕСТЬ НЕСОХРАНЁННЫЙ ФАЙЛ!  |\n+++++++++++++++++++++++++";
    }
    else if(countNoSaveFiles > 1)
    {
        return "++++++++++++++++++++++++++\n |  ЕСТЬ НЕСОХРАНЁННЫЕ ФАЙЛЫ!  |\n++++++++++++++++++++++++++";
    }
    //-----

    return "+++++++++++++++++++++++++\n |  СОХРАНЕНИЕ СЕССИИ  |\n+++++++++++++++++++++++++";
};