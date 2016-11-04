(function($){

    var defaultOptions = {
        maxLinesEditorsForTabCopyInsert: 60,
        gctci__fileManager: {},
        mainEditor: undefined,//Основной редактор с которого парсить опции
        scssCompiller: undefined,
        basePathGenerators: "generators/",
        formatter: undefined
    };

    var generatorCode__TabsCopyInsert = function($container, options) {
        this._options = options;
        var ____ = this;
        ____.$container = $container;

        this._create = function () {
            ____._init();

            ____.editors = new Array();

            //Обработчики событий
            $container.find(" .footer-tab .nav-tabs a").on("click", ____._handlerTabsCopyInsert);
        }

        this._destroy = function () {
            $container.find(" .footer-tab .nav-tabs a").off("click", ____._handlerTabsCopyInsert);

            $container.find(" .footer-tab").remove();
        }

        this._init = function () {
            $container.find(" .gc__panel-body").append('\
                <div class="footer-tab">\
                    <ul class="nav nav-tabs">\
                        <li><a href="#gc-tab-copy">Копировать</a></li>\
                        <li><a href="#gc-tab-insert">Подключить</a></li>\
                    </ul>\
                    <div class="tab-content">\
                        <div class="tab-pane gc-tab-copy active">\
                            <p>Я первая секция.</p>\
                        </div>\
                        <div class="tab-pane gc-tab-insert active">\
                            <p>Привет, я 6-я секция.</p>\
                        </div>\
                    </div>\
                </div>');
        }

        this.refresh = function () {
            ____._destroy();
            ____._create();
        }

        this._handlerTabsCopyInsert = function (e) {
            if (!$(this).closest('.nav-tabs').find(' li').hasClass('active')) {
                $container.trigger('gc.footertab.open');
            }
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
            e.preventDefault();
        }

        this.pasteCodeFooterTab = function( generatedCode ) {
            var i = 0;
            var $TAB = $container.find(' .footer-tab');

            //Уничтожаем редакторы из предыдущей сессии
            ____._clear();

            //Парсим размеры шрифта и строки
            var fontSize = options.mainEditor.$session.find( " options fontsize" ).text();
            fontSize = parseInt(fontSize);
            
            var heightOneLine = /(\d{1,4})px/gim.exec(options.mainEditor.$container.find(' .ace_text-layer .ace_line').first().css('height'));
            heightOneLine = parseInt(heightOneLine[1]);

            pasteHTMLAndEditors(generatedCode.copy, $TAB.find(' .gc-tab-copy'), 'html');
            pasteHTMLAndEditors(generatedCode.insert, $TAB.find(' .gc-tab-insert'), 'html');

            function pasteHTMLAndEditors(userContentHTML, $TabPane, defaultFileType) {
                $TabPane.empty();
                $TabPane.append(userContentHTML);
                $TabPane.find(' [data-namefile]').each(function(){
                    i++;

                    //Получаем код и мод (путь к файлу установки режима по типу файла)
                    var code = '', mode, extension;
                    if($(this).attr('data-namefile') in generatedCode.files) {
                        code = generatedCode.files[$(this).attr('data-namefile')];

                        if($(this).attr('data-filetype')) {
                            extension = $(this).attr('data-filetype');
                            mode = options.mainEditor.modelist.getModeForPath('file.'+$(this).attr('data-filetype')).mode;
                        } else {
                            extension = defaultFileType;
                            mode = options.mainEditor.modelist.getModeForPath('file.'+defaultFileType).mode;
                        }

                        (function(code, mode, extension, i, $editor){
                            if(/scss$/gim.test(extension)) {
                                $editor.append('<div class="row"><div class="col-xs-4 col-xs-offset-4"><a href="#editor-gc-'+i+'" class="btn btn-default btn-block btn-copy-text">Копировать</a></div>\
                                        <div class="col-xs-4"><a href="#editor-gc-css-'+i+'" class="btn btn-default btn-block btn-copy-text">Копировать CSS</a></div>\
                                        </div><div id="editor-gc-'+i+'"></div>');
                            } else {
                                $editor.append('<div class="row">\
                                        <div class="col-xs-4 col-xs-offset-8"><a href="#editor-gc-'+i+'" class="btn btn-default btn-block btn-copy-text">Копировать</a></div>\
                                        </div><div id="editor-gc-'+i+'"></div>');
                            }

                            if( /html|htm|css|js|scss/gim.test(extension) ) {
                                shablonizator.formatter(code, "formatter:" + extension, true, nextStep);
                            } else {
                                nextStep();
                            }

                            function nextStep(error, formatCode) {
                                if( error === false ) {
                                    generatedCode.files[$editor.attr('data-namefile')] = formatCode;
                                    code = formatCode;
                                }

                                $('a.btn-copy-text[href="#editor-gc-'+i+'"]').zclip({
                                    path: 'shablonizator/js/ZeroClipboard.swf',
                                    copy: code,
                                    afterCopy: function(){
                                        $(this).addClass('btn-success');
                                        var ____ = this;
                                        setTimeout(function(){
                                            ____.removeClass('btn-success');
                                        }, 500);
                                    }
                                });

                                if(/scss$/gim.test(mode)) {
                                    compileSCSS();
                                }

                                function compileSCSS() {
                                    var scss = code;
                                    var n = i;
                                    options.scssCompiller(scss, "scss", true, function( error__ajax, error__compile, css, map ){
                                        if( !error__ajax && !error__compile ) {
                                            $('a.btn-copy-text[href="#editor-gc-css-'+n+'"]').zclip({
                                                path: 'shablonizator/js/ZeroClipboard.swf',
                                                copy: css,
                                                afterCopy: function(){
                                                    $(this).addClass('btn-success');
                                                    var ____ = this;
                                                    setTimeout(function(){
                                                        ____.removeClass('btn-success');
                                                    }, 500);
                                                }
                                            });
                                        }
                                    });
                                }

                                var thisEditor = ace.edit('editor-gc-'+i);
                                ____.editors.push(thisEditor);

                                thisEditor.setSession(ace.createEditSession(code, mode));

                                thisEditor.setReadOnly(true);
                                thisEditor.setTheme(options.mainEditor.editor.getTheme());

                                thisEditor.setFontSize(fontSize+'px');
                                thisEditor.clearSelection();

                                var countLines = thisEditor.getValue().split(/\n/g).length;
                                if(countLines > options.maxLinesEditorsForTabCopyInsert)
                                {
                                    countLines = options.maxLinesEditors;
                                }
                                $('#editor-gc-'+i).css({height: (heightOneLine * countLines + 40) + 'px'});
                                thisEditor.resize(true);
                            }
                        })(code, mode, extension, i, $(this));
                    }
                });
            }

            var i = 0;
            //Создание модулей для вставки или копирования папок и файлов
            //Вставка пакета
            $TAB.find(' .insert-pack').each(function(){
                $(this).prepend('\
            <div class="row insert-pack-btn-wrap">\
                <div class="col-xs-12">\
                    <div class="btn-group btn-group-justified">\
                        <a href="#" class="btn btn-default btn-block btn-action-pack">Выполнить серию</a>\
                        <a href="#" class="btn btn-danger btn-block btn-forcibly-pack">с заменой</a>\
                    </div>\
                </div>\
            </div>');
            });
            //Вставка одного элемента
            $TAB.find(' [data-action][data-url]').each(function(){
                if(/(create_folder|create_file|copy_folder|copy_file)/gim.test($(this).attr('data-action')))
                {
                    i++;
                    var text;
                    switch($(this).attr('data-action')){

                        //Создать папку
                        case 'create_folder':
                            $(this).append('\
                        <div class="row">\
                            <div class="col-xs-8">\
                                <a href="#" class="btn btn-default btn-block btn-sm btn-action">Создать папку</a>\
                            </div>\
                            <div class="col-xs-4">\
                                <a href="#insert-url-'+i+'" class="btn btn-default btn-sm btn-block btn-copy-text">Копировать</a>\
                            </div>\
                        </div>\
                        <a href="#" class="insert-url btn btn-link btn-sm"></a>');
                            text = str.intermediateUrl( shablonizator.base_url_full, $(this).attr('data-url'), false, false );
                            $(this).find(' .insert-url').text(text);
                            break;

                        //Создать файл
                        case 'create_file':
                            $(this).append('\
                        <div class="row">\
                            <div class="col-xs-8">\
                                <div class="btn-group btn-group-sm btn-group-justified">\
                                    <a href="#" class="btn btn-default btn-action">Создать файл</a>\
                                    <a href="#" class="btn btn-danger btn-forcibly">с заменой</a>\
                                </div>\
                            </div>\
                            <div class="col-xs-4">\
                                <a href="#insert-url-'+i+'" class="btn btn-default btn-sm btn-block btn-copy-text">Копировать</a>\
                            </div>\
                        </div>\
                        <a href="#" class="insert-url btn btn-link btn-sm"></a>');
                            text = urlToTag($(this).attr('data-url'));
                            $(this).find(' .insert-url').text(text);
                            break;

                        //Копировать папку
                        case 'copy_folder':
                            $(this).append('\
                        <div class="row">\
                            <div class="col-xs-8">\
                                <div class="btn-group btn-group-sm btn-group-justified">\
                                    <a href="#" class="btn btn-default btn-action">Копировать папку</a>\
                                    <a href="#" class="btn btn-danger btn-forcibly">с заменой</a>\
                                </div>\
                            </div>\
                            <div class="col-xs-4">\
                                <a href="#insert-url-'+i+'" class="btn btn-default btn-sm btn-block btn-copy-text">Копировать</a>\
                            </div>\
                        </div>\
                        <a href="#" class="insert-url btn btn-link btn-sm"></a>');
                            text = str.intermediateUrl( shablonizator.base_url_full, $(this).attr('data-url'), false, false );
                            $(this).find(' .insert-url').text(text);
                            break;

                        //Копировать файл
                        case 'copy_file':
                            $(this).append('\
                        <div class="row">\
                            <div class="col-xs-8">\
                                <div class="btn-group btn-group-sm btn-group-justified">\
                                    <a href="#" class="btn btn-default btn-action">Копировать файл</a>\
                                    <a href="#" class="btn btn-danger btn-forcibly">с заменой</a>\
                                </div>\
                            </div>\
                            <div class="col-xs-4">\
                                <a href="#insert-url-'+i+'" class="btn btn-default btn-sm btn-block btn-copy-text">Копировать</a>\
                            </div>\
                        </div>\
                        <a href="#" class="insert-url btn btn-link btn-sm"></a>');
                            text = urlToTag($(this).attr('data-url'));
                            $(this).find(' .insert-url').text(text);
                            break;
                    }

                    $(this).find(' a.btn-copy-text').zclip({
                        path: 'shablonizator/js/ZeroClipboard.swf',
                        copy: text,
                        afterCopy: function(){
                            $(this).addClass('btn-success');
                            var ____ = this;
                            setTimeout(function(){
                                ____.removeClass('btn-success');
                            }, 500);
                        }
                    });
                }
            });

            //Выбор папки и выполнение ПАКА
            $TAB.find(' .gc-tab-insert .btn-action-pack')
                .add($TAB.find(' .gc-tab-insert .btn-forcibly-pack')).on('click', function(){
                var $containerPack, $container, forcibly, url, insertFiles;

                $containerPack = $(this).closest('.insert-pack');
                forcibly = $(this).hasClass('btn-forcibly-pack');
                insertFiles = generatedCode.files;

                options.gctci__fileManager.open({
                    selected: 'folder',
                    closeAfterSelecting: true,
                    leftNav: false,
                    folderPanel: true,
                    zoomPanel: false
                });

                options.gctci__fileManager.one('selected', function(folder){
                    if(folder !== false)
                    {
                        $containerPack.find('[data-action][data-url]').each(function(){
                            $container = $(this);
                            if(/(create_folder|create_file|copy_folder|copy_file)/gim.test($container.attr('data-action')))
                            {
                                url = $container.attr('data-url');
                                create_Copy__File_Folder($container, forcibly, url, folder, insertFiles);
                            }
                        });
                    }
                });
            });
            //==========
            //Выбор папки и выполнение
            $TAB.find(' .gc-tab-insert .btn-action')
                .add($TAB.find(' .gc-tab-insert .btn-forcibly')).on('click', function(){
                var $container, forcibly, url, insertFiles;

                $container = $(this).closest('[data-action][data-url]');
                forcibly = $(this).hasClass('btn-forcibly');
                insertFiles = generatedCode.files;

                options.gctci__fileManager.open({
                    selected: 'folder',
                    closeAfterSelecting: true,
                    leftNav: false,
                    folderPanel: true,
                    zoomPanel: false
                });

                if($container.size() && /(create_folder|create_file|copy_folder|copy_file)/gim.test($container.attr('data-action')))
                {
                    url = $container.attr('data-url');

                    options.gctci__fileManager.one('selected', function(folder){
                        if(folder !== false)
                        {
                            create_Copy__File_Folder($container, forcibly, url, folder, insertFiles);
                        }
                    });
                }
            });
            //==========

            function create_Copy__File_Folder($container, forcibly, url, folder, insertFiles) {
                url = $.trim(url);
                switch($container.attr('data-action')){
                    //Создать папку
                    case 'create_folder':
                        var code = str.intermediateUrl( shablonizator.base_url_full, (folder[0].url != '') ? folder[0].url+'/'+url : url, false, false );

                        shablonizator.createFolder((folder[0].url != '') ? folder[0].url+'/'+url : url);

                        $container.find('a.btn-copy-text').zclip({
                            path: 'shablonizator/js/ZeroClipboard.swf',
                            copy: code,
                            afterCopy: function(){
                                $(this).addClass('btn-success');
                                var ____ = this;
                                setTimeout(function(){
                                    ____.removeClass('btn-success');
                                }, 500);
                            }
                        });

                        $container.find(' .insert-url').text(code);
                        break;
                    //Создать файл
                    case 'create_file':
                        var resUrl;
                        var code;
                        if(folder[0].url != '') {
                            resUrl = folder[0].url+'/'+url;
                        } else {
                            resUrl = url;
                        }
                        code = urlToTag(resUrl);

                        var textFile;
                        if($container.attr('data-name') !== undefined && $container.attr('data-name') != '' && ($container.attr('data-name') in insertFiles)) {
                            textFile = insertFiles[$container.attr('data-name')];
                        } else {
                            throw new Error('нету атрибута data-name или нет кода файла');
                        }

                        shablonizator.createFile(resUrl, textFile, forcibly)

                        $container.find('a.btn-copy-text').zclip({
                            path: 'shablonizator/js/ZeroClipboard.swf',
                            copy: code,
                            afterCopy: function(){
                                $(this).addClass('btn-success');
                                var ____ = this;
                                setTimeout(function(){
                                    ____.removeClass('btn-success');
                                }, 500);
                            }
                        });

                        $container.find(' .insert-url').text(code);
                        break;
                    //Копировать папку
                    case 'copy_folder':
                        var code = str.intermediateUrl( shablonizator.base_url_full, folder[0].url, false, false );

                        var sourceFolder = options.basePathGenerators + $container.attr('data-src');
                        var selectFolder;
                        if(folder[0].url != '' && url != '') {
                            selectFolder = folder[0].url + '/' + url;
                        } else {
                            selectFolder = folder[0].url + url;
                        }

                        shablonizator.copyFolder(sourceFolder, selectFolder, forcibly);

                        $container.find('a.btn-copy-text').zclip({
                            path: 'shablonizator/js/ZeroClipboard.swf',
                            copy: code,
                            afterCopy: function(){
                                $(this).addClass('btn-success');
                                var ____ = this;
                                setTimeout(function(){
                                    ____.removeClass('btn-success');
                                }, 500);
                            }
                        });

                        $container.find(' .insert-url').text(code);

                        //Поиск подключаемых файлов в которых начало пути или весь путь совпадает с путём папки
                        $TAB.find(' [data-action][data-url]').each(function(){
                            if(/(copy_file)/gim.test($(this).attr('data-action')) && sourceFolder != '') {
                                var code;

                                code = options.basePathGenerators + $(this).attr('data-src');

                                if(code.indexOf(sourceFolder+'/') == 0) {
                                    code = code.substr(sourceFolder.length);
                                    if(code.indexOf('/') == 0) {
                                        code = code.substr(1);
                                    }
                                    if(selectFolder != '' && selectFolder != '.') {
                                        code = selectFolder+'/'+code;
                                    }

                                    code = urlToTag(code);

                                    $(this).find('a.btn-copy-text').zclip({
                                        path: 'shablonizator/js/ZeroClipboard.swf',
                                        copy: code,
                                        afterCopy: function(){
                                            $(this).addClass('btn-success');
                                            var ____ = this;
                                            setTimeout(function(){
                                                ____.removeClass('btn-success');
                                            }, 500);
                                        }
                                    });

                                    $(this).find(' .insert-url').text(code);
                                }
                            }
                        });
                        //==========
                        break;
                    //Копировать файл
                    case 'copy_file':
                        var src = options.basePathGenerators + $container.attr('data-src');
                        var resUrl;

                        if(url != '') {
                            resUrl = url;
                        } else {
                            resUrl = (/\/?([^\/]+)$/gim.exec(src)[1]);
                        }
                        if(folder[0].url != '') {
                            resUrl = folder[0].url+'/'+resUrl;
                        }

                        var code = urlToTag(resUrl);

                        shablonizator.copyFile(src, resUrl, forcibly)

                        $container.find('a.btn-copy-text').zclip({
                            path: 'shablonizator/js/ZeroClipboard.swf',
                            copy: code,
                            afterCopy: function(){
                                $(this).addClass('btn-success');
                                var ____ = this;
                                setTimeout(function(){
                                    ____.removeClass('btn-success');
                                }, 500);
                            }
                        });

                        $container.find(' .insert-url').text(code);
                        break;
                }
            }

            function urlToTag(url) {
                if(/\.js$/gim.test(url))
                {
                    return '<script type="text/javascript" src="'+str.intermediateUrl( shablonizator.base_url_full, url, false, true )+'"></script>';
                }
                else if(/\.css$/gim.test(url))
                {
                    return '<link rel="stylesheet" href="'+str.intermediateUrl( shablonizator.base_url_full, url, false, true )+'"></link>';
                }
                else
                {
                    return str.intermediateUrl( shablonizator.base_url_full, url, false, true );
                }
            }
        }

        this.loadGenerator = function( folder ) {
            //доп. функция
            function val(obj) {
                for( var key in obj ) {
                    if( obj[key] ) {
                        return key;
                    }
                }
                return false;
            }

            var result = {};
            result.copy = {};
            result.insert = {};
            result.files = {};
            $.ajax({
                url: "shablonizator.php",
                type: "POST",
                cache: false,
                data: ({module: 'getfile', dir: "generators/" + folder + "/" + "copy.js", text_encoding: shablonizator.textEncodingServer}),
                async: false,
                success: function(data){
                    if(data != 'error_getfile_shablonizator156418546585415')
                    {
                        var fn;
                        (function (){
                            eval(data);
                        })();
                        result.copy = fn;
                    }
                }
            });
            $.ajax({
                url: "shablonizator.php",
                type: "POST",
                cache: false,
                data: ({module: 'getfile', dir: "generators/" + folder + "/" + "insert.js", text_encoding: shablonizator.textEncodingServer}),
                async: false,
                success: function(data){
                    if(data != 'error_getfile_shablonizator156418546585415')
                    {
                        var fn;
                        (function (){
                            eval(data);
                        })();
                        result.insert = fn;
                    }
                }
            });
            var transfer = {};
            transfer['base_url_full'] = shablonizator.base_url_full;
            transfer['text_encoding'] = shablonizator.textEncodingServer;
            transfer['folder_generator'] = folder;
            $.ajax({
                url: 'shablonizator/php/loader_generators.php',
                type: "POST",
                cache: false,
                data: transfer,
                async: false,
                success: function(data){
                    (function (fns){
                        var fn;
                        eval(data);
                    })(result.files);
                }
            });
            return result;
        }
        
        /*Очистить всё*/
        this._clear = function() {
            ____.editors.forEach(function(item, i, arr) {
                item.destroy();
            });
            ____.editors = new Array();
            $container.find(' .footer-tab .tab-pane').empty();
        }
    }
    
    modules.generatorCode__TabsCopyInsert = generatorCode__TabsCopyInsert;

})(jQuery);