(function($){

    var defaultOptions = {
        gcmf__fileManager: {},
        mainEditor: undefined//Основной редактор с которого парсить опции
    };

    var generatorCode__managerFields = function($container, options) {
        this._options = options;
        var ____ = this;
        ____.$container = $container;

        var generatorCode__dynamicBlocks = new modules.generatorCode__dynamicBlocks($container, this._options);

        this._create = function() {
            ____.generators = {};
            ____.editors = {};
            $container.on('db.updated', ____.handlerChangeDynamicBlocks);

            //Вставка адресов картинок
            var currentInputImg;
            $container.on('click', ' .gc__manager-fields .add-src-image button', function(e){
                currentInputImg = $(this).closest(' .add-src-image').first();

                options.gcmf__fileManager.open({
                    selected: 'file',
                    closeAfterSelecting: true,
                    leftNav: false,
                    folderPanel: true,
                    zoomPanel: true
                });
            });

            options.gcmf__fileManager.on('selected', function(img){
                if(/(jpg|png|gif)$/gim.test(img[0].url))
                {
                    currentInputImg.find(' input.gc-src').val(img[0].url);
                    currentInputImg.find(' input.gc-width').val(img[0].width);
                    currentInputImg.find(' input.gc-height').val(img[0].height);

                    var jsrc = currentInputImg.find(' input.gc-src');
                    jsrc.get(0).focus();
                    jsrc.get(0).setSelectionRange(jsrc.val().length, jsrc.val().length);

                    ____.event('change-params', currentInputImg);
                }
            });

            generatorCode__dynamicBlocks._create();
        }

        this._destroy = function() {
            
        }

        this._init = function() {

        }

        this.refresh = function() {
            ____._destroy();
            ____._create();
        }

        //создание редакторов В "form-options"
        this.refreshFieldsEditors = function() {
            var dublicate = {};
            var newEditors = {};

            var i = 0;
            $container.find(' .gc__manager-fields .option-editor[data-name]').each(function(){
                if($(this).attr('data-editor-number') === undefined)
                //Нету атрибута "data-editor-number"
                {
                    //console.log('Нету атрибута');
                    newEditors[i] = ____.formOptionsCreateEditor($(this));
                    $(this).attr('data-editor-number', i);
                }
                else if($(this).attr('data-editor-number') in dublicate)
                //Номер дублируеться
                {
                    //console.log('Номер дублируеться');
                    $(this).empty();
                    newEditors[i] = ____.formOptionsCreateEditor($(this));
                    $(this).attr('data-editor-number', i);
                }
                else if(!($(this).attr('data-editor-number') in ____.editors))
                //Такого номера нету в "____.editors"
                {
                    //console.log('Такого номера нету в');
                    newEditors[i] = ____.formOptionsCreateEditor($(this));
                    $(this).attr('data-editor-number', i);

                    dublicate[$(this).attr('data-editor-number')] = true;
                }
                else
                {
                    //console.log('oother');
                    newEditors[i] = ____.editors[$(this).attr('data-editor-number')];
                    $(this).attr('data-editor-number', i);
                    ____.editors[$(this).attr('data-editor-number')] = undefined;

                    dublicate[$(this).attr('data-editor-number')] = true;
                }
                i++;
            });
            //Удаление пропавших редакторов
            for(var i in ____.editors)
            {
                if(____.editors[i] !== undefined)
                {
                    ____.editors[i].destroy();
                }
            }

            ____.editors = newEditors;
        }

            //создание редактора В "form-options"
            this.formOptionsCreateEditor = function($editor) {
                //Чтоб несрабатывало событие "change" при вставке "setValue" текста по умолчанию
                var blockChange = true;
                //Парсим нужные данные
                var $editor = $editor;
    
                var name = $editor.attr('data-name');
                var mode = $editor.attr('data-mode') || 'text';
                var rows;
                var minRows, maxRows, defMinRows = 3, defMaxRows = 10;
                var text = ____.editorsDefText[name] || '';
                var rowsText = text.split(/\n/g).length;
                if($editor.attr('data-rows') !== undefined)
                {
                    rows = parseInt($editor.attr('data-rows'));
                }
                else
                {
                    minRows = $editor.attr('data-min-rows') || defMinRows; minRows = parseInt(minRows);
                    maxRows = $editor.attr('data-max-rows') || defMaxRows; maxRows = parseInt(maxRows);
                    if(rowsText < minRows)
                    {
                        rows = minRows;
                    }
                    else if(rowsText > maxRows)
                    {
                        rows = maxRows;
                    }
                    else
                    {
                        rows = rowsText;
                    }
                }
                //==========
    
                //Создаем редактор
                var optionEditor = ace.edit(editor);
                optionEditor.on('change', function(e){
                    for(var key in ____.editors)
                    {
                        var item = ____.editors[key];
                        if(!blockChange && item.isFocused())
                        {
                            _this.event('change-params', $(item.container));
                            break;
                        }
                    }
                });

                var $options = options.mainEditor.$session.find( " options" );

                optionEditor.setTheme(options.mainEditor.editor.getTheme());
    
                var session = optionEditor.getSession();
                session.setMode('ace/mode/'+mode);
                optionEditor.renderer.setShowGutter(false);//???????
                optionEditor.setFontSize($options.find('fontsize').text());
    
                var val = $options.find('softwrap').text().toLowerCase();
                var renderer = optionEditor.renderer;
                session.setUseWrapMode(val == "off");
                var col = parseInt(val) || null;//*
                renderer.setPrintMarginColumn(col || 80);
                session.setWrapLimitRange(col, col);
    
                optionEditor.setShowInvisibles($options.find('showhidden').text() == 'show');
                optionEditor.setShowFoldWidgets(true);
                optionEditor.setOption("enableEmmet", true);
    
                optionEditor.setValue(text, 0);
                blockChange = false;
    
                var reHeightOneLine = /(\d{1,4})px/gim;
                var HeightOneLine = reHeightOneLine.exec($('#editor .ace_text-layer .ace_line:nth-child(1)').css('height'));
                HeightOneLine = parseInt(HeightOneLine[1]);
                $editor.css({height: (HeightOneLine * rows + 20) + 'px'});//+20 изза скролла
    
                optionEditor.clearSelection();
                //==========
                return optionEditor;
            }

        this.parseParamsFormOptions = function() {
            ____.updateMarkHiddenFields();

            var parsedOption = {};
            console.time('PARSE');
            //Получаем все элементы
            var $managerFields = $container.find(' .gc__manager-fields');
            var $fields__text = $managerFields.find(' input[type="text"][name][data-is-parse=\"1\"]')
                .add($managerFields.find(' textarea[name][data-is-parse=\"1\"]'));
            var $fields__button = $managerFields.find(' input[type="radio"][name][data-is-parse=\"1\"]')
                .add($managerFields.find(' input[type="checkbox"][name][data-is-parse=\"1\"]'));
            var $fields__select = $managerFields.find(' select[name][data-is-parse=\"1\"]');
            var $fields__editors = $managerFields.find(' .option-editor[data-name][data-is-parse=\"1\"]');
            
            //fields text
                ____._setValuesElements($fields__text, function(nameList) {
                    nameList.push($(this).attr("name"));
                }, function($el) {
                return $el.val();
            }, parsedOption);
            //fields button
                ____._setValuesElements($fields__button, function(nameList) {
                    nameList.push($(this).attr("name"));
                    nameList.push($(this).val());
                }, function($el) {
                if($el.prop("checked")) {
                    return 1;
                } else {
                    return 0;
                }
            }, parsedOption);
            //fields select
                var hook = ____._setOneValueElement;
                ____._setOneValueElement = function(nameList, $el, getValueElement, options) {
                    var current = options;
                    for(var i in nameList) {
                        var name = nameList[i];

                        if( typeof name == "string" ) {
                            if( !(name in current) ) {
                                if( (i + 1) < nameList.length ) {
                                    if( typeof nameList[i + 1] == "string" ) {
                                        current[name] = {};
                                    } else {
                                        current[name] = new Array();
                                    }
                                } else {
                                    //modified
                                    current[name] = {};
                                    current = current[name];
                                    $el.find(" option").each(function() {
                                        current[$(this).val()] = getValueElement( $(this) );
                                    });
                                    //modified (END)
                                    break;
                                }
                            }
                        } else {
                            if( (i + 1) < nameList.length ) {
                                if( typeof nameList[i + 1] == "string" ) {
                                    current[name] = {};
                                } else {
                                    current[name] = new Array();
                                }
                            } else {
                                //modified
                                current[name] = {};
                                current = current[name];
                                $el.find(" option").each(function() {
                                    current[$(this).val()] = getValueElement( $(this) );
                                });
                                //modified (END)
                                break;
                            }
                        }

                        current = current[name];
                    }
                }
                ____._setValuesElements($fields__select, function(nameList) {
                    nameList.push($(this).attr("name"));
                }, function($el) {
                    if($el.prop("selected")) {
                        return 1;
                    } else {
                        return 0;
                    }
                }, parsedOption);
                ____._setOneValueElement = hook;
            //fields editors
                ____._setValuesElements($fields__editors, function(nameList) {
                    nameList.push($(this).attr("data-name"));
                }, function($el) {
                return ____.editors[$el.attr('data-editor-number')].getValue();
            }, parsedOption);
            console.timeEnd('PARSE');
            return parsedOption;
        }

            this._setValuesElements = function($fields, pushNames, getValueElement, options) {
                $fields.each(function(){
                    //console.log($(this));
                    var nameList = ____._parseNameListParents( $(this) );
                    pushNames.call(this, nameList);

                    ____._setOneValueElement(nameList, $(this), getValueElement, options);
                });
            }

                this._parseNameListParents = function($el) {
                    return $el
                        .parents("[data-name], [data-repeater-index]")//.filter($('.gc__manager-fields *'))//переписать(МОЖЕТ ПАРСИТЬ ДАННЫЕ С КЛОНА?)
                        .map(function() {
                            if( $(this).is("[data-name]") ) {
                                return $(this).attr("data-name");
                            } else {
                                return parseInt($(this).attr("data-repeater-index"));
                            }
                        })
                        .get()
                        .reverse();
                }

                this._setOneValueElement = function(nameList, $el, getValueElement, options) {
                    var current = options;
                    for(var i in nameList) {
                        i = parseInt(i);
                        var name = nameList[i];

                        if( typeof name == "string" ) {
                            if( !(name in current) ) {
                                if( (i + 1) < nameList.length ) {
                                    if( typeof nameList[i + 1] == "string" ) {
                                        current[name] = {};
                                    } else {
                                        current[name] = new Array();
                                    }
                                } else {
                                    current[name] = getValueElement($el);
                                    break;
                                }
                            }
                        } else {
                            if( (i + 1) < nameList.length ) {
                                if( typeof nameList[i + 1] == "string" ) {
                                    current[name] = {};
                                } else {
                                    current[name] = new Array();
                                }
                            } else {
                                current[name] = getValueElement($el);
                                break;
                            }
                        }

                        current = current[name];
                    }
                }

            this.updateMarkHiddenFields = function() {
                var $managerFields = $container.find(' .gc__manager-fields');
                var $fields = $managerFields.find(' input[type="text"][name]')
                    .add($managerFields.find(' textarea[name]'))
                    .add($managerFields.find(' input[type="radio"][name]'))
                    .add($managerFields.find(' input[type="checkbox"][name]'))
                    .add($managerFields.find(' select[name]'))

                    .add($managerFields.find(' .option-editor[data-name]'));
                $fields.attr("data-is-parse", "1");

                $fields.filter($managerFields.find("[data-show=\"0\"] *")).attr("data-is-parse", "0");
            }

            this.validityCheck = function() {
                var errorValidate = false;
                //Проверка инпутов
                $container.find(' .gc__manager-fields [data-is-parse="1"][data-validate]')
                    .filter('input[type="text"][name], textarea[name], .option-editor[data-name]')
                    .each(function(){
                    var regValid = $(this).attr('data-validate');
                    regValid =  new RegExp(regValid, 'gim');

                    var value;
                    if($(this).hasClass('option-editor'))
                    {
                        value = ____.editors[$(this).attr('data-editor-number')].getValue();
                    }
                    else
                    {
                        value = $(this).val();
                    }
                    
                    if(regValid.test(value)) {
                        if($(this).parent('*').hasClass('input-group')) {
                            $(this).parent('*').removeClass('has-error');
                        } else {
                            $(this).removeClass('input-error');
                        }
                    } else {
                        if($(this).parent('*').hasClass('input-group')) {
                            $(this).parent('*').addClass('has-error');
                        } else {
                            $(this).addClass('input-error');
                        }

                        errorValidate = true;
                    }
                });

                return errorValidate;
            }

        this.loadOptions = function( folder ) {
            var result = {};
            result.html = "";
            result.defText = {};
            $.ajax({
                url: "shablonizator.php",
                type: "POST",
                cache: false,
                data: ({module: 'getfile', dir: "generators/" + folder + "/" + "options.js", text_encoding: shablonizator.textEncodingServer}),
                async: false,
                success: function(data){
                    if(data != 'error_getfile_shablonizator156418546585415')
                    {
                        (function (code){
                            eval(data);
                        })(result);
                    }
                }
            });
            return result;
        }

        this.pasteContent = function ( html ) {
            //Контейнер ".gc__manager-fields-events-wrap" зделал чтоб с ним удалялись обработчики "form-options-js" но неудалялись обработчики обьекта "generatorCode__dynamicBlocks" с ".gc__manager-fields"
            if( !$container.find(' .gc__manager-fields-events-wrap').size() ) {
                $container.find(' .gc__manager-fields').append("<div class='gc__manager-fields-events-wrap'></div>");
            }
            $container.find(' .gc__manager-fields-events-wrap').append(html);
        }

        this.reinitForNewContent = function () {
            generatorCode__dynamicBlocks.reinitForNewContent();
            ____.handlerChangeContentOptions();
        }

        /*Очистить всё*/
        this._clear = function() {
            for(var key in ____.editors)
            {
                if(____.editors[key] !== undefined)
                {
                    ____.editors[key].destroy();
                }
                delete ____.editors[key];
            }

            $container.find(' .gc__manager-fields').empty();
        }

        this.handlerChangeDynamicBlocks = function() {
            $container.trigger("gcmf.updated");
            ____.handlerChangeContentOptions();
        }

        this.handlerChangeContentOptions = function() {
            ____.refreshSelectpicker();
            $container.find(' .spinner').each(function(){
                if(!$(this).hasClass('ui-spinner-input'))
                {
                    $(this).spinner();
                }
            });

            ____.refreshFieldsEditors();
            for(var i in ____.editors)
            {
                ____.editors[i].resize();
            }
        }

        this.refreshSelectpicker = function() {
            $container.find(' .selectpicker').selectpicker();

            //Переносим подсказки из тега "select" в код "Selectpicker"
            $container.find(' .selectpicker').each(function(){
                var bootstrapSelect = $(this).find(' + .bootstrap-select');

                //МОЖЕТ УЖЕ НЕРАБОТАТЬ ТАК КАК СТРУКТУРА HTML У СЕЛЕКТПИККЕРА ПОМЕНЯЛАСЬ...
                $(this.attributes).each(function() {
                    if(/^data/gim.test(this.name))
                    {
                        bootstrapSelect.attr(this.name, this.value);
                    }
                });
            });
        }
    }
    
    modules.generatorCode__managerFields = generatorCode__managerFields;

})(jQuery);