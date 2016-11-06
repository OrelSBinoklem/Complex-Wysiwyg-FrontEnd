(function($){//Модули: getfile, setfile, .xml(), malihu-custom-scrollbar

var defaultOptions = {
    urlXML: "sb/editor.xml",
    snippetsFolder: 'sb/js/ace/snippets/',
    defTheme: "ace/theme/monokai",
    fileManagerXML: "sb/raskritie_papki_editor.xml",
    $fileManagerContainer: undefined,//$('#editor-file-manager'),
    showSnippetsForTheCurrentLanguageOnly: true,
    additionalSnippetsForLanguages: {
        "ace/mode/html": ["ace/mode/css", "ace/mode/javascript"],
        "ace/mode/javascript": ["ace/mode/html", "ace/mode/css"],
        "ace/mode/php": ["ace/mode/html", "ace/mode/css", "ace/mode/javascript"]
    },
    snippetsMenuScrollAmount: 100
};

var editor = function($container, options) {
    this._options = options;
    var ____ = this;
    ____.$container = $container;

    //Редактор
    require("ace/ext/emmet");
    require("ace/ext/elastic_tabstops_lite");
    require("ace/ext/keybinding_menu");
    require("ace/ext/searchbox");
    require("ace/ext/settings_menu");
    require("ace/ext/spellcheck");
    require("ace/ext/split");
    require("ace/ext/static_highlight");
    require("ace/ext/statusbar");
    require("ace/ext/textarea");
    require("ace/ext/whitespace");
    require("ace/ext/language_tools");

    ____.modelist = require("ace/ext/modelist");

    ____._options.$fileManagerContainer.append( '<div class="e__file-navigator"></div>' );
    ____.fileManager = ____._options.$fileManagerContainer.find( " .e__file-navigator" ).fileManager( ____._options.fileManagerXML );

    this._create = function() {
        $container.append( '<div class="e__container"><div class="e__ace-editor"></div></div>' );

        //Верхнее меню
        $container.find( " .e__container" ).append('\
        <div class="e__menu twitter-bootstrap-3">\
            <div class="container-fluid">\
                <div class="row e__menu-row">\
                    <a href="#" class="btn btn-default btn-sm e__btn-options"><span class="glyphicon glyphicon-cog"></span></a>\
                    <a href="#" class="btn btn-default btn-sm e__btn-file-manager"><span class="fa fa-folder-open "></span></a>\
                    <div class="btn-group">\
                        <a href="#" class="btn btn-default btn-sm e__btn-undo disabled"><span class="fa fa-undo"></span></a>\
                        <a href="#" class="btn btn-default btn-sm e__btn-rendo disabled"><span class="fa fa-repeat"></span></a>\
                    </div>\
                    <div class="btn-group">\
                        <a href="#" class="btn btn-default btn-sm e__btn-save disabled"><span class="glyphicon glyphicon-floppy-disk"></span></a>\
                        <a href="#" class="btn btn-default btn-sm e__btn-save-auto">auto</a>\
                        <a href="#" class="btn btn-default btn-sm e__btn-auto-load">load</a>\
                    </div>\
                    <div class="btn-group">\
                        <a href="#" class="btn btn-default btn-sm e__btn-snippets disabled">{<i class="fa fa-scissors"></i>}</a>\
                        <a href="#" class="btn btn-default btn-sm e__btn-edit-snippet disabled"><span class="fa fa-pencil-square-o"></span></a>\
                    </div>\
                </div>\
            </div>\
        </div>\
        \
        <div class="e__snippets twitter-bootstrap-3">\
            <div class="e__mode-wrap">\
                <div class="scroll-wrap">\
                    <div class="list-group">\
                      \
                    </div>\
                </div>\
            </div>\
            <div class="e__snippet-wrap">\
                <div class="e__scroll-wrap">\
                    <div class="list-group">\
                      \
                    </div>\
                </div>\
            </div>\
        </div>\
        \
        <div class="e__options twitter-bootstrap-3">\
            <div class="panel panel-default">\
                <div class="panel-heading">\
                    <h3 class="panel-title">Настройки редактора</h3>\
                </div>\
                <div class="panel-body">\
                    <h4>Тема: </h4>\
                    <select class="e__theme" size="1" class="selectpicker">\
                        <optgroup label="Bright">\
                            <option value="ace/theme/chrome">Chrome</option>\
                            <option value="ace/theme/clouds">Clouds</option>\
                            <option value="ace/theme/crimson_editor">Crimson Editor</option>\
                            <option value="ace/theme/dawn">Dawn</option>\
                            <option value="ace/theme/dreamweaver">Dreamweaver</option>\
                            <option value="ace/theme/eclipse">Eclipse</option>\
                            <option value="ace/theme/github">GitHub</option>\
                            <option value="ace/theme/solarized_light">Solarized Light</option>\
                            <option value="ace/theme/textmate" selected="selected">TextMate</option>\
                            <option value="ace/theme/tomorrow">Tomorrow</option>\
                            <option value="ace/theme/xcode">XCode</option>\
                        </optgroup>\
                        <optgroup label="Dark">\
                            <option value="ace/theme/ambiance">Ambiance</option>\
                            <option value="ace/theme/chaos">Chaos</option>\
                            <option value="ace/theme/clouds_midnight">Clouds Midnight</option>\
                            <option value="ace/theme/cobalt">Cobalt</option>\
                            <option value="ace/theme/idle_fingers">idleFingers</option>\
                            <option value="ace/theme/kr_theme">krTheme</option>\
                            <option value="ace/theme/merbivore">Merbivore</option>\
                            <option value="ace/theme/merbivore_soft">Merbivore Soft</option>\
                            <option value="ace/theme/mono_industrial">Mono Industrial</option>\
                            <option value="ace/theme/monokai">Monokai</option>\
                            <option value="ace/theme/pastel_on_dark">Pastel on dark</option>\
                            <option value="ace/theme/solarized_dark">Solarized Dark</option>\
                            <option value="ace/theme/terminal">Terminal</option>\
                            <option value="ace/theme/tomorrow_night">Tomorrow Night</option>\
                            <option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option>\
                            <option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option>\
                            <option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option>\
                            <option value="ace/theme/twilight">Twilight</option>\
                            <option value="ace/theme/vibrant_ink">Vibrant Ink</option>\
                        </optgroup>\
                    </select>\
                    <h4>Размер шрифта: </h4>\
                    <select class="e__fontsize" size="1" class="selectpicker">\
                        <option value="10px">10px</option>\
                        <option value="12px" selected="selected">12px</option>\
                        <option value="14px">14px</option>\
                        <option value="18px">18px</option>\
                        <option value="24px">24px</option>\
                    </select>\
                    <h4>Переброс длинных строк</h4>\
                    <div class="e__soft-wrap btn-group btn-toggle-one-color" data-toggle="buttons">\
        				<label class="btn btn-default active" data-btn-color="default">\
        					<input type="radio" name="show_hidden" value="free" checked="checked">Нет\
        				</label>\
        				<label class="btn btn-default" data-btn-color="success">\
        					<input type="radio" name="show_hidden" value="off">Да\
        				</label>\
        			</div>\
                    <h4>Невидимые символы</h4>\
                    <div class="e__show-hidden btn-group btn-toggle-one-color" data-toggle="buttons">\
        				<label class="btn btn-default active" data-btn-color="default">\
        					<input type="radio" name="show_hidden" value="" checked="checked">Нет\
        				</label>\
        				<label class="btn btn-default" data-btn-color="success">\
        					<input type="radio" name="show_hidden" value="show">Да\
        				</label>\
        			</div>\
                </div>\
            </div>\
        </div>');
        $container.find( " .e__snippets .e__scroll-wrap" ).mCustomScrollbar({
            axis: "y",
            theme: "dark",
            scrollbarPosition: "outside",
            scrollInertia: 100,
            mouseWheel: {
                scrollAmount: ____._options.snippetsMenuScrollAmount
            }
        });

        var html = "";
        for(var key in ____.modelist.modes)//Формируем список языков
        {
            html += '<span style="display: none;" class="list-group-item" data-mode="'+(____.modelist.modes[key].mode)+'">'+(____.modelist.modes[key].caption)+'</span>';
        }
        $container.find( " .e__mode-wrap .list-group" ).append( html );

        ____.refreshPositionMenuAndEditor();

        ____.editor = ace.edit( $container.find( " .e__ace-editor" ).get(0) );
        ____.editor.setTheme( ____._options.defTheme );
        ____.editor.setReadOnly(true);

        //Свойства
        ____.filesId = new Array();
        ____.files = {};
        ____.currentFile = null;

        //События
        $( "body" ).on("click click.body.iframe", ____.handlerClickBeyondLimits);

        ____.editor.on("change", function(e){
            if( ____.currentFile !== null ) {
                ____.files[ ____.currentFile ].editCode = ____.editor.getValue();
            }
        });

        $container.find( " .e__btn-file-manager" ).on( "click", ____.handlerOpenFileManager );
        ____.fileManager.on( 'close', ____.handlerCloseFileManager );
        ____.fileManager.on( 'selected', ____.handlerSelectFileInFileManager );

        $container.find(" .e__btn-options").click( ____.handlerOpenOptions );
        $container.find(' .e__theme').change( ____._handlerChangeTheme );
        $container.find(' .e__fontsize').change( ____._handlerChangeFontSize );
        $container.find(' .e__soft-wrap input').change( ____._handlerChangeSoftWrap );
        $container.find(' .e__show-hidden input').change( ____._handlerChangeShowHidden );

        //Отменить и повторить
        $container.find( " .e__btn-undo" ).click( ____.handlerUndo );
        $container.find( " .e__btn-rendo" ).click( ____.handlerRedo );
        ____.editor.on( "changeSession", ____.updateUndoAndRedoBTN );
        $container.on( "e.change_undo_manager", ____.updateUndoAndRedoBTN );

        //Сохранить
        $container.find( " .e__btn-save" ).click( ____.handlerSave );
        $container.find( " .e__btn-save-auto" ).click( ____.toggleAutoSave );
        $container.find( " .e__btn-auto-load" ).click( ____.toggleAutoLoad );
        $('body').on( 'keydown', ____.handlerSave__CtrlPlusS );
        $('body').on( 'keyup', ____.handlerSave__CtrlPlusS__up );
        ____.editor.on( "changeSession", ____.updateSaveBTN );
        ____.editor.on( "change", ____.updateSaveBTN );
        ____.editor.on( "changeSession", ____.updateIndicatorBTNAutoLoad );
        $container.on( "e.reloadfile", ____.updateIndicatorBTNAutoLoad );
        ____.editor.on( "change", ____.hiddenIndicatorBTNAutoLoad );

        //Сниппеты
        $container.find( " .e__btn-snippets" ).click( ____.handlerOpenSnippets );
        ____.editor.on("changeSession", ____.refreshModeListAndBTN);
        $container.find( " .e__mode-wrap .list-group-item" ).click( ____.handlerSelectModeSnippets );
        $container.find( " .e__snippet-wrap" ).on( "click", " .list-group-item", ____.handlerActiveListItemSnippet );
        $container.find( " .e__snippet-wrap" ).on( "dblclick", " .list-group-item", ____.handlerSelectSnippet );
        $container.find( " .e__btn-edit-snippet" ).click( ____.handlerEditSnippet );

        $container.find(" .e__options select").selectpicker();
        
        ____._restoreSession(function (data) {
            if( data === true ) {
                $container.trigger( "e.init" );
            }
        });
    }

    this.handlerOpenOptions = function(e) {
        if( !$container.find(" .e__btn-options").hasClass('active') ) {
            ____.openOptions__open();
        } else {
            ____.openOptions__close();
        }
    }

        this.openOptions__open = function() {
            if( "openOptionsTimeLine__close" in ____ ) { ____.openOptionsTimeLine__close.pause() }
            $container.find(" .e__options").css({
                display: "block",
                opacity: 0,
                transform: "scale(0.8, 0.8)"
            });

                //По центру
                var w = $container.find(" .e__options").outerWidth();
                var h = $container.find(" .e__options").outerHeight();
                var wEditor = $container.find(" .e__ace-editor").outerWidth();
                var hEditor = $container.find(" .e__ace-editor").outerHeight();
                var l_center = Math.round( (wEditor - w) / 2 );
                var t_center = Math.round( (hEditor - h) / 2 );
                $container.find(" .e__options").css({left: l_center, top: t_center});

            if( !("openOptionsTimeLine" in ____) ) {
                ____.openOptionsTimeLine = (new TimelineLite()).append([
                    TweenMax.to($container.find(" .e__options"), 0.5,
                        {css:{transform: "scale(1, 1)" }}),
                    TweenMax.to($container.find(" .e__options"), 0.3,
                        {css:{ opacity: 1 }})
                ]);
            } else {
                ____.openOptionsTimeLine.restart();
            }

            $container.find(" .e__btn-options").addClass('active');
        }

        this.openOptions__close = function() {
            if( "openOptionsTimeLine" in ____ ) { ____.openOptionsTimeLine.pause() }
            if( !("openOptionsTimeLine__close" in ____) ) {
                ____.openOptionsTimeLine__close = (new TimelineLite()).append([
                    TweenMax.to($container.find(" .e__options"), 0.5,
                        {css:{ transform: "scale(0.8, 0.8)"}, onComplete: handlerComplete}),
                    TweenMax.to($container.find(" .e__options"), 0.5,
                        {css:{ opacity: 0 }})
                ]);
            } else {
                ____.openOptionsTimeLine__close.restart();
            }
            function handlerComplete() {
                $container.find(" .e__options").css('display', 'none');
            }

            $container.find(" .e__btn-options").removeClass('active');
        }

    this._handlerChangeTheme = function(e) {
        var $options = ____.$session.find( " options" );

        var val = $container.find(' .e__theme').val();
        ____.editor.setTheme(val);

        $options.find(' theme').text(val);
        ____._saveSession();
    }

    this._handlerChangeFontSize = function(e) {
        var $options = ____.$session.find( " options" );

        var val = $(this).val();
        ____.editor.setFontSize(val);
        $options.find(' fontsize').text(val);

        ____._handlerChangeSoftWrap( parseInt( val ) );

        ____._saveSession();
    }

    this._handlerChangeSoftWrap = function(e) {
        var $options = ____.$session.find( " options" );

        var val;
        if( typeof e == "number" ) {
            val = $options.find(' softwrap').text().toLowerCase();
        } else {
            val = $(this).val().toLowerCase();
        }

    	var session = ____.editor.getSession();
    	var renderer = ____.editor.renderer;
    	session.setUseWrapMode(val == "off");

        var wEditor = $container.find( " .e__ace-editor" ).outerWidth();
        var fontSize = parseInt( $options.find(' fontsize').text() );

        if( val == "off" ) {
            renderer.setPrintMarginColumn( Math.floor( wEditor / fontSize * 1.55 ) );
            session.setWrapLimitRange( Math.floor( wEditor / fontSize * 1.55 ), Math.floor( wEditor / fontSize * 1.55 ) );
            ____.editor.renderer.setShowPrintMargin(true);
        } else {
            ____.editor.renderer.setShowPrintMargin(false);

        }

        $options.find(' softwrap').text(val);
        ____._saveSession();
    }

    this._handlerChangeShowHidden = function(e) {
        var $options = ____.$session.find( " options" );

        ____.editor.setShowInvisibles($(this).val() == 'show');
        $options.find(' showhidden').text($(this).val());
        ____._saveSession();
    }

    this.handlerClickBeyondLimits = function(e) {
        if( $(e.target).closest($container.find(" .e__btn-options").add($container.find(" .e__options"))).size() == 0 ) {
            if( $container.find(" .e__btn-options").hasClass('active') ) {
                ____.openOptions__close();
            }
        }

        if( $(e.target).closest($container.find(" .e__btn-snippets").add($container.find(" .e__snippets"))).size() == 0 ) {
            if( $container.find(" .e__btn-snippets").hasClass('active') ) {
                ____.openSnippets__close();
            }
        }
    }

    this.handlerOpenFileManager = function() {
        if(!____.fileManager.opened)
        {
            $container.find( " .e__btn-file-manager" ).addClass('active');
            ____._options.$fileManagerContainer.find( " .e__file-navigator" ).css({display: 'block'});
            ____.fileManager.open({
                selected: 'files',
                closeAfterSelecting: true
            });
        }
    }

    this.handlerCloseFileManager = function() {
        $container.find( " .e__btn-file-manager" ).removeClass('active');
        ____._options.$fileManagerContainer.find( " .e__file-navigator" ).css({display: 'none'});

        ____.editor.focus();
    }

    this.handlerSelectFileInFileManager = function( data ) {
        if(data !== false)
        {
            for(var key in data)
            {
                ____.openFileByURL( data[key].url );
            }
        }
    }

    this.handlerUndo = function() {
        if( ____.editor.getSession().getUndoManager().hasUndo() )
        {
            ____.editor.getSession().getUndoManager().undo();
        }
    }

    this.handlerRedo = function() {
        if( ____.editor.getSession().getUndoManager().hasRedo() )
        {
            ____.editor.getSession().getUndoManager().redo();
        }
    }

    this.updateUndoAndRedoBTN = function() {
        if( ____.filesId.length > 0 )
        {
            if( ____.editor.getSession().getUndoManager().hasUndo() )
            {
                $container.find(" .e__btn-undo").removeClass('disabled');
            }
            else
            {
                $container.find(" .e__btn-undo").addClass('disabled');
            }

            if( ____.editor.getSession().getUndoManager().hasRedo() )
            {
                $container.find( " .e__btn-rendo" ).removeClass('disabled');
            }
            else
            {
                $container.find( " .e__btn-rendo" ).addClass('disabled');
            }
        }
        else
        {
            $container.find(" .e__btn-undo").addClass('disabled');
            $container.find(" .e__btn-rendo").addClass('disabled');
        }
    }

    this.handlerSave = function(callback) {
        if( ____.currentFile !== null ) {
            if( ____.isCurrentFileChanged() ) {
                var currentURL;
                if ((currentURL = /^url:(.+)$/gm.exec(____.currentFile)) !== null) {
                    currentURL = currentURL[1];
                    var file_text = ____.files[____.currentFile].loadCode;

                    $.ajax({
                        url: "sb.php",
                        async: true,
                        type: "POST",
                        cache: false,
                        data: ({
                            module: 'setfile',
                            dir: currentURL,
                            file_text: ____.editor.getValue(),
                            text_encoding: shablonizator.textEncodingServer
                        }),
                        success: function (data) {
                            if ('file_none' == data) {
                                alert('Файл: "' + currentURL + '" отсутствует');
                            }
                            else if ('neudacha' == data) {
                                alert('Неполучилось записать в файл: "' + currentURL + '"');
                            }
                            else {
                                $.ajax({
                                    url: "sb.php",
                                    type: "POST",
                                    cache: false,
                                    data: ({module: 'file_modified_time', url: currentURL, text_encoding: shablonizator.textEncodingServer}),
                                    async: true,
                                    success: function(data){
                                        ____.files[____.currentFile].loadCode = ____.editor.getValue();
                                        ____.files[____.currentFile].editCode = ____.editor.getValue();
                                        ____.files[____.currentFile].modifiedTime = parseFloat( data );
                                        ____.updateSaveBTN();
                                        $container.find(" .e__ace-editor").trigger({
                                            type: "e.savefile",
                                            id: ____.currentFile,
                                            code: ____.editor.getValue()
                                        });
                                        ____.editor.focus();
                                    },
                                    complete: function () {
                                        if(callback !== undefined){callback()}
                                    }
                                });
                            }
                        },
                        error: function () {
                            if(callback !== undefined){callback()}
                        }
                    });
                } else {
                    ____.files[____.currentFile].loadCode = ____.editor.getValue();
                    ____.files[____.currentFile].editCode = ____.editor.getValue();
                    ____.updateSaveBTN();
                    $container.find(" .e__ace-editor").trigger({
                        type: "e.savefile",
                        id: ____.currentFile,
                        code: ____.editor.getValue()
                    });
                    ____.editor.focus();
                    if(callback !== undefined){callback()}
                }
            } else {
                if(callback !== undefined){callback()}
            }
        } else {
            if(callback !== undefined){callback()}
        }
    }
    
        this.handlerSave__CtrlPlusS = function(e) {
            if(e.which == 83 && e.ctrlKey && !e.shiftKey && !e.altKey && ____.editor.isFocused())
            {
                ____.handlerSave();
                if(e.preventDefault){ e.preventDefault()} else {e.stop()}; e.returnValue = false; e.stopPropagation(); return false;
            }
        }

        this.handlerSave__CtrlPlusS__up = function(e) {
            if(e.which == 83 && e.ctrlKey && !e.shiftKey && !e.altKey && ____.editor.isFocused())
            {
                if(e.preventDefault){ e.preventDefault()} else {e.stop()}; e.returnValue = false; e.stopPropagation(); return false;
            }
        }

        //Проверка - отличаеться текст в редакторе от "this.files[this.currentFile].loadCode"
        this.isCurrentFileChanged = function() {
            return ____.editor.getValue() !== ____.files[____.currentFile].loadCode;
        }

        this.updateSaveBTN = function() {
            if( ____.isCurrentFileChanged() )
            {
                $container.find( " .e__btn-save" ).removeClass( "disabled" );
            }
            else {
                $container.find( " .e__btn-save" ).addClass( "disabled" );
            }
        }

    this.toggleAutoSave = function() {
        if( ____.autoSave__active !== true ) {
            ____.activeAutoSave();
        } else {
            ____.disableAutoSave();
        }
    }

    this.toggleAutoLoad = function() {
        if( ____.autoLoad__active !== true ) {
            ____.activeAutoLoad();
        } else {
            ____.disableAutoLoad();
        }
    }

        this.activeAutoSave = function() {
            if( ____.autoSave__active !== true ) {
                ____.autoSave__active = true;

                ____.activeAutoSave__ticker__in__activeAutoLoad__ticker();

                $container.find(" .e__btn-save-auto").addClass('active');

                ____.$session.find( " options" ).find('save_auto').text( "on" );
                ____._saveSession();
            }
        }

        this.disableAutoSave = function() {
            if( ____.autoSave__active === true ) {
                ____.autoSave__active = false;

                $container.find(" .e__btn-save-auto").removeClass('active');

                ____.$session.find( " options" ).find('save_auto').text( "off" );
                ____._saveSession();
            }
        }

        this.activeAutoLoad = function() {
            if( ____.autoLoad__active !== true ) {
                ____.autoLoad__active = true;

                ____.activeAutoLoad__ticker__in__activeAutoSave__ticker();

                $container.find(" .e__btn-auto-load").addClass('active');

                ____.$session.find( " options" ).find('auto_load').text( "on" );
                ____._saveSession();
            }
        }

        this.disableAutoLoad = function() {
            if( ____.autoLoad__active === true ) {
                ____.autoLoad__active = false;

                $container.find(" .e__btn-auto-load").removeClass('active');

                ____.$session.find( " options" ).find('auto_load').text( "off" );
                ____._saveSession();
            }
        }

            this.activeAutoSave__ticker__in__activeAutoLoad__ticker = function() {
                if( ____.autoSave__active === true ) {
                    ____.handlerSave(function () {
                        setTimeout( ____.activeAutoLoad__ticker__in__activeAutoSave__ticker, 1000 );
                    });
                } else if( ____.autoLoad__active === true ) {
                    setTimeout( ____.activeAutoLoad__ticker__in__activeAutoSave__ticker, 1000 );
                }
            }

            this.activeAutoLoad__ticker__in__activeAutoSave__ticker = function() {
                if( ____.autoLoad__active === true ) {
                    var currentURL;
                    if ((currentURL = /^url:(.+)$/gm.exec(____.currentFile)) !== null) {
                        currentURL = currentURL[1];
                        ____.reloadFileByUrl__onlyChangeModifiedTime( currentURL, function () {
                            setTimeout( ____.activeAutoSave__ticker__in__activeAutoLoad__ticker, 1000 );
                        });
                    } else {
                        setTimeout( ____.activeAutoSave__ticker__in__activeAutoLoad__ticker, 1000 );
                    }
                } else if( ____.autoSave__active === true ) {
                    setTimeout( ____.activeAutoSave__ticker__in__activeAutoLoad__ticker, 1000 );
                }
            }

        this.updateIndicatorBTNAutoLoad = function() {
            if( ____.currentFile !== undefined ) {
                if( ____.files[____.currentFile].loadedNewCode ) {
                    ____.showIndicatorBTNAutoLoad();
                } else {
                    ____.hiddenIndicatorBTNAutoLoad();
                }
            } else {
                ____.hiddenIndicatorBTNAutoLoad();
            }
        }

            this.showIndicatorBTNAutoLoad = function() {
                $container.find( " .e__btn-auto-load" ).addClass( "e__btn-auto-load--loaded-indicator" );
            }

            this.hiddenIndicatorBTNAutoLoad = function() {
                if( ____.currentFile !== undefined ) {
                    ____.files[____.currentFile].loadedNewCode = false;
                }
                $container.find( " .e__btn-auto-load" ).removeClass( "e__btn-auto-load--loaded-indicator" );
            }

    this.handlerOpenSnippets = function(e) {
        if( ____.filesId.length > 0 ) {//Есть сниппеты для сниппетов
            if( !$container.find(" .e__btn-snippets").hasClass('active') ) {
                ____.openSnippets__open();
            } else {
                ____.openSnippets__close();
            }
        }
    }

        this.openSnippets__open = function() {
            if( !$container.find(" .e__btn-snippets").hasClass('active') ) {
                if( "openSnippetsTimeLine__close" in ____ ) { ____.openSnippetsTimeLine__close.pause() }
                $container.find(" .e__snippets").css({
                    display: "block",
                    opacity: 0,
                    transform: "scale(0.8, 0.8)"
                });

                if( !("openSnippetsTimeLine" in ____) ) {
                    ____.openSnippetsTimeLine = (new TimelineLite()).append([
                        TweenMax.to($container.find(" .e__snippets"), 0.5,
                            {css:{transform: "scale(1, 1)" }}),
                        TweenMax.to($container.find(" .e__snippets"), 0.3,
                            {css:{ opacity: 1 }})
                    ]);
                } else {
                    ____.openSnippetsTimeLine.restart();
                }

                $container.find(" .e__btn-snippets").addClass('active');
            }
        }

        this.openSnippets__close = function() {
            if( $container.find(" .e__btn-snippets").hasClass('active') ) {
                if( "openSnippetsTimeLine" in ____ ) { ____.openSnippetsTimeLine.pause() }
                if( !("openSnippetsTimeLine__close" in ____) ) {
                    ____.openSnippetsTimeLine__close = (new TimelineLite()).append([
                        TweenMax.to($container.find(" .e__snippets"), 0.5,
                            {css:{ transform: "scale(0.8, 0.8)"}, onComplete: handlerComplete}),
                        TweenMax.to($container.find(" .e__snippets"), 0.5,
                            {css:{ opacity: 0 }})
                    ]);
                } else {
                    ____.openSnippetsTimeLine__close.restart();
                }
                function handlerComplete() {
                    $container.find(" .e__snippets").css('display', 'none');
                }

                $container.find(" .e__btn-snippets").removeClass('active');
            }
        }

    this.refreshModeListAndBTN = function() {
        if( ____.filesId.length > 0 ) {
            if( ____._options.showSnippetsForTheCurrentLanguageOnly ) {
                $container.find( " .e__mode-wrap [data-mode]" )
                    .css({display: "none"})
                    .removeClass( "active" );

                var currentMode = ____.modelist.getModeForPath( ____.currentFile ).mode;
                ____.selectModeSnippets( currentMode );

                $container.find( " .e__mode-wrap [data-mode='" + currentMode + "']" ).css({display: "block"});
                if( currentMode in ____._options.additionalSnippetsForLanguages ) {
                    var additionalSnippetsForLanguage = ____._options.additionalSnippetsForLanguages[currentMode];
                    for( var mode in additionalSnippetsForLanguage ) {
                        $container.find( " .e__mode-wrap [data-mode='" + additionalSnippetsForLanguage[mode] + "']" ).css({display: "block"});
                    }
                }
            } else {
                $container.find( " .e__mode-wrap [data-mode]" ).css({display: "block"});
            }

            $container.find(" .e__btn-snippets").removeClass('disabled');
            $container.find(" .e__btn-edit-snippet").removeClass('disabled');
        } else {
            ____.openSnippets__close();
            $container.find(" .e__btn-snippets").addClass('disabled');
            $container.find(" .e__btn-edit-snippet").addClass('disabled');
        }
    }

    this.selectModeSnippets = function( mode ){
        $container.find( " .e__snippet-wrap .list-group" ).empty();

        $container.find( " .e__mode-wrap .list-group-item" ).removeClass('active');
        $container.find( " .e__mode-wrap [data-mode='" + mode + "']" ).addClass('active');

        var config = require("ace/config");
        var snippetManager = require("ace/snippets").snippetManager;

        if (!snippetManager.files) snippetManager.files = {};
        if (mode && !snippetManager.files[mode]) {
            var snippetFilePath = mode.replace("mode", "snippets");
            config.loadModule(snippetFilePath, function(m) {
                if (m) {
                    snippetManager.files[mode] = m;
                    m.snippets = snippetManager.parseSnippetFile(m.snippetText);
                    snippetManager.register(m.snippets, m.scope);

                    next();
                }
            });
        }
        else
        {
            next();
        }

        function next()
        {
            var $html = $();
            for(var key in snippetManager.files[mode].snippets)//Формируем список сниппетов
            {
                var snippet = snippetManager.files[mode].snippets[key];
                var $item = $('<span class="list-group-item"></span>')
                    .attr( "data-tab", snippet.tabTrigger )
                    .text( snippet.tabTrigger );
                $container.find( " .e__snippet-wrap .list-group" ).append( $item );
            }
            //$container.find( " .e__snippet-wrap .list-group" ).append( $html );
        }
    }

        this.handlerSelectModeSnippets = function(){
            if( !$(this).hasClass('active') ) {
                ____.selectModeSnippets( $(this).attr('data-mode') );
            }
        }

    this.handlerActiveListItemSnippet = function(){
        if( !$(this).hasClass('active') )
        {
            $container.find( " .e__snippet-wrap .list-group-item" ).removeClass('active');
            $(this).addClass('active');
        }
    }

    this.handlerSelectSnippet = function(){
        var snippetManager = require("ace/snippets").snippetManager;
        var $mode = $container.find( " .e__mode-wrap .list-group-item.active" ).first();
        var mode = $mode.attr('data-mode');
        var shortCode = $(this).attr('data-tab');

        var snippets = snippetManager.files[mode].snippets;
        var snippet;

        for(var key in snippets)
        {
            snippet = snippets[key];

            if(snippet.tabTrigger == shortCode)
            {
                break;
            }
        }

        snippetManager.insertSnippetAllRanges(____.editor, snippet.content);

        ____.openSnippets__close();

        ____.editor.focus();
    }

    this.handlerEditSnippet = function(){
        var snippetManager = require("ace/snippets").snippetManager;
        var $mode = $container.find( " .e__mode-wrap .list-group-item.active" ).first();
        var $shortCode = $container.find( " .e__snippet-wrap .list-group-item.active" ).first();
        if( $mode.size() && $shortCode.size() )
        {
            var mode = $mode.attr('data-mode');
            var shortCode = $shortCode.attr('data-tab');
            var index = 0;

            ____.openFileByURL( ____._options.snippetsFolder+(/(\\|\/)([^\\\/]+)$/.exec( mode )[2])+'.js');

            var re = RegExp('^snippet\\s+'+shortCode+' *\\\\n', 'gm');
            var res;
            if( ~(res = ____.editor.getValue().indexOf( "snippet " + shortCode + "\\n" )) )
            {
                index = res;

                var reHeightOneLine = /(\d{1,4})px/gim;
                var HeightOneLine = reHeightOneLine.exec( $container.find(' .e__ace-editor .ace_text-layer .ace_line').first().css('height') );
                HeightOneLine = parseInt( HeightOneLine[1] );

                var resultRowCenter = Math.ceil( $container.find(' .e__ace-editor').height() / HeightOneLine / 2 ) - 1;//1 отнял чтоб повыше было
                var objOffset = ____.editor.getSession().getDocument().indexToPosition(index);
                if(objOffset.row - resultRowCenter < 0){resultRowCenter = 0;} else {resultRowCenter = objOffset.row - resultRowCenter}
                ____.editor.moveCursorToPosition(objOffset);
                ____.editor.scrollToRow(resultRowCenter);

                ____.editor.focus();
            }

            ____.openSnippets__close();
        }
    }

    /*this.setEditorObjectNewSnippets = function(){
        var snippetManager = require("ace/snippets").snippetManager;

        var id = /(\\|\/)([^\\\/]+)\.js$/.exec( ____.currentFile )[2] || "";
        var m = snippetManager.files["ace/mode/"+id];
        console.log(snippetManager);

        m.snippetText = ____.editor.getValue();
        snippetManager.unregister(m.snippets);
        m.snippets = snippetManager.parseSnippetFile(m.snippetText);
        snippetManager.register(m.snippets);
    }*/

    this._destroy = function() {
        if( "editor" in ____ ) {
            ____.currentFile = null;
            ____.editor.destroy();
        }
    }

    this.openFileByURL = function( url, mode, code ) {
        //Если файл уже открыт
        var id = "url:"+url;

        if( id in ____.files )
        {
            if( id !== ____.currentFile )//Заного неперезагружать данные в редактор если файл итак активен
            {
                ____.currentFile = id;
                ____.editor.setSession(____.files[id].session);
            }
            ____.editor.focus();

        } else {
            if( code !== undefined ) {
                loadMTimeAndInsertData( code );
            } else {
                $.ajax({
                    url: "sb.php",
                    type: "POST",
                    cache: false,
                    data: ({module: 'getfile', dir: url, text_encoding: shablonizator.textEncodingServer}),
                    async: false,
                    success: function(data){
                        if(data != 'error_getfile_shablonizator156418546585415')
                        {
                            loadMTimeAndInsertData( data );
                        }
                    }
                });
            }

            function loadMTimeAndInsertData( data ) {
                var codeFile = data;
                $.ajax({
                    url: "sb.php",
                    type: "POST",
                    cache: false,
                    data: ({module: 'file_modified_time', url: url, text_encoding: shablonizator.textEncodingServer}),
                    async: false,
                    success: function(data){
                        ____.currentFile = id;
                        ____.filesId.push( id );
                        ____.files[id] = {};
                        ____.files[id].modifiedTime = parseFloat( data );
                        ____.files[id].loadedNewCode = false;
                        ____.files[id].loadCode = codeFile;
                        ____.files[id].editCode = codeFile;
                        ____.files[id].session = ace.createEditSession( codeFile, ( mode !== undefined ) ? "ace/mode/"+mode : ____.modelist.getModeForPath(url).mode );

                        ____.editor.setSession( ____.files[id].session );
                        ____.editor.setReadOnly(false);
                        ____.editor.focus();

                        //Привязываем обновлятор кнопок ундо менеджера к событию onUpdate каждой сессии
                        ____.files[id].session.getUndoManager().onUpdate(function(){
                            $container.find( " .e__ace-editor" ).trigger("e.change_undo_manager");
                        });
                    }
                });
            }

            return true;
        }
    }

    this.closeFileByURL = function( url ) {
        var id = "url:"+url;
        if( id in ____.files ) {
            //блокировать возвожность редактировать если нет ниодного открытого файла.setReadOnly(true);

            var errorSave = '';

            if(____.files[id].loadCode !== ____.files[id].editCode)
            //Если текст в редакторе несовпадает с исходным
            {
                if(confirm("Сохранить изменения?"))
                {
                    $.ajax({
                        url: "sb.php",
                        async: false,
                        cache: false,
                        type: "POST",
                        data: ({module: 'setfile', dir: url, file_text: ____.files[id].editCode, text_encoding: shablonizator.textEncodingServer}),
                        success: function(data){
                            errorSave = data;
                        }
                    });
                    if(errorSave == 'neudacha')
                    {
                        alert('Файл почемуто несохранился!');
                        return false;
                    }
                    if(errorSave == 'file_none')
                    {
                        alert('Исходный файл в который надо записать отсутствует!');
                        return false;
                    }
                }
            }
            for(var i in ____.filesId) {if( ____.filesId[i] == id ){ ____.filesId.splice(i, 1) }}
            delete ____.files[id];

            if( id == ____.currentFile )
            //Если мы закрываем текущий файл
            {
                if( ____.filesId.length == 0 ) {
                    ____.editor.setValue('');
                    ____.editor.setReadOnly(true);
                    ____.editor.getSession().getUndoManager().reset();
                    ____.editor.setSession( ____.editor.getSession() );//Чтоб срабатывало событие "changeSession"
                    ____.currentFile = null;
                }
                else {
                    var firstUrl;
                    for( var key in ____.filesId ) { firstUrl = ____.filesId[key]; break }
                    ____.editor.setSession(____.files[ firstUrl ].session);
                    ____.editor.focus();
                    ____.currentFile = firstUrl;
                }
            }
        }
    }

    this.insertFile = function( id, code, mode ) {
        //Если файл уже открыт
        id = "insert:"+id;

        if( id in ____.files )
        {
            if( id !== ____.currentFile )//Заного неперезагружать данные в редактор если файл итак активен
            {
                ____.currentFile = id;
                ____.editor.setSession(____.files[id].session);
            }
            ____.editor.focus();
        } else {
            ____.currentFile = id;
            ____.filesId.push( id );
            ____.files[id] = {};
            ____.files[id].loadCode = code;
            ____.files[id].editCode = code;
            ____.files[id].session = ace.createEditSession( code, "ace/mode/"+mode );

            ____.editor.setSession( ____.files[id].session );
            ____.editor.setReadOnly(false);
            ____.editor.focus();

            //Привязываем обновлятор кнопок ундо менеджера к событию onUpdate каждой сессии
            ____.files[id].session.getUndoManager().onUpdate(function(){
                $container.find( " .e__ace-editor" ).trigger("e.change_undo_manager");
            });
            return true;
        }
    }

    this.deleteFile = function( id ) {
        id = "insert:"+id;
        if( id in ____.files ) {
            //блокировать возвожность редактировать если нет ниодного открытого файла.setReadOnly(true);

            var errorSave = '';

            if(____.files[id].loadCode !== ____.files[id].editCode)
            //Если текст в редакторе несовпадает с исходным
            {
                $container.find( " .e__ace-editor" ).trigger({
                    type: "e.deletefile",
                    id: id,
                    code: ____.files[id].editCode
                });
            }
            for(var i in ____.filesId) {if( ____.filesId[i] == id ){ ____.filesId.splice(i, 1) }}
            delete ____.files[id];

            if( id == ____.currentFile )
            //Если мы закрываем текущий файл
            {
                if( ____.filesId.length == 0 ) {
                    ____.editor.setValue('');
                    ____.editor.setReadOnly(true);
                    ____.editor.getSession().getUndoManager().reset();
                    ____.editor.setSession( ____.editor.getSession() );//Чтоб срабатывало событие "changeSession"
                    ____.currentFile = null;
                }
                else {
                    var firstUrl;
                    for( var key in ____.filesId ) { firstUrl = ____.filesId[key]; break }
                    ____.editor.setSession(____.files[ firstUrl ].session);
                    ____.editor.focus();
                    ____.currentFile = firstUrl;
                }
            }
        }
    }

    this.selectFile = function( id ) {
        if( id in ____.files ) {
            if( /^url\:/.test(id) ) {
                ____.openFileByURL( id.substring(4) );
            } else if( /^insert\:/.test(id) ) {
                ____.insertFile( id.substring(7) );
            } else {
                console.log( "Неизвестный префикс файла" );
            }
        } else {
            console.log( "Такого файла нету:" + id );
        }
    }

    this.reloadFileByUrl__onlyChangeModifiedTime = function( url, callback ) {
        if( ____.currentFile !== null ) {
            var id = "url:" + url;

            $.ajax({
                url: "sb.php",
                type: "POST",
                cache: false,
                data: ({module: 'file_modified_time', url: url, text_encoding: shablonizator.textEncodingServer}),
                async: true,
                success: function(modifiedTime){
                    if( ____.files[id].modifiedTime < parseFloat( modifiedTime ) ) {
                        $.ajax({
                            url: "sb.php",
                            type: "POST",
                            cache: false,
                            data: ({module: 'getfile', dir: url, text_encoding: shablonizator.textEncodingServer}),
                            async: true,
                            success: function(data){
                                if(data != 'error_getfile_shablonizator156418546585415')
                                {
                                    ____.files[id].modifiedTime = parseFloat( modifiedTime );
                                    ____.files[id].loadCode = data;
                                    ____.files[id].editCode = data;

                                    var cursorPosition = ____.editor.getCursorPosition();
                                    var scrollTop = ____.editor.getSession().getScrollTop();

                                    ____.editor.setValue( data );

                                    ____.editor.moveCursorToPosition(cursorPosition);
                                    ____.editor.getSession().setScrollTop( scrollTop );
                                    ____.editor.clearSelection();
                                    ____.editor.focus();

                                    ____.files[id].loadedNewCode = true;//Перенёс ниже потому что сразу скрываеться ("this.hiddenIndicatorBTNAutoLoad") изза событий change в редакторе

                                    $container.trigger( "e.reloadfile" );
                                    if(callback !== undefined){callback()}
                                }
                            },
                            error: function () {
                                if(callback !== undefined){callback()}
                            }
                        });
                    } else {
                        if(callback !== undefined){callback()}
                    }
                },
                error: function () {
                    if(callback !== undefined){callback()}
                }
            });
        } else {
            if(callback !== undefined){callback()}
        }
    }

    this.refreshPositionMenuAndEditor = function() {
        //____.editor.resize( true );

        var h = $container.find( " .e__menu" ).outerHeight();
        $container.find( " .e__ace-editor" ).css({top: h});

        //____.editor.resize( false );
    }

    this._restoreSession = function(callback) {
        if( !("$session" in ____) ) {
            //Загружаем сессию
            $.ajax({
                url: "sb.php",
                type: "POST",
                cache: false,
                data: ({module: 'getfile', dir: ____._options.urlXML, text_encoding: 'UTF-8'}),
                async: false,
                success: function(data){
                    ____.$session = $($.parseXML(data));
                }, error: function () {
                    if(callback !== undefined){callback(false)}
                }
            });
        }

        /*задание настроек*/
        var $options = ____.$session.find( " options" );
            //Тема
            ____.editor.setTheme($options.find('theme').text());
            $container.find(' .e__theme').selectpicker('val', $options.find('theme').text());
            //Размер шрифта
            ____.editor.setFontSize($options.find('fontsize').text());
            $container.find(' .e__fontsize').selectpicker('val', $options.find('fontsize').text());
            //Переброс длинных строк
            var val = $options.find(' softwrap').text()
        	var session = ____.editor.getSession();
        	var renderer = ____.editor.renderer;
        	session.setUseWrapMode(val == "off");
        	var wEditor = $container.find( " .e__ace-editor" ).outerWidth();
            var fontSize = parseInt( $options.find(' fontsize').text() );
            if( val == "off" ) {
                renderer.setPrintMarginColumn( Math.floor( wEditor / fontSize * 1.55 ) );
                session.setWrapLimitRange( Math.floor( wEditor / fontSize * 1.55 ), Math.floor( wEditor / fontSize * 1.55 ) );
                ____.editor.renderer.setShowPrintMargin(true);
            } else {
                ____.editor.renderer.setShowPrintMargin(false);

            }
            if($options.find('softwrap').text() == 'free'){$container.find('.e__soft-wrap input[value="free"]').prop('checked', true); $container.find('.e__soft-wrap input[value="off"]').prop('checked', false); $container.find('.e__soft-wrap label:nth-child(1)').addClass('active btn-default'); $container.find('.e__soft-wrap label:nth-child(2)').removeClass('btn-success active').addClass('btn-default');} else {$container.find('.e__soft-wrap input[value="off"]').prop('checked', true); $container.find('.e__soft-wrap input[value="free"]').prop('checked', false); $container.find('.e__soft-wrap label:nth-child(1)').removeClass('active'); $container.find('.e__soft-wrap label:nth-child(2)').removeClass('btn-default').addClass('btn-success active');}
            //Невидимые символы
            ____.editor.setShowInvisibles($options.find('showhidden').text() == 'show');
            if($options.find('showhidden').text() != 'show'){$container.find('.e__show-hidden input[value!="show"]').prop('checked', true); $container.find('.e__show-hidden input[value="show"]').prop('checked', false); $container.find('.e__show-hidden label:nth-child(1)').addClass('active btn-default'); $container.find('.e__show-hidden label:nth-child(2)').removeClass('btn-success active').addClass('btn-default');} else {$container.find('.e__show-hidden input[value="show"]').prop('checked', true); $container.find('.e__show-hidden input[value!="show"]').prop('checked', false); $container.find('.e__show-hidden label:nth-child(1)').removeClass('active'); $container.find('.e__show-hidden label:nth-child(2)').removeClass('btn-default').addClass('btn-success active');}
            //Показать сворачиватели блоков кода
            ____.editor.setShowFoldWidgets(true);
            //Emmet
            ____.editor.setOption("enableEmmet", true);
            //Сниппеты
            ____.editor.setOptions({enableBasicAutocompletion: true, enableSnippets: true});

            //Авто сохранение-синхронизация
            if($options.find('save_auto').text() == 'on'){____.activeAutoSave()}
            if($options.find('auto_load').text() == 'on'){____.activeAutoLoad()}
        if(callback !== undefined){callback(true)}
    }

    this._saveSession = function() {
        if( "$session" in ____ ) {
            var resxml = ____.$session.xml().join('');

            //Записываем в файл
            $.ajax({
                url: "sb.php",
                async: true,
                cache: false,
                type: "POST",
                data: ({module: 'setfile', dir: ____._options.urlXML, file_text: resxml, text_encoding: 'UTF-8'})
            });
        }
    }

    //Кроссмодульные методы
}









    modules.editor = editor;

})(jQuery);