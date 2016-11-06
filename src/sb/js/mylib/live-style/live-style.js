(function($){//Модули: 

    var defaultOptions = {
        searchPreprocessorFilesInCurrentFolder: true,
        relativeFoldersForPreprocessorFiles: []//{pattern: "", ignoreCase: bolean, relativeFolder: ""}
    };

    var liveStyle = function($container, options) {
        this._options = options;
        var ____ = this;
        ____.$container = $container;

        this._create = function() {
            //Свойства
            ____.filesUrl = new Array();
            ____.filesUrlFromLinkTag = new Array();
            ____.files = {};

            //События
            //$( "body" ).on("click click.body.iframe", ____.handlerClickBeyondLimits);
        }

        this._insertCommentSrcLine = function( url, extension, code ) {
            var numberLine = 0;
            var thisScope = "casual";

            var tempLeftTabLine = null;

            var odd = true;
            return code.replace(/^([\s\S]*?)$/gim, function(str){
                if( odd ) {
                    //console.log(str);
                    odd = false;
                    numberLine++;
                    var t;
                    var prevLeftTabLine = tempLeftTabLine;
                    var leftTabLine = ( (t = /^(\s*)/gim.exec(str)) !== null ) ? t[1] : "";
                    tempLeftTabLine = leftTabLine;
                    if( extension == "css" ) {
                        return str.replace(/([^\\]|^)(\\\\)*(\/\*|\*\/|"|'|\{)/gim, function(str, p1, p2, scope, offset, s){
                            switch (thisScope) {
                                case "casual":
                                    if( scope != "{" ) {
                                        if( scope != "*/" ) {
                                            thisScope = scope;
                                        }
                                    } else {
                                        return addCommentSrcLine( str );
                                    }
                                    break;
                                case "/*":
                                    if( scope == "*/" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                                case "\"":
                                    if( scope == "\"" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                                case "'":
                                    if( scope == "'" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                            }

                            return str;
                        });
                    }

                    if( extension == "less" || extension == "scss" ) {
                        return str.replace(/([^\\]|^)(\\\\)*(\/\*|\*\/|\/\/[\s\S]*?$|"|'|\{)/gim, function(str, p1, p2, scope, offset, s){
                            switch (thisScope) {
                                case "casual":
                                    if( scope != "{" ) {
                                        if( scope != "*/" ) {
                                            thisScope = scope;
                                        }
                                    } else {
                                        if( (extension == "less") && (offset > 1) && (s.substr(offset + str.length - 2, 1) != "@") ) {//фильтр от таких конструкций - @{base-url}
                                            return addCommentSrcLine( str );
                                        }

                                        if( (extension == "scss") && (offset > 1) && (s.substr(offset + str.length - 2, 1) != "#") ) {//фильтр от таких конструкций - #{$selector}
                                            return addCommentSrcLine( str );
                                        }
                                    }
                                    break;
                                case "/*":
                                    if( scope == "*/" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                                case "\"":
                                    if( scope == "\"" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                                case "'":
                                    if( scope == "'" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                            }

                            return str;
                        });
                    }

                    if( extension == "sass" ) {
                        str.replace(/([^\\]|^)(\\\\)*(\/\*|\*\/|\/\/[\s\S]*?$|"|')/gim, function(str, p1, p2, scope, offset, s){
                            switch (thisScope) {
                                case "casual":
                                    if( scope != "*/" ) {
                                        thisScope = scope;
                                    }
                                    break;
                                case "/*":
                                    if( scope == "*/" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                                case "\"":
                                    if( scope == "\"" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                                case "'":
                                    if( scope == "'" ) {
                                        thisScope = "casual";
                                    }
                                    break;
                            }

                            return str;
                        });

                        if( prevLeftTabLine !== null && (prevLeftTabLine.length < leftTabLine.length) ) {
                            return addCommentSrcLineForSASS( str );
                        }

                        return str;
                    }
                } else {
                    odd = true;
                    return str;
                }

                function addCommentSrcLine( str ) {
                    return str += "\n\t" + leftTabLine + "-e-content: \"" + (numberLine + ":" + url) + "\";";
                }

                function addCommentSrcLineForSASS( str ) {
                    return str = leftTabLine + "-e-content: \"" + (numberLine + ":" + url) + "\"" + "\n" + str;
                }
            });
        }

        this._parseStyleFilesFromDocument = function( $containerDocument, urlDocument ) {
            ____.filesUrl = new Array();
            ____.filesUrlFromLinkTag = new Array();
            ____.files = {};

            $containerDocument.find('link[href]').each(function(){
                var currentHref = $(this).attr('href');
                var $currentTag = $(this);

                var fileExtension;
                if( (fileExtension = /\.(less|css)(\?[^\?]+)?$/gim.exec(currentHref)) !== null )
                {
                    fileExtension = fileExtension[1];
                    var urlPageFull = str.intermediateUrl( shablonizator.base_url_full, urlDocument );
                    var urlLinkFull = str.intermediateUrl( urlPageFull, currentHref );
                    var urlRelative = str.relativeUrlFrom2Absolute( shablonizator.base_url_full, urlLinkFull );
                    if( urlRelative != "error:domains_do_not_match" )
                    {
                        var searchFileUrls = new Array();

                        if( fileExtension == "less" ) {
                            if( !loadFile(urlRelative, "less") ) {
                                console.log( "Неудалось загрузить файл:" + currentHref );
                            }
                        } else {
                            var searchFileTypes = ["sass", "less", "scss"];

                            for( var i in ____._options.relativeFoldersForPreprocessorFiles ) {
                                var relativeFolder = ____._options.relativeFoldersForPreprocessorFiles[i];
                                //перенаправление
                                var urlLinkFull__rerouting = relativeFolder.relativeFolder;
                                if( !(/\/$/.test(urlLinkFull__rerouting)) && urlLinkFull__rerouting != "" ) {
                                    urlLinkFull__rerouting += "/";
                                }
                                urlLinkFull__obj = str.parsingUrl( urlLinkFull );
                                urlLinkFull__rerouting += urlLinkFull__obj.fileNameFull + urlLinkFull__obj.paramsStr + ( (urlLinkFull__obj.hash !== null)?"#"+urlLinkFull__obj.hash:"" );
                                var resUrl = str.relativeUrlFrom2Absolute( shablonizator.base_url_full, str.intermediateUrl(urlLinkFull, urlLinkFull__rerouting ) );

                                var pattern = RegExp( relativeFolder.pattern, (relativeFolder.ignoreCase)?"i":"" );
                                if( pattern.test(currentHref) ) {
                                    for( var ext in searchFileTypes ) {
                                        //Добавляем "/" если её нет в конце
                                        if( !/[\\\/]$/.test(relativeFolder.relativeFolder) ) {
                                            relativeFolder.relativeFolder += "\/";
                                        }
                                        
                                        //Заменяем расширение файла
                                        searchFileUrls.push( resUrl.replace(/(\.)(css)((\?[^\?]+)?$)/i, "$1" + searchFileTypes[ext] + "$3") );
                                    }
                                }
                            }

                            if( ____._options.searchPreprocessorFilesInCurrentFolder ) {
                                for( var ext in searchFileTypes ) {
                                    //Заменяем расширение файла
                                    var resUrl = urlRelative.replace(/(\.)(css)((\?[^\?]+)?$)/i, "$1" + searchFileTypes[ext] + "$3")

                                    searchFileUrls.push( resUrl );
                                }
                            }

                            searchFileUrls.push( urlRelative );

                            var notLoadFile = true;
                            for( var i in searchFileUrls ) {
                                if( loadFile(searchFileUrls[i], /\.(\w{0,14})(\?[^\?]+)?$/gim.exec(searchFileUrls[i])[1], urlRelative ) ) {
                                    notLoadFile = false;
                                    break;
                                }
                            }
                            if( notLoadFile ) {
                                console.log( "Неудалось загрузить файл:" + urlRelative );
                            }
                        }
                    }
                    else {
                        //console.log( "Файл находиться на другом домене:" + currentHref);
                    }

                    function loadFile( urlRelative, fileExtension, urlCssFileCompileResults ) {
                        var loaded = true;
                        $.ajax({
                            url: "sb.php",
                            type: "POST",
                            cache: false,
                            data: ({module: 'getfile', dir: urlRelative, text_encoding: shablonizator.textEncodingServer}),
                            async: false,
                            success: function(data){
                                if( !/error_getfile_shablonizator156418546585415$/.test(data) ){
                                    if( !(urlRelative in ____.files) ) {
                                        ____.filesUrl.push(urlRelative);
                                        ____.filesUrlFromLinkTag.push(urlRelative);
                                    }
                                    ____.files[urlRelative] = {};
                                    ____.files[urlRelative].urlRelativeCurrentDocument = str.relativeUrlFrom2Absolute( urlPageFull, urlLinkFull ).replace(/\?[^\?]+$/gim, "");
                                    ____.files[urlRelative].code = data;
                                    ____.files[urlRelative].codeLineComment = ____._insertCommentSrcLine( urlRelative, fileExtension, data );
                                    ____.files[urlRelative].fileExtension = fileExtension;
                                    ____.files[urlRelative].availableFile = true;
                                    ____.files[urlRelative].isLinkTagFile = true;
                                    ____.files[urlRelative].$container = $currentTag;
                                    ____.files[urlRelative].concate_style = "";
                                    ____.files[urlRelative].result_style = "";
                                    ____.files[urlRelative].result_style__for_document = "";
                                    if( fileExtension != "css" && urlCssFileCompileResults !== undefined ) {
                                        ____.files[urlRelative].urlCssFileCompileResults = urlCssFileCompileResults;
                                    }
                                } else {
                                    loaded = false;
                                }
                            }
                        });
                        return loaded;
                    }
                }
            });
        }

            this._downloadMissingFilesFromImports = function( url, urlDocument ) {
                //Ставим значение connectedProjectFile для всех файлов в false. Возвращаем true если находим такой файл в импортах
                for( var key in ____.files ) {
                    if( !(____.files[key].isLinkTagFile) ) {
                        ____.files[key].connectedProjectFile = false;
                    }
                }
                //==========

                ____.files[url].importsPositionAndUrl = new Array();
                ____.files[url].importsPositionAndUrlForLineComments = new Array();

                var fileExtension = /\.(\w{0,14})(\?[^\?]+)?$/gim.exec(url)[1];
                if( fileExtension == "css" )
                {
                    var re__import = /(\/\*[\s\S]*?\*\/|"[^"]*?"|'[^']*?'|@import[\s]+(url\(([^\(\)"']+?)\)|url\('([^\(\)"']+?)'\)|url\("([^\(\)"']+?)"\)|"([^"]*?)"|'([^']*?)');)/gim;//Ищет import'ы для css
                    var re__import_for_line_comment = /(\/\*[\s\S]*?\*\/|"[^"]*?"|'[^']*?'|@import[\s]+(url\(([^\(\)"']+?)\)|url\('([^\(\)"']+?)'\)|url\("([^\(\)"']+?)"\)|"([^"]*?)"|'([^']*?)');)/gim;//Ищет import'ы для css
                }
                else if( fileExtension == "less" || fileExtension == "scss" ) {
                    var re__import = /(\/\*[\s\S]*?\*\/|\/\/[\s\S]*?$|"[^"]*?"|'[^']*?'|@import[\s]+(url\(([^\(\)"']+?)\)|url\('([^\(\)"']+?)'\)|url\("([^\(\)"']+?)"\)|"([^"]*?)"|'([^']*?)');)/gim;//Ищет import'ы для less, scss
                    var re__import_for_line_comment = /(\/\*[\s\S]*?\*\/|\/\/[\s\S]*?$|"[^"]*?"|'[^']*?'|@import[\s]+(url\(([^\(\)"']+?)\)|url\('([^\(\)"']+?)'\)|url\("([^\(\)"']+?)"\)|"([^"]*?)"|'([^']*?)');)/gim;//Ищет import'ы для less, scss
                }
                else {
                    var re__import = /(\/\*[\s\S]*?\*\/|\/\/[\s\S]*?$|"[^"]*?"|'[^']*?'|@import[\s]+(url\(([^\(\)"']+?)\)|url\('([^\(\)"']+?)'\)|url\("([^\(\)"']+?)"\)|"([^"]*?)"|'([^']*?)'))/gim;//Ищет import'ы для sass
                    var re__import_for_line_comment = /(\/\*[\s\S]*?\*\/|\/\/[\s\S]*?$|"[^"]*?"|'[^']*?'|@import[\s]+(url\(([^\(\)"']+?)\)|url\('([^\(\)"']+?)'\)|url\("([^\(\)"']+?)"\)|"([^"]*?)"|'([^']*?)'))/gim;//Ищет import'ы для sass
                }
                var url__import;
                var extension__import;
                while( (url__import = re__import.exec( ____.files[url].code )) !== null ) {
                    re__import_for_line_comment.exec( ____.files[url].codeLineComment );
                    var rule__import = url__import[1];
                    if( /^\@import/i.test(rule__import) ) {
                        url__import = url__import[3] || url__import[4] || url__import[5] || url__import[6] || url__import[7];
                        if( (extension__import = /\.(\w{0,14})(\?[^\?]+)?$/gim.exec(url__import)) !== null ) {
                            extension__import = extension__import[1];
                            if( extension__import == "css" || extension__import == fileExtension ) {
                                var urlPageFull = str.intermediateUrl( shablonizator.base_url_full, urlDocument );
                                var urlLinkFull = str.intermediateUrl( shablonizator.base_url_full, url );
                                var urlImportFull = str.intermediateUrl( urlLinkFull, url__import );
                                var urlRelative = str.relativeUrlFrom2Absolute( shablonizator.base_url_full, urlImportFull ).replace(/\?[^\?]+$/gim, "");
                                if( urlRelative != "error:domains_do_not_match" ) {
                                    if( !(urlRelative in ____.files) ) {
                                        ____.files[urlRelative] = {};
                                        ____.filesUrl.push(urlRelative);
                                        //Загрузка файла
                                        $.ajax({
                                            url: "sb.php",
                                            type: "POST",
                                            cache: false,
                                            data: ({
                                                module: 'getfile',
                                                dir: urlRelative,
                                                text_encoding: shablonizator.textEncodingServer
                                            }),
                                            async: false,
                                            success: function (data) {
                                                if ( !/error_getfile_shablonizator156418546585415$/.test(data) ) {
                                                    ____.files[urlRelative].urlRelativeCurrentDocument = str.relativeUrlFrom2Absolute( urlPageFull, urlImportFull ).replace(/\?[^\?]+$/gim, "");
                                                    ____.files[urlRelative].code = data;
                                                    ____.files[urlRelative].codeLineComment = ____._insertCommentSrcLine( urlRelative, extension__import, data );
                                                    ____.files[urlRelative].fileExtension = extension__import;
                                                    ____.files[urlRelative].availableFile = true;
                                                    ____.files[urlRelative].isLinkTagFile = false;
                                                    ____.files[urlRelative].connectedProjectFile = true;

                                                    //Записываем в родительский файл импорты
                                                    ____.files[url].importsPositionAndUrl.push({
                                                        url: urlRelative,
                                                        start: re__import.lastIndex - rule__import.length,
                                                        length: rule__import.length
                                                    });

                                                    ____.files[url].importsPositionAndUrlForLineComments.push({
                                                        url: urlRelative,
                                                        start: re__import_for_line_comment.lastIndex - rule__import.length,
                                                        length: rule__import.length
                                                    });

                                                    //Рекурсия
                                                    ____._downloadMissingFilesFromImports( urlRelative, urlDocument );
                                                } else {
                                                    ____.files[urlRelative].availableFile = false;
                                                    ____.files[urlRelative].isLinkTagFile = false;
                                                    console.log("Неудалось загрузить файл:" + urlRelative);
                                                }
                                            }
                                        });
                                        //Конец загрузки файла
                                    } else {
                                        if( ____.files[urlRelative].availableFile ) {
                                            ____.files[urlRelative].connectedProjectFile = true;

                                            //Записываем в родительский файл импорты
                                            ____.files[url].importsPositionAndUrl.push({
                                                url: urlRelative,
                                                start: re__import.lastIndex - rule__import.length,
                                                length: rule__import.length
                                            });

                                            ____.files[url].importsPositionAndUrlForLineComments.push({
                                                url: urlRelative,
                                                start: re__import_for_line_comment.lastIndex - rule__import.length,
                                                length: rule__import.length
                                            });

                                            //Рекурсия
                                            ____._downloadMissingFilesFromImports( urlRelative, urlDocument );
                                        }
                                    }

                                } else {
                                    ____.files[urlRelative].availableFile = false;
                                    ____.files[urlRelative].isLinkTagFile = false;
                                    //console.log( "Файл находиться на другом домене:" + url__import);
                                }
                            }
                        }
                    }
                }
                
                function removeMissingFiles() {
                    for( var key in ____.files ) {
                        var file = ____.files[key];
                        if( !file.isLinkTagFile && (!("availableFile" in file) || file.availableFile) && (("connectedProjectFile" in file) && !file.connectedProjectFile) ) {
                            delete ____.files[key];
                        }
                    }
                }
            }

                this._downloadMissingFilesFromImports__allFromLinkTags = function( urlDocument ) {
                    for( var i in ____.filesUrlFromLinkTag ) {
                        ____._downloadMissingFilesFromImports( ____.filesUrlFromLinkTag[i], urlDocument );
                    }
                }

        this.concateAllStyles = function() {
            var concate_preprocessor = {};
            var coordinateCodePart;
            var globalShift;

            for( var i in ____.filesUrlFromLinkTag ) {

                /*Один файл подключённый через тег link*/
                globalShift = 0;
                coordinateCodePart = new Array();
                
                var file = ____.files[ ____.filesUrlFromLinkTag[i] ];
                
                concate_preprocessor[ ____.filesUrlFromLinkTag[i] ] = {};
                concate_preprocessor[ ____.filesUrlFromLinkTag[i] ].code = concateImportsRecursion( ____.filesUrlFromLinkTag[i], file );
                concate_preprocessor[ ____.filesUrlFromLinkTag[i] ].fileExtension = file.fileExtension;
                concate_preprocessor[ ____.filesUrlFromLinkTag[i] ].coordinateCodePart = coordinateCodePart;
                /*Один файл подключённый через тег link (END)*/

            }

            function concateImportsRecursion( id, file ) {
                var codeFile = file.codeLineComment;
                var localShift = 0;
                coordinateCodePart.push({
                    id: id,
                    start: globalShift
                });

                if( file.importsPositionAndUrlForLineComments.length ) {
                    globalShift += file.importsPositionAndUrlForLineComments[0].start;
                } else {
                    globalShift += codeFile.length;
                }
                
                for( var i in file.importsPositionAndUrlForLineComments ) {
                    i = parseInt( i );
                    var importPositionAndUrl = file.importsPositionAndUrlForLineComments[i];
                    var importFile = ____.files[ importPositionAndUrl.url ];

                    var before = codeFile.substring( 0, importPositionAndUrl.start + localShift );
                    var after = codeFile.substring( importPositionAndUrl.start + importPositionAndUrl.length + localShift );
                    if( !("availableFile" in importFile) || importFile.availableFile ) {
                        var importCode = concateImportsRecursion( importPositionAndUrl.url, importFile );
                        codeFile = before + importCode + after;
                        localShift += importCode.length - importPositionAndUrl.length;
                    } else {
                        codeFile = before + after;
                        globalShift -= importPositionAndUrl.length;
                        localShift -= importPositionAndUrl.length;
                    }

                    coordinateCodePart.push({
                        id: id,
                        start: globalShift
                    });

                    if( i < file.importsPositionAndUrlForLineComments.length - 1 ) {
                        globalShift += file.importsPositionAndUrlForLineComments[i + 1].start - (file.importsPositionAndUrlForLineComments[i].start + file.importsPositionAndUrlForLineComments[i].length);
                    } else {
                        globalShift += file.code.length - (file.importsPositionAndUrlForLineComments[i].start + file.importsPositionAndUrlForLineComments[i].length);
                    }
                }

                return codeFile;
            }

            return concate_preprocessor;
        }

            this.compileAndReplaceUrlAllStyles = function( concateAllStyles, urlDocument, callback ) {
                /*Вставка комментариев к каждой части кода с url этой части кода*/
                for( var id in concateAllStyles ) {
                    var oneConcate = concateAllStyles[ id ];
                    oneConcate.compiledNeeded = false;
                    oneConcate.changedItEdit = false;
                    if( oneConcate.code != ____.files[ id ].concate_style ) {
                        ____.files[ id ].concate_style = oneConcate.code;
                        oneConcate.changedItEdit = true;
                        if( oneConcate.fileExtension != "css" ) {
                            oneConcate.compiledNeeded = true;
                        }
                        var concate_style__comentUrlSection = "";
                        var positionInsertedSpecialCode = new Array();
                        var globalShift = 0;

                        for( var j in oneConcate.coordinateCodePart ) {
                            j = parseInt(j);
                            var a, b;
                            if( j == 0 ) {
                                a = 0;
                            } else {
                                a = oneConcate.coordinateCodePart[j].start;
                            }

                            if( j >= oneConcate.coordinateCodePart.length - 1) {
                                b = oneConcate.code.length;
                            } else {
                                b = oneConcate.coordinateCodePart[j + 1].start;
                            }

                            var positionCommentUrlSection = "/*+" + oneConcate.coordinateCodePart[j].id + "*/\n";
                            positionInsertedSpecialCode.push({
                                start: a + globalShift,
                                length: positionCommentUrlSection.length
                            });
                            globalShift += positionCommentUrlSection.length;
                            var codeFixComment = oneConcate.code.substring(a, b).replace(/(\/\*([\s\S]*?\*\/)|"[^"]*?"|'[^']*?')/gim, function(str, p1, p2, offset, s){
                                if( /^\/\*/g.test( p1 ) ) {
                                    positionInsertedSpecialCode.push({
                                        start: (a + offset + 2) + globalShift,//2 - /*
                                        length: 1//-
                                    });
                                    globalShift += 1;
                                    return "/*-" + p2;
                                } else {
                                    return str;
                                }
                            });

                            concate_style__comentUrlSection += ( positionCommentUrlSection + codeFixComment );
                        }

                        oneConcate.preparedCode = concate_style__comentUrlSection;
                        oneConcate.coordinateInsertedCode = positionInsertedSpecialCode;
                    }
                }
                /*Вставка комментариев к каждой части кода с url этой части кода (END)*/

                /*Компиляция препроцессоров*/
                var countCompiled = 0;
                for( var id in concateAllStyles ) {
                    oneConcate.compiledError = false;

                    var oneConcate = concateAllStyles[id];
                    if( oneConcate.compiledNeeded && oneConcate.changedItEdit ) {
                        countCompiled++;
                    }
                }

                for( var id in concateAllStyles ) {
                    var oneConcate = concateAllStyles[id];
                    if( oneConcate.changedItEdit ) {
                        if( oneConcate.compiledNeeded ) {
                            (function( _id, _oneConcate ) {
                                liveStyle._compilePreprocessorCode( oneConcate.preparedCode, oneConcate.fileExtension, true, function( error__ajax, error__compile, css, map ) {
                                    if( countCompiled > 0 ) {
                                        countCompiled--;
                                        if( error__ajax === false && error__compile === false ) {
                                            _oneConcate.css = css;
                                            _oneConcate.map = map;
                                        } else {
                                            _oneConcate.compiledError = true;
                                        }
                                    }

                                    if( countCompiled <= 0 ) {
                                        replaceUrlForCssResult();
                                    }
                                });
                            })( id, oneConcate );
                        } else {
                            //console.log(oneConcate.preparedCode);
                            oneConcate.css = oneConcate.preparedCode;
                            oneConcate.map = null;
                        }
                    }
                }

                if(countCompiled == 0) {
                    replaceUrlForCssResult();
                }
                /*Компиляция препроцессоров (END)*/

                /*Замема относительных путей в откомпилированном CSS на пути относительно документа и главного файла стилей*/
                function replaceUrlForCssResult() {
                    var absUrlDocument = str.intermediateUrl( shablonizator.base_url_full, urlDocument );

                    for( var id in concateAllStyles ) {
                        var oneConcate = concateAllStyles[id];
                        var file = ____.files[id];
                        var absUrlCssFileCompileResults = str.intermediateUrl( shablonizator.base_url_full, file.urlCssFileCompileResults );
                        if( (oneConcate.compiledNeeded && !(oneConcate.compiledError)) || (!(oneConcate.compiledNeeded) && oneConcate.changedItEdit) ) {

                            var absUrlSection;
                            var globalShift = 0;
                            var positionInsertedNewUrl = new Array();

                            var resultCss = oneConcate.css.replace(/(\/\*[\s\S]*?\*\/|"[^"]*?"|'[^']*?'|url\(\'[^']*\'\)|url\(\"[^"]*\"\))/gim, function(found_str, p1, offset, s){

                                /*Относительно какого url позиционировать url на ресурс*/
                                var urlSection;
                                if( (urlSection = /^\/\*\+([\s\S]*?)\*\//gim.exec(found_str)) !== null ) {
                                    urlSection = urlSection[1];
                                    if( oneConcate.fileExtension.toLowerCase() == "sass" || oneConcate.fileExtension.toLowerCase() == "scss" ) {
                                        absUrlSection = str.intermediateUrl(shablonizator.base_url_full, id);
                                    } else {
                                        absUrlSection = str.intermediateUrl(shablonizator.base_url_full, urlSection);
                                    }

                                    return found_str;
                                }
                                /*Относительно какого url позиционировать url на ресурс (END)*/

                                var parseUrl;
                                if( (parseUrl = /^url\((\'([^']*)\'|\"([^"]*)\")\)/gim.exec(found_str)) !== null ) {
                                    parseUrl = parseUrl[2] || parseUrl[3];
                                    var urlObj = str.parsingUrl( parseUrl );
                                    if( urlObj.type == "relative" ) {

                                        try {
                                            /*Собственно замена путей*/
                                            var absUrlMedia = str.intermediateUrl(absUrlSection, parseUrl);
                                            var relativeUrlMedia = str.relativeUrlFrom2Absolute(absUrlDocument, absUrlMedia);

                                            positionInsertedNewUrl.push({
                                                start: offset + 5 + globalShift,//+ 5 - url("
                                                length: relativeUrlMedia.length - parseUrl.length
                                            });
                                            globalShift += relativeUrlMedia.length - parseUrl.length;

                                            return 'url("' + relativeUrlMedia + '")';
                                            /*Собственно замена путей (END)*/
                                        } catch (e) {
                                            console.log( "Неудалось заменить url:" + parseUrl );
                                            return found_str;
                                        }
                                    } else {
                                        return found_str;
                                    }
                                } else {
                                    return found_str;
                                }
                            });

                            if( file.fileExtension != "css" && ("urlCssFileCompileResults" in file) ) {
                                var resultCss__forCssFileCompileResults = oneConcate.css.replace(/(\/\*[\s\S]*?\*\/|"[^"]*?"|'[^']*?'|url\(\'[^']*\'\)|url\(\"[^"]*\"\))/gim, function(found_str, p1, offset, s){

                                    /*Относительно какого url позиционировать url на ресурс*/
                                    var urlSection;
                                    if( (urlSection = /^\/\*\+([\s\S]*?)\*\//gim.exec(found_str)) !== null ) {
                                        urlSection = urlSection[1];
                                        if( oneConcate.fileExtension.toLowerCase() == "sass" || oneConcate.fileExtension.toLowerCase() == "scss" ) {
                                            absUrlSection = str.intermediateUrl(shablonizator.base_url_full, id);
                                        } else {
                                            absUrlSection = str.intermediateUrl(shablonizator.base_url_full, urlSection);
                                        }

                                        return found_str;
                                    }
                                    /*Относительно какого url позиционировать url на ресурс (END)*/

                                    var parseUrl;
                                    if( (parseUrl = /^url\((\'([^']*)\'|\"([^"]*)\")\)/gim.exec(found_str)) !== null ) {
                                        parseUrl = parseUrl[2] || parseUrl[3];
                                        var urlObj = str.parsingUrl( parseUrl );
                                        if( urlObj.type == "relative" ) {

                                            try {
                                                /*Собственно замена путей*/
                                                var absUrlMedia = str.intermediateUrl(absUrlSection, parseUrl);
                                                var relativeUrlMedia = str.relativeUrlFrom2Absolute(absUrlCssFileCompileResults, absUrlMedia);

                                                return 'url("' + relativeUrlMedia + '")';
                                                /*Собственно замена путей (END)*/
                                            } catch (e) {
                                                console.log( "Неудалось заменить url:" + parseUrl );
                                                return found_str;
                                            }
                                        } else {
                                            return found_str;
                                        }
                                    } else {
                                        return found_str;
                                    }
                                });

                                oneConcate.insertedUrlCode__forCssFileCompileResults = resultCss__forCssFileCompileResults;
                            }

                            oneConcate.insertedUrlCode = resultCss;
                            oneConcate.coordinateInsertedUrl = positionInsertedNewUrl;
                        }
                    }

                    if( callback !== undefined ) {
                        callback( concateAllStyles );
                    }
                }
                /*Замема относительных путей в откомпилированном CSS на пути относительно документа и главного файла стилей (END)*/
            }

            this._insertCompileCodeInDocument = function( concateAllStyles ) {
                for( var i in ____.filesUrlFromLinkTag ) {
                    var file = ____.files[ ____.filesUrlFromLinkTag[i] ];
                    var oneConcate = concateAllStyles[ ____.filesUrlFromLinkTag[i] ];
                    if( (oneConcate.compiledNeeded && !(oneConcate.compiledError)) || (!(oneConcate.compiledNeeded) && oneConcate.changedItEdit) ) {
                        if( file.$container.is( "link" ) ) {
                            file.$container.after('<style type="text/css"></style>');
                            var $oldTemp = file.$container;
                            file.$container = file.$container.find(" + style");
                            $oldTemp.remove();
                            
                            file.$container.attr("data-url", ____.filesUrlFromLinkTag[i]);
                        }

                        //console.log(oneConcate.insertedUrlCode);
                        file.$container.text( oneConcate.insertedUrlCode );
                    }
                }
                //console.log(concateAllStyles);
            }

            this._saveCssFileCompileResults__deleteMapFile = function( concateAllStyles ) {
                for( var i in ____.filesUrlFromLinkTag ) {
                    var file = ____.files[ ____.filesUrlFromLinkTag[i] ];
                    var oneConcate = concateAllStyles[ ____.filesUrlFromLinkTag[i] ];

                    if( ("insertedUrlCode__forCssFileCompileResults" in oneConcate) && file.result_style != oneConcate.insertedUrlCode__forCssFileCompileResults ) {
                        file.result_style = oneConcate.insertedUrlCode__forCssFileCompileResults;
                        if( "urlCssFileCompileResults" in file ) {
                            $.ajax({
                                url: "sb.php",
                                async: true,
                                type: "POST",
                                cache: false,
                                data: ({
                                    module: 'setfile',
                                    dir: file.urlCssFileCompileResults,
                                    file_text: oneConcate.insertedUrlCode__forCssFileCompileResults,
                                    text_encoding: shablonizator.textEncodingServer
                                }),
                                success: function (data) {
                                    if ('file_none' == data) {
                                        console.log('Файл: "' + file.urlCssFileCompileResults + '" отсутствует');
                                    } else if ('neudacha' == data) {
                                        console.log('Неполучилось записать в файл: "' + file.urlCssFileCompileResults + '"');
                                    }
                                }
                            });

                            var objCssFile = str.parsingUrl( file.urlCssFileCompileResults );

                            mapFileUrl = (new Array(objCssFile.numberOfFoldersUp + 1).join("../")) +
                                ((objCssFile.arrFolders.length)?objCssFile.arrFolders.join("/"):"");
                            if( !(/\/$/.test(mapFileUrl)) && mapFileUrl != "" ) {
                                mapFileUrl += "/";
                            }
                            mapFileUrl += objCssFile.fileNameFull + ".map";

                            $.ajax({
                                url: "sb.php",
                                async: true,
                                type: "POST",
                                cache: false,
                                data: ({
                                    module: 'setfile',
                                    dir: mapFileUrl,
                                    file_text: "",//Затираем map файл
                                    text_encoding: shablonizator.textEncodingServer
                                }),
                                success: function (data) {
                                    if ('file_none' == data) {
                                        console.log('Файл: "' + mapFileUrl + '" отсутствует');
                                    } else if ('neudacha' == data) {
                                        console.log('Неполучилось записать в файл: "' + mapFileUrl + '"');
                                    }
                                }
                            });
                        }
                    }
                }
            }

        this._deleteStyleTagsCreatedClientLessCompiler = function( $containerDocument ) {
            $containerDocument.find('link[href]').each(function() {
                var currentHref = $(this).attr('href');

                if ( /\.less(\?[^\?]+)?$/gim.exec(currentHref) !== null ) {
                    $(this).find(' + style[id^=less]').remove();
                }
            });
        }
    }

    liveStyle._compilePreprocessorCode = function( code, type, async, callback ) {
        var error__ajax = false;
        var error__compile = false;
        var css = '';

        try {
            var url = 'http://127.0.0.1:1335/';
            var XHR = window.XDomainRequest || window.XMLHttpRequest;
            var xhr = new XHR();
            xhr.open('POST', url, async);
            xhr.onload = function()
            {

                //Запрос успешен
                if( /^compiled\:/.test(xhr.responseText) ) {
                    var responseText = xhr.responseText.substring(9);
                    var cssAndMap = /^(\d+)\|([\S\s]+)$/gi.exec(responseText);
                    var css = cssAndMap[2].substring(0, parseInt(cssAndMap[1]));
                    var map = cssAndMap[2].substring(parseInt(cssAndMap[1]));
                    callback( error__ajax, error__compile, css, map );
                }
                else if( /^errorcompile\:/.test(xhr.responseText) ) {
                    console.log("Ошибка компиляции препроцессора:"+xhr.responseText.substring(13));
                    error__compile = xhr.responseText.substring(13);
                    callback( error__ajax, error__compile );
                }
                else if( /^errorcompiler\:/.test(xhr.responseText) ) {
                    console.log("Ошибка компилятора препроцессоров");
                    error__ajax = true;
                    callback( error__ajax, error__compile );
                }
                //Запрос успешен (конец)

            }
            xhr.onerror = function() {
                console.log("Ошибка отправки ajax запроса на компилятор препроцессоров");
                error__ajax = true;
                callback( error__ajax, error__compile );
            }
            xhr.send( 'text='+encodeURIComponent(code)+'&type='+encodeURIComponent(type) );
        }
        catch(e)
        {
            console.log("Ошибка в отправлятеле ajax запросов");
            error__ajax = true;
            callback( error__ajax, error__compile );
        }
    }
    
    modules.liveStyle = liveStyle;

})(jQuery);