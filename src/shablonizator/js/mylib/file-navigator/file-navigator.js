//-----------------------------------------------------
//Класс файловый менеджер
//-----------------------------------------------------

//а также зделать возможность отключить сохранение открытых папок а также загрузку их при старте работы файлового менеджера
//Реализовать восстановление прокрутки в сессии

(function($){
    var fileManager = function(jContainer, urlXMLSavedData)
    {
        //Свойства
        /*Статическое свойство со всеми созданными обьектами файловых менеджеров,
        для групповой обработки*/
        fileManager.fileManagers.push(this);
        
        //Флаги открыт и создан
        this.opened = false;
        this.created = false;
        
        //Для определения двойного клика в средней колонке (т.е. как из-за плагина selectable обычное событие jquery dblckick неработает)
        this.dblclickFDetail = {
            curentItem: undefined,
            start: {time: 0, cursorPosition: {x: undefined, y: undefined}},
            stop: {time: 0}
        };
        
        this.backFunc;//Обработчик собития переданный в метод "open"
        this.gEventList = {};//Все события с обработчиками
        this.gEventListOne = {};
        this.sortable;//Режим сортировки отображения папок и файлов
        this.openParams = {//Параметры переданные при открытии менеджера
            selected: 'files',
            closeAfterSelecting: false,
            textSelectingBtn: 'Выбрать',
            leftNav: true,
            folderPanel: false,
            zoomPanel: false
        };
        this.session = {//Сессия (чтоб при повторном открытии менеджера полностью ввостановить состояние работы)
            leftNav: {
                scrollX: 0,
                scrollY: 0
            },
            folderPanel: {
                scrollX: 0,
                scrollY: 0,
                currentFolder: '.'
            },
            zoomPanel: {
                scrollX: 0,
                scrollY: 0,
                currentIMG: null,
                w: null,
                h: null
            }
        };
        
        //Вспомогательные данные
        this.temp = {}
        
        /*Тэг контейнера в навигатора и url XML файла в котором храняться все открытые папки из предыдущей сессии,
        сам XML файл*/
        this.jContainer = jContainer;
        this.urlXMLSavedData = urlXMLSavedData;
        this.XMLFolderFiles;
        //==========
        
        //Выделение линии папки на которую навели вместе с её содержимым - в левой колонке
        this.jContainer.on({
            mouseover: function(e){
                e.data.jContainer.find(' .file-manager .col-left-nav .home .f-open').removeClass('hover');
                $(this).addClass('hover');
        		e.stopPropagation();
            },
            mouseout: function(e){
                e.data.jContainer.find(' .file-manager .col-left-nav .home .f-open').removeClass('hover');
        		e.stopPropagation();
            }
        }, ' .col-left-nav .home .f-open', {jContainer: this.jContainer});
        //==========
        //Свернуть развернуть папку
        this.jContainer.on('click', ' .file-manager .col-left-nav .disclosures-folder > .fa-plus-square-o', {this_: this}, function(e){
            if(e.data.this_.created)
            {
                var cont = $(this).parent('.disclosures-folder').parent('.f-close');
                var url = cont.find(' > a').attr('href');
                
                //Подгружаем папку в XML и в HTML
                if(cont.find(' > ul').size() == 0)
                {
                    e.data.this_.getXMLOneFolderContent(url, true, function(XMLFolderFiles){
                        cont.find(' > ul').remove();
                        cont.append(e.data.this_.generateOneFolderFromXML(XMLFolderFiles, false, false));
                        
                        //Для плавного появления
                        cont.css({height: Math.round(cont.outerHeight())});
                        
                        cont.removeClass('f-close').addClass('f-open').addClass('f-visible');
                        cont.find(' > ul').css({display: 'block'});
                        
                        var hA = Math.round(cont.find(' > a').outerHeight(true));
                        var hUl = Math.round(cont.find(' > ul').outerHeight());
                        cont.stop().animate({height: hA + hUl + 10}, 500, function(){//.file-manager .col-left-nav .home .f-open > a {margin-bottom: 10px;}
                            cont.css({height: 'auto'});
                        });
                        //==========
                        
                        e.data.this_.XMLFolderFiles.find(' folder[url_utf8="'+url+'"] > *').remove();
                        e.data.this_.XMLFolderFiles.find(' folder[url_utf8="'+url+'"]').attr('opened', 1);
                        e.data.this_.XMLFolderFiles.find(' folder[url_utf8="'+url+'"]').append(XMLFolderFiles.find(' > wrap > *'));
                    });
                }
                else
                {
                    //Для плавного появления
                    cont.css({height: Math.round(cont.outerHeight())});
                    
                    cont.removeClass('f-close').addClass('f-open').addClass('f-visible');
                    cont.find(' > ul').css({display: 'block'});
                    
                    var hA = Math.round(cont.find(' > a').outerHeight(true));
                    var hUl = Math.round(cont.find(' > ul').outerHeight());
                    cont.stop().animate({height: hA + hUl + 10}, 500, function(){//.file-manager .col-left-nav .home .f-open > a {margin-bottom: 10px;}
                        cont.css({height: 'auto'});
                    });
                    //==========
                    e.data.this_.XMLFolderFiles.find(' folder[url_utf8="'+url+'"]').attr('opened', 1);
                }
                //==========
            }
        });
        this.jContainer.on('click', ' .file-manager .col-left-nav .f-open > .disclosures-folder > .fa-minus-square-o', {this_: this}, function(e){
            if(e.data.this_.created)
            {
                var cont = $(this).parent('.disclosures-folder').parent('.f-open');
                cont.find(' > ul').css({display: 'block'});
                cont.addClass('f-visible').removeClass('f-open').addClass('f-close');
                
                //Для плавного скрытия
                var hA = Math.round(cont.find(' > a').outerHeight(true));
                var hUl = Math.round(cont.find(' > ul').outerHeight());
                cont.stop().animate({height: 16}, 500, function(){//Высота одной строки папки .file-manager .col-left-nav .home .f-open > a {margin-bottom: 10px;}
                    cont.css({height: 'auto'});
                    cont.find(' > ul').css({display: 'none'});
                    cont.removeClass('f-visible');
                });
                //==========
                
                var url = cont.find(' > a').attr('href');
                e.data.this_.XMLFolderFiles.find(' folder[url_utf8="'+url+'"]').attr('opened', 0);
            }
        });
        //==========
        //Кнопка "Выбрать"
        this.jContainer.on('click', ' .file-manager .panel-heading .btn-selected', {this_: this}, function(e){
            var selectedList = new Array();
            var leftList = e.data.this_.jContainer.find('.file-manager .col-left-nav .home li.selecting');
            var centerList = e.data.this_.jContainer.find('.file-manager .col-folder-detail .scroll-container li.ui-selected');
            
            if(leftList.size() == 1)
            {
                var href = leftList.find(' > a').first().attr('href');
                var isFolder = leftList.first().hasClass('folder');
                
                if(href == '#') {href = '';}
                
                var IMGXML = e.data.this_.XMLFolderFiles.find(' file[url_utf8="'+href+'"]');
                if(IMGXML.attr('image') || IMGXML.attr('image') == 'image')
                {
                    selectedList.push({isFolder: isFolder, url: href, width: parseInt(IMGXML.attr('width')), height: parseInt(IMGXML.attr('height'))});
                }
                else
                {
                    selectedList.push({isFolder: isFolder, url: href});
                }
            }
            else if(leftList.size() > 1)
            {
                throw new Error('В левой колонке почемуто было выбрано больше одного элемента, хотя может быть выбран только 1');
            }
            else if(leftList.size() === 0)
            {
                if(centerList.size() === 0)
                {
                    if(/(folder|folders|all)/gim.exec(e.data.this_.openParams.selected))
                    {
                        if(e.data.this_.openParams.folderPanel)//Если открыта средняя панелька берём текущую активную папку
                        {
                            if(e.data.this_.session.folderPanel.currentFolder == '.')//Точка это текущая папка
                            {
                                selectedList.push({isFolder: true, url: ''});
                            }
                            else
                            {
                                selectedList.push({isFolder: true, url: e.data.this_.session.folderPanel.currentFolder});
                            }
                        }
                        else
                        {
                            selectedList.push({isFolder: true, url: ''});
                        }
                    }
                    else
                    {
                        selectedList = false;
                    }
                }
                else if(centerList.size() > 0)
                {
                    centerList.each(function(){
                        var oneItem = $(this).find(' > a').first();
                        var href = oneItem.attr('href');
                        var isFolder = $(this).first().hasClass('folder');
                        
                        if(/(jpg|png|gif)$/gim.test(href))
                        {
                            selectedList.push({isFolder: isFolder, url: href, width: parseInt(oneItem.find(' ~ .size-image .w').text()), height: parseInt(oneItem.find(' ~ .size-image .h').text())});
                        }
                        else
                        {
                            selectedList.push({isFolder: isFolder, url: href});
                        }
                    });
                }
            }
            
            e.data.this_.event('selected', selectedList);
            
            
            //======*******************************************************
            /*var IMGXML = _this.XMLFolderFiles.find(' file[url_utf8="'+(_this.session.zoomPanel.currentIMG)+'"]');
            var jIMG = _this.jContainer.find(' .file-manager .col-folder-detail .scroll-container a[href="'+(_this.session.zoomPanel.currentIMG)+'"]');
            if(IMGXML.size())
            {
                _this.updateZoomPanel(IMGXML.attr('url_utf8'), parseInt(IMGXML.attr('width')), parseInt(IMGXML.attr('height')));
            }
            else if(jIMG.size())
            {
                _this.updateZoomPanel(jIMG.attr('href'), parseInt(jIMG.find(' ~ .size-image .w').text()), parseInt(jIMG.find(' ~ .size-image .h').text()));
            }
            else
            {
                _this.updateZoomPanel(_this.session.zoomPanel.currentIMG, _this.session.zoomPanel.w, _this.session.zoomPanel.h);
            }*/
        });
        //==========
        //Закрытие файлового менеджера
        this.jContainer.on('click', ' .file-manager .panel-heading .btn-close', {this_: this}, function(e){
            if(e.data.this_.openParams.closeAfterSelecting)
            {
                if(e.data.this_.backFunc !== false)
                {
                    e.data.this_.backFunc(false);
                }
            }
            e.data.this_.close();
        });
        //==========
        //Закрытие файлового менеджера после выбора
        var g_this = this;
        this.on('selected', function(e){
            if(g_this.backFunc !== false)
            {
                g_this.backFunc(e);
            }
            
            if(g_this.openParams.closeAfterSelecting)
            {
                g_this.close();
            }
        });
        //==========
        //Смена отображения таблица и список в средней колонке
        this.jContainer.on('change', ' .file-manager .col-folder-detail .btn-header .list-or-th input', {this_: this}, function(e){
            if($(this).val() == 'th')
            {
                e.data.this_.jContainer.find(' .file-manager .col-folder-detail .scroll-container > ul').removeClass('list').addClass('th');
                e.data.this_.jContainer.find('.file-manager .col-folder-detail ul .img-wrap img').css({display: 'inline-block'});
                
                e.data.this_.updateCenterItemsFolderPanel();
            }
            else
            {
                e.data.this_.jContainer.find(' .file-manager .col-folder-detail .scroll-container > ul').removeClass('th').addClass('list');
                e.data.this_.jContainer.find('.file-manager .col-folder-detail ul .img-wrap img').css({display: 'none'});
                
                //Очиста атрибута style от свойства "padding-left"
                var jUl = e.data.this_.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul').first();
                if(jUl.attr('style'))
                {
                    var styleClearPLeft = jUl.attr('style').replace(/padding\-left:[^;]*;/gim, '').replace(/\s{2,}/gim, ' ').replace(/(^\s+|\s+$)/gim, '');
                    jUl.attr('style', styleClearPLeft);
                }
            }
        });
        //==========
        //Выделить папку в левой колонке
        this.jContainer.on('click', ' .file-manager .col-left-nav .home li.folder > a', {this_: this}, function(e){
            if(/(folder|folders|all)/gim.exec(e.data.this_.openParams.selected))
            {
                e.data.this_.jContainer.find('.file-manager .col-left-nav .home li').removeClass('selecting');
                e.data.this_.jContainer.find('.file-manager .col-folder-detail .scroll-container li').removeClass('ui-selected');
                
                $(this).closest('.file-manager .col-left-nav .home li.folder').addClass('selecting');
            }
            if(e.data.this_.session.folderPanel.currentFolder != $(this).attr('href'))
            {
                e.data.this_.createFolderPanel($(this).attr('href'));
            }
            
            if(e.preventDefault){e.preventDefault()} else{e.stop()}; e.returnValue = false; e.stopPropagation();
        });
        //==========
        //Выделить файл в левой колонке
        this.jContainer.on('click', ' .file-manager .col-left-nav .home li.file > a', {this_: this}, function(e){
            //Обновить картинку
            if(/(jpg|png|gif)$/gim.test($(this).attr('href')))
            {
                var IMGXML = e.data.this_.XMLFolderFiles.find(' file[url_utf8="'+($(this).attr('href'))+'"]');
                if(IMGXML.size() && (e.data.this_.session.zoomPanel.currentIMG !== IMGXML.attr('url_utf8')))
                {
                    e.data.this_.updateZoomPanel(IMGXML.attr('url_utf8'), parseInt(IMGXML.attr('width')), parseInt(IMGXML.attr('height')));
                }
            }
            
            if(/(file|files|all)/gim.exec(e.data.this_.openParams.selected))
            {
                e.data.this_.jContainer.find('.file-manager .col-left-nav .home li').removeClass('selecting');
                e.data.this_.jContainer.find('.file-manager .col-folder-detail .scroll-container li').removeClass('ui-selected');
                
                $(this).closest('.file-manager .col-left-nav .home li.file').addClass('selecting');
            }
            if(e.preventDefault){e.preventDefault()} else{e.stop()}; e.returnValue = false; e.stopPropagation();
        });
        //==========
        //Выбрать папку в левой колонке
        this.jContainer.on('dblclick', ' .file-manager .col-left-nav .home li.folder > a', {this_: this}, function(e){
            if(/(folder|folders|all)/gim.exec(e.data.this_.openParams.selected))
            {
                e.data.this_.event('selected', new Array({isFolder: true, url: $(this).attr('href')}));
            }
            if(e.preventDefault){e.preventDefault()} else{e.stop()}; e.returnValue = false; e.stopPropagation();
        });
        //==========
        //Выбрать файл в левой колонке
        this.jContainer.on('dblclick', ' .file-manager .col-left-nav .home li.file > a', {this_: this}, function(e){
            if(/(file|files|all)/gim.exec(e.data.this_.openParams.selected))
            {
                var IMGXML = e.data.this_.XMLFolderFiles.find(' file[url_utf8="'+($(this).attr('href'))+'"]');
                if(IMGXML.attr('image') || IMGXML.attr('image') == 'image')
                {
                    e.data.this_.event('selected', new Array({isFolder: false, url: $(this).attr('href'), width: parseInt(IMGXML.attr('width')), height: parseInt(IMGXML.attr('height'))}));
                }
                else
                {
                    e.data.this_.event('selected', new Array({isFolder: false, url: $(this).attr('href')}));
                }
            }
            if(e.preventDefault){e.preventDefault()} else{e.stop()}; e.returnValue = false; e.stopPropagation();
        });
        //==========
        //Выделить папку или файл в средней колонке
        this.jContainer.on('click', ' .file-manager .col-folder-detail .scroll-container li', {this_: this}, function(e){
            if(e.data.this_.openParams.selected == 'folder')
            {
                e.data.this_.jContainer.find('.file-manager .col-left-nav .home li').removeClass('selecting');
                e.data.this_.jContainer.find('.file-manager .col-folder-detail .scroll-container li').removeClass('ui-selected');
                
                $(this).closest('li.folder').addClass('ui-selected');
            }
            else if(e.data.this_.openParams.selected == 'file')
            {
                e.data.this_.jContainer.find('.file-manager .col-left-nav .home li').removeClass('selecting');
                e.data.this_.jContainer.find('.file-manager .col-folder-detail .scroll-container li').removeClass('ui-selected');
                
                $(this).closest('li.file').addClass('ui-selected');
            }
            
            //Выбрать картинку
            if(/(jpg|png|gif)$/gim.test($(this).find(' > a').attr('href')) && /(folder|file|folders)/gim.test(e.data.this_.openParams.selected))
            {
                var jIMG = $(this).find(' > a');
                if(jIMG.size() && (e.data.this_.session.zoomPanel.currentIMG !== jIMG.attr('href')))
                {
                    e.data.this_.updateZoomPanel(jIMG.attr('href'), parseInt(jIMG.find(' ~ .size-image .w').text()), parseInt(jIMG.find(' ~ .size-image .h').text()));
                }
            }
            
            if(e.preventDefault){e.preventDefault()} else{e.stop()}; e.returnValue = false; e.stopPropagation();
        });
        //==========
        //Выбрать картинку
        this.on('click-file-fdetail', function(itemLi){
            if(/(jpg|png|gif)$/gim.test(itemLi.find(' > a').attr('href')) && /(files|all)/gim.test(g_this.openParams.selected))
            {
                var jIMG = itemLi.find(' > a');
                if(jIMG.size() && (g_this.session.zoomPanel.currentIMG !== jIMG.attr('href')))
                {
                    g_this.updateZoomPanel(jIMG.attr('href'), parseInt(jIMG.find(' ~ .size-image .w').text()), parseInt(jIMG.find(' ~ .size-image .h').text()));
                }
            }
        });
        //==========
        //Снять выделени с папки или файла в средней колонке
        this.jContainer.on('click', ' .file-manager .col-folder-detail .scroll-container', {this_: this}, function(e){
            if(e.data.this_.openParams.selected == 'folder' || e.data.this_.openParams.selected == 'file')
            {
                e.data.this_.jContainer.find('.file-manager .col-folder-detail .scroll-container li').removeClass('ui-selected');
            }
        });
        //==========
        this.jContainer.on('dblclick', ' .file-manager .col-folder-detail li.file', {this_: this}, function(e){
            if(/(file)/gim.exec(e.data.this_.openParams.selected))
            {
                var oneItem = $(this).find(' > a').first();
                var href = oneItem.attr('href');
                var isFolder = $(this).first().hasClass('folder');
                
                if(/(jpg|png|gif)$/gim.test(href))
                {
                    e.data.this_.event('dblclick-file-fdetail', {isFolder: isFolder, url: href, width: parseInt(oneItem.find(' ~ .size-image .w').text()), height: parseInt(oneItem.find(' ~ .size-image .h').text())});
                }
                else
                {
                    e.data.this_.event('dblclick-file-fdetail', {isFolder: false, url: href});
                }
            }
        });
        this.jContainer.on('dblclick', ' .file-manager .col-folder-detail li.folder', {this_: this}, function(e){
            if(/(file|folder|files)/gim.exec(e.data.this_.openParams.selected))
            {
                e.data.this_.event('dblclick-folder-fdetail', $(this).find(' > a').attr('href'));
            }
        });
        //Выбрать файл в средней колонке
        this.on('dblclick-file-fdetail', function(e){
            g_this.event('selected', new Array(e));
        });
        //==========
        //Перейти в папку в средней колонке
        this.on('dblclick-folder-fdetail', function(e){
            g_this.createFolderPanel(e);
        });
        //==========
        //Перейти к папке в "breadcrumb"
        this.jContainer.on('click', ' .file-manager .col-folder-detail .btn-header .breadcrumb a', {this_: this}, function(e){
            e.data.this_.createFolderPanel($(this).attr('href'));
            if(e.preventDefault){e.preventDefault()} else{e.stop()}; e.returnValue = false; e.stopPropagation();
        });
        //==========
        //Обновить
        this.jContainer.on('click', ' .file-manager .btn-header .refresh-full', {this_: this}, function(e){
            var _this = e.data.this_;
            
            if(_this.opened === true && _this.openParams.leftNav)
            {
                if(_this.created)
                {
                    _this.savePapki();
                }
                
                _this.XMLFolderFiles = _this.getXMLFolderFiles(false);
                
                //Раскрываем папки в XML
                _this.XMLFolderFiles.find(' folder').each(function(){
                    if($(this).find(' > *').size())
                    {
                        $(this).attr('opened', 1);
                    }
                });
                
                _this.jContainer.find(' .file-manager .col-left-nav .scroll-container').empty();
                _this.jContainer.find(' .file-manager .col-left-nav .scroll-container').append(_this.generateMainListFromXML());
            }
            
            _this.createFolderPanel(_this.session.folderPanel.currentFolder);
            
            //Обновить картинку
            var IMGXML = _this.XMLFolderFiles.find(' file[url_utf8="'+(_this.session.zoomPanel.currentIMG)+'"]');
            var jIMG = _this.jContainer.find(' .file-manager .col-folder-detail .scroll-container a[href="'+(_this.session.zoomPanel.currentIMG)+'"]');
            if(IMGXML.size())
            {
                _this.updateZoomPanel(IMGXML.attr('url_utf8'), parseInt(IMGXML.attr('width')), parseInt(IMGXML.attr('height')));
            }
            else if(jIMG.size())
            {
                _this.updateZoomPanel(jIMG.attr('href'), parseInt(jIMG.find(' ~ .size-image .w').text()), parseInt(jIMG.find(' ~ .size-image .h').text()));
            }
            else
            {
                _this.updateZoomPanel(_this.session.zoomPanel.currentIMG, _this.session.zoomPanel.w, _this.session.zoomPanel.h);
            }
            
            if(e.preventDefault){e.preventDefault()} else{e.stop()}; e.returnValue = false; e.stopPropagation();
        });
        //==========
        //Изменить зум в "zoomPanel"
        this.jContainer.on('change', ' .file-manager .col-big-img .btn-header .zoom', {this_: this}, function(e){
            //e.data.this_.jContainer.find(' .file-manager .col-big-img .btn-header .zoom label.btn').removeClass('active');
            //e.data.this_.jContainer.find(' .file-manager .col-big-img .btn-header .zoom input:checked').closest('label').first().addClass('active');
            
            var zoom = parseFloat(e.data.this_.jContainer.find(' .file-manager .col-big-img .btn-header .zoom input:checked').attr('value'));//Изза багов определения выбранных радиокнопок
            e.data.this_.updateZoomPanel(e.data.this_.session.zoomPanel.currentIMG, e.data.this_.session.zoomPanel.w, e.data.this_.session.zoomPanel.h, zoom);
        });
        //==========
    }
    
    //Сохраняем навиготоры чтобы потом можно было все перебрать и сохранить при вызове метода destructAll
    fileManager.fileManagers = new Array();
    
    //Открыть файловый менеджер
    //Парметры
    //params:
    //selected - file, files, folder, folders, all (files)
    //closeAfterSelecting - true, false (false)
    //func - В функцию возращяет список выбранных файлов, папок.
    fileManager.prototype.open = function(params, func)
    {
        this.backFunc = func || false;
        //Параметры
        var params = $.extend({
            selected: 'files',
            closeAfterSelecting: false,
            textSelectingBtn: 'Выбрать',
            leftNav: true,
            folderPanel: false,
            zoomPanel: false
        }, params);
        this.openParams = params;
        if(params.leftNav === false && params.folderPanel === false)
        {
            params.folderPanel = true;
        }
        //Внутренние переменные
        var sizeOneColumn, countColumn = 0;
        var resHTML = '';
        
        //Подсчитываем размер одной колонки
        countColumn += (params.leftNav) ? 1 : 0;
        countColumn += (params.folderPanel) ? 1 : 0;
        countColumn += (params.zoomPanel) ? 1 : 0;
        sizeOneColumn = Math.floor(12 / countColumn);
        //==========
        
        if(!this.opened)
        {
            if(!this.created)
            //Если ещё несоздавался то запрашиваем XML с сервера
            {
                this.XMLFolderFiles = this.getXMLFolderFiles(false);
                
                //Раскрываем папки в XML
                this.XMLFolderFiles.find(' folder').each(function(){
                    if($(this).find(' > *').size())
                    {
                        $(this).attr('opened', 1);
                    }
                });
                
                resHTML = '\
                <div class="file-manager twitter-bootstrap-3">\
                <div class="panel panel-default"><div class="panel-heading">\
                    Файловый менеджер\
                    <button type="button" class="btn btn-danger btn-sm btn-close">Закрыть</button>\
                    <button type="button" class="btn btn-default btn-sm btn-selected">'+params.textSelectingBtn+'</button>\
                </div><div class="panel-body">\
                    <div class="row-fluid row-main">';
                    
                //Левая колонка с многоуровневым списком всех файлов и папок
                resHTML += '<div class="col-left-nav">\
                <div class="panel panel-default"><div class="panel-body">\
                    <div class="btn-header">\
                        <div class="btn-group refresh">\
                            <button type="button" class="refresh-full btn btn-default"><span class="glyphicon glyphicon-refresh"></span></button>\
                        </div>\
                        <div class="clear"></div>\
                    </div>\
                    <hr>\
                    <div class="scroll-container">\
                        \
                    </div>';
                    
                resHTML += '</div></div></div>';
                //==========
                //Средняя колонка с содержимым одной папки
                resHTML += '<div class="col-folder-detail">\
                <div class="panel panel-default"><div class="panel-body">\
                    <div class="btn-header">\
                        <div class="btn-group refresh">\
                            <button type="button" class="refresh-full btn btn-default"><span class="glyphicon glyphicon-refresh"></span></button>\
                        </div>\
                        <form class="list-or-th btn-group btn-toggle-one-color" data-toggle="buttons">\
        					<label class="btn btn-default active" data-btn-color="danger">\
        						<input type="radio" name="q" value="th" checked="checked" /><span class="glyphicon glyphicon-th"></span>\
        					</label>\
        					<label class="btn btn-default" data-btn-color="default">\
        						<input type="radio" name="q" value="list" /><span class="glyphicon glyphicon-th-list"></span>\
        					</label>\
        				</form>\
                        <select class="selectpicker sort show-tick" data-toggle="tooltip" data-placement="left" data-original-title="Сортировать (помимо выбранного параметра сортировки, контент ещё сортируеться по параметру папка-файл и по имени)">\
                            <option value="none">Не сортировано</option>\
        					<option value="createTime">Дата создания</option>\
        					<option value="modifiedTime">Дата изменения</option>\
        					<option value="size">Размер</option>\
        					<option value="type">Тип</option>\
        				</select>\
                        <div class="clear"></div>\
                        <ol class="breadcrumb"></ol>\
                    </div>\
                    <hr>\
                    <div class="scroll-container">\
                        \
                    </div>';
                    
                resHTML += '</div></div></div>';
                //==========
                //Правая колонка с одной выбранной картинкой
                resHTML += '<div class="col-big-img">\
                <div class="panel panel-default"><div class="panel-body">\
                    <div class="btn-header">\
                        <form class="zoom btn-group btn-toggle-one-color" data-toggle="buttons">\
        					<label class="btn btn-default" data-btn-color="primary">\
        						<input type="radio" name="q" value="0.125" />1/8\
        					</label>\
        					<label class="btn btn-default" data-btn-color="primary">\
        						<input type="radio" name="q" value="0.25" />1/4\
        					</label>\
                            <label class="btn btn-default" data-btn-color="primary">\
        						<input type="radio" name="q" value="0.5" />1/2\
        					</label>\
        					<label class="btn btn-default active" data-btn-color="default">\
        						<input type="radio" name="q" value="1" checked="checked" />1\
        					</label>\
                            <label class="btn btn-default" data-btn-color="danger">\
        						<input type="radio" name="q" value="2" />2x\
        					</label>\
        					<label class="btn btn-default" data-btn-color="danger">\
        						<input type="radio" name="q" value="4" />4x\
        					</label>\
                            <label class="btn btn-default" data-btn-color="danger">\
        						<input type="radio" name="q" value="8" />8x\
        					</label>\
        				</form>\
                    </div>\
                    <hr>\
                    <div class="scroll-container">\
                        \
                    </div>';
                                            
                resHTML += '</div></div></div>';
                //==========
                resHTML += '</div></div></div>\
                    <div class="cursor-folder"></div>\
                </div>';
                this.jContainer.append(resHTML);
                
                //Активируем "Selectpicker"
                this.jContainer.find('.file-manager .btn-header .selectpicker.sort').selectpicker({
                    style: 'btn-default'
                });
                //==========
                //Переносим подсказки из тега "select" в код "Selectpicker"
                //МОЖЕТ УЖЕ НЕРАБОТАТЬ ТАК КАК СТРУКТУРА HTML У СЕЛЕКТПИККЕРА ПОМЕНЯЛАСЬ...
                this.jContainer.find('.file-manager .selectpicker').each(function(){
                    var bootstrapSelect = $(this).find(' + .bootstrap-select');
                    
                    $(this.attributes).each(function() {
                        if(/^data/gim.test(this.name))
                        {
                            bootstrapSelect.attr(this.name, this.value);
                        }
                    });
                });
                //==========
                //Активируем всплывающие подсказки
                this.jContainer.find(".file-manager [data-toggle='tooltip']").tooltip();
                //==========
                //Изменить сортировку
                var changeSort = function(sort, _this)
                {
                    _this.sortable = {};
                    
                    switch (sort) {
                        case 'createTime':
                            _this.sortable.createTime = true;
                            break;
                        case 'modifiedTime':
                            _this.sortable.modifiedTime = true;
                            break;
                        case 'size':
                            _this.sortable.size = true;
                            break;
                        case 'type':
                            _this.sortable.type = true;
                            break;
                    }
            
                    if(_this.opened === true && _this.openParams.leftNav)
                    {
                        _this.jContainer.find(' .file-manager .col-left-nav .scroll-container').empty();
                        _this.jContainer.find(' .file-manager .col-left-nav .scroll-container').append(_this.generateMainListFromXML());
                    }
                    
                    _this.createFolderPanel(_this.session.folderPanel.currentFolder);
                }
                //==========
                //Синхронизируем два "selectpicker sort"
                var data = {this_: this};
                this.jContainer.find(' .file-manager .col-folder-detail .btn-header .selectpicker.sort').on('change', data, function(e){
                    //e.data.this_.jContainer.find(' .file-manager .col-left-nav .btn-header .selectpicker.sort').selectpicker('val', $(this).val());
                    changeSort($(this).val(), e.data.this_);
                });
                /*this.jContainer.find(' .file-manager .col-left-nav .btn-header .selectpicker.sort').on('change', data, function(e){//Просто поменяли местами классы "col-folder-detail" и "col-left-nav"
                    e.data.this_.jContainer.find(' .file-manager .col-folder-detail .btn-header .selectpicker.sort').selectpicker('val', $(this).val());
                    changeSort($(this).val(), e.data.this_);
                });*/
                //==========
                
                this.created = true;
            }
            
            //Активация и дезактивация определённых элементов в зависимости от параметров
            if(params.leftNav)
            {
                $('.file-manager .col-left-nav').attr('class', $('.file-manager .col-left-nav').attr('class').replace(/\bcol-\w{1,4}-\d{1,2}\b/gim, ''))
                .addClass('col-xs-'+sizeOneColumn)
                .css({display: 'block'});
                if(params.folderPanel)
                {
                    this.jContainer.find(' .file-manager .col-left-nav .btn-header .selectpicker.sort').selectpicker('hide');
                }
                else
                {
                    this.jContainer.find(' .file-manager .col-left-nav .btn-header .selectpicker.sort').selectpicker('show');
                }
            }
            else
            {
                $('.file-manager .col-left-nav').css({display: 'none'});
            }
            
            if(params.folderPanel)
            {
                $('.file-manager .col-folder-detail').attr('class', $('.file-manager .col-folder-detail').attr('class').replace(/\bcol-\w{1,4}-\d{1,2}\b/gim, ''))
                .addClass('col-xs-'+sizeOneColumn)
                .css({display: 'block'});
                if(params.leftNav)
                {
                    this.jContainer.find(' .file-manager .col-folder-detail .btn-header .refresh').css({display: 'none'});
                }
                else
                {
                    this.jContainer.find(' .file-manager .col-folder-detail .btn-header .refresh').css({display: 'block'});
                }
            }
            else
            {
                $('.file-manager .col-folder-detail').css({display: 'none'});
            }
            
            if(params.zoomPanel)
            {
                $('.file-manager .col-big-img').attr('class', $('.file-manager .col-big-img').attr('class').replace(/\bcol-\w{1,4}-\d{1,2}\b/gim, ''))
                .addClass('col-xs-'+sizeOneColumn)
                .css({display: 'block'});
            }
            else
            {
                $('.file-manager .col-big-img').css({display: 'none'});
            }
            //==========
            
            //Вставка контента в колонки и установка правильного отображеня взависимости от праметров и от прошлой сессии
            if(params.leftNav)
            {
                this.jContainer.find(' .file-manager .col-left-nav .scroll-container').append(this.generateMainListFromXML());
            }
            
            //Одна раскрытая папка с подробными параметрами (средняя колонка)
            if(params.folderPanel)
            {
                this.createFolderPanel(this.session.folderPanel.currentFolder);
            }
            
            //Открыть контейнер
            this.jContainer.css({display: 'block'});
            //==========
            //Вставить картинку в "zoomPanel"
            if(params.zoomPanel)
            {
                this.updateZoomPanel(this.session.zoomPanel.currentIMG, this.session.zoomPanel.w, this.session.zoomPanel.h);
            }
            //==========
            this.opened = true;
        }
    }
    
    //Создание основного списка всех файлов и папок слева
    fileManager.prototype.generateMainListFromXML = function(getFullParams, sorted)
    {
        getFullParams = getFullParams || false;
        var sort;
        //Параметры
        if(sorted || false)
        {
            sort = $.extend({
                folderFile: true,
                createTime: false,
                modifiedTime: false,
                size: false,
                type: false,
                name: true
            }, this.sortable);
        }
        else
        {
            sort = $.extend({
                folderFile: true,
                createTime: false,
                modifiedTime: false,
                size: false,
                type: false,
                name: true
            }, {});
        }
        
        return '\
        <ul class="home">\
            <li class="folder f-open">\
                <a href="#">Дом</a>\
                <span class="disclosures-folder">\
                    <i class="fa fa-folder-open"></i>\
                </span>\
                '+this.generateMainListFromXMLRecursion(this.XMLFolderFiles.find(' > wrap'), sort, getFullParams)+'\
            </li>\
        <ul>';
    }
    
    //Создание списка всех файлов и папок из переданой папки
    fileManager.prototype.generateOneFolderFromXML = function(folderXML, getFullParams, sorted) {
        getFullParams = getFullParams || false;
        var sort;
        //Параметры
        if(sorted || false)
        {
            sort = $.extend({
                folderFile: true,
                createTime: false,
                modifiedTime: false,
                size: false,
                type: false,
                name: true
            }, this.sortable);
        }
        else
        {
            sort = $.extend({
                folderFile: true,
                createTime: false,
                modifiedTime: false,
                size: false,
                type: false,
                name: true
            }, {});
        }
        
        return this.generateMainListFromXMLRecursion(folderXML.find(' > wrap'), sort, getFullParams);
    }
    
    //Рекурсия
    fileManager.prototype.generateMainListFromXMLRecursion = function(folderXML, sort, getFullParams)
    {
        //alert(tests.objInStr(sort));
        
        var sortRes = new Array(), firstEl, resHTML = '';
        
        firstEl = folderXML.find(' > *').first();
        
        if(firstEl.size() == 0)
        {
            return '';
        }
        
        if(firstEl.get(0).nodeName == 'error')
        //Возможные ошибки
        {
            if(firstEl.attr('error') == 'notexists')
            {
                resHTML +=
                '<ul>\
                    <li class="notexists">\
                        <a href="#">Папка несуществует</a>\
                    </li>\
                    <div class="clear"></div>\
                </ul>';
            }
            else if(firstEl.attr('error') == 'unable_to_open_directory')
            {
                resHTML +=
                '<ul>\
                    <li class="unable_to_open_directory">\
                        <a href="#">Ошибка открытия папки</a>\
                    </li>\
                    <div class="clear"></div>\
                </ul>';
            }
            return resHTML;
        }
        //==========
        else if(firstEl.get(0).nodeName == 'empty')
        //Пустая папка
        {
            resHTML +=
            '<ul>\
                <li class="empty">\
                    <a href="#">Пустая папка</a>\
                </li>\
                <div class="clear"></div>\
            </ul>';
            return resHTML;
        }
        //==========
        else if(firstEl.get(0).nodeName == 'folder' || firstEl.get(0).nodeName == 'file')
        //Есть папки и/или файлы
        {
            folderXML.find(' > folder, > file').each(function(){
                sortRes.push($(this));
            });
            
            //Сортировка
            //console.time('sort');
            sortRes.sort(function(a, b){
                //Папка - файл
                if(sort.folderFile)
                {
                    if(a.get(0).nodeName == 'folder' && b.get(0).nodeName == 'file')
                    {
                        return -1;
                    }
                    if(a.get(0).nodeName == 'file' && b.get(0).nodeName == 'folder')
                    {
                        return 1;
                    }
                }
                //По дате создания
                if(sort.createTime)
                {
                    if(parseInt(a.attr('create')) > parseInt(b.attr('create')))
                    {
                        return -1;
                    }
                    if(parseInt(a.attr('create')) < parseInt(b.attr('create')))
                    {
                        return 1;
                    }
                }
                //По дате изменения
                if(sort.modifiedTime)
                {
                    if(parseInt(a.attr('modified')) > parseInt(b.attr('modified')))
                    {
                        return -1;
                    }
                    if(parseInt(a.attr('modified')) < parseInt(b.attr('modified')))
                    {
                        return 1;
                    }
                }
                //По Размеру
                if(sort.size && a.get(0).nodeName == 'file' && b.get(0).nodeName == 'file')//Сортировать по размеру только файлы
                {
                    if(parseInt(a.attr('size')) > parseInt(b.attr('size')))
                    {
                        return -1;
                    }
                    if(parseInt(a.attr('size')) < parseInt(b.attr('size')))
                    {
                        return 1;
                    }
                }
                //По типу
                if(sort.type && a.get(0).nodeName == 'file' && b.get(0).nodeName == 'file')
                {
                    var l = /\.(\w{1,10})$/gim.exec(a.attr('name_utf8'));
                    var r = /\.(\w{1,10})$/gim.exec(b.attr('name_utf8'));
                    
                    if(l !== null && r !== null)
                    {
                        var t = shablonizator.naturalCompareString(l[1], r[1]);
                        //console.log(t);                        
                        if(t !== 0)
                        {
                            return t;
                                                    
                        }
                    }
                }
                //По имени
                if(sort.name)
                {
                    var l = /^([\w- \.а-яА-Я]{0,100})(\.\w{1,10})?$/gim.exec(a.attr('name_utf8'));
                    var r = /^([\w- \.а-яА-Я]{0,100})(\.\w{1,10})?$/gim.exec(b.attr('name_utf8'));
                    
                    if(l !== null && r !== null)
                    {
                        var t = shablonizator.naturalCompareString(l[1], r[1]);
                        //console.log(t);                        
                        if(t !== 0)
                        {
                            return t;
                                                    
                        }
                    }
                }
                return 0;
            });
            //console.timeEnd('sort');
            //==========
            resHTML += '<ul>';
            for(var key in sortRes)
            {
                var el = sortRes[key], dopParamsHTML = '';
                if(el.get(0).nodeName == 'folder')
                //Папка
                {
                    if(getFullParams === true)
                    {
                        var createTime = new Date(parseInt(el.attr('create')) * 1000);
                        var modifiedTime = new Date(parseInt(el.attr('modified')) * 1000);
                        
                        dopParamsHTML += '\
                        <span class="create-time">'+createTime.toLocaleDateString()+' '+createTime.getHours()+':'+((createTime.getMinutes() <= 9) ? '0'+createTime.getMinutes() : createTime.getMinutes())+'</span>\
                        <span class="modified-time">'+modifiedTime.toLocaleDateString()+' '+createTime.getHours()+':'+((createTime.getMinutes() <= 9) ? '0'+createTime.getMinutes() : createTime.getMinutes())+'</span>\
                        ';
                    }
                    resHTML +=
                    '<li class="folder '+(((el.attr('opened') || 0) == 1) ? 'f-open' : 'f-close')+'">\
                        <a href="'+el.attr('url_utf8')+'">'+el.attr('name_utf8')+'</a>\
                        <span class="disclosures-folder">\
                            <i class="fa fa-plus-square-o"></i><i class="fa fa-minus-square-o"></i>\
                            <i class="fa fa-folder"></i><i class="fa fa-folder-open"></i>\
                        </span>\
                        '+dopParamsHTML+'\
                        '+this.generateMainListFromXMLRecursion(el, sort)+'\
                    </li>';
                }
                //==========
                else
                //Файл
                {
                    var fileExtension = /\.(\w*)$/i.exec(el.attr('name_utf8'))[1] || '', isImage = '';
                    if(getFullParams === true)
                    {
                        var posleZapyatoi = 1, sizeLogClass = 'size-bites', sizePercentWidth = 0, imageSize = '-', img = '';
                        
                        var createTime = new Date(parseInt(el.attr('create')) * 1000);
                        var modifiedTime = new Date(parseInt(el.attr('modified')) * 1000);
                        var sizeFile = parseInt(el.attr('size'));
                        
                        if(sizeFile < 1024) {
                            sizePercentWidth = Math.round(sizeFile / 10.24);
                        }
                        else if(sizeFile < 1048576) {
                            sizeFile = Math.floor(sizeFile / 1024 * Math.pow(10, posleZapyatoi)) / Math.pow(10, posleZapyatoi);
                            sizePercentWidth = Math.round(sizeFile / 10.24);
                            sizeLogClass = 'size-kilobytes';
                        }
                        else if(sizeFile < 1073741824) {
                            sizeFile = Math.floor(sizeFile / 1048576 * Math.pow(10, posleZapyatoi)) / Math.pow(10, posleZapyatoi);
                            sizePercentWidth = Math.round(sizeFile / 10.24);
                            sizeLogClass = 'size-megabytes';
                        }
                        else {
                            sizeFile = Math.floor(sizeFile / 1073741824 * Math.pow(10, posleZapyatoi)) / Math.pow(10, posleZapyatoi);
                            sizePercentWidth = Math.round(sizeFile / 10.24);
                            sizeLogClass = 'size-gigabytes';
                        }
                        
                        if(el.attr('image') || el.attr('image') == 'image' || false)
                        {
                            imageSize = '<span class="w">'+el.attr('width')+'</span>|<span class="h">'+el.attr('height')+'</span>';
                            isImage = 'file-image';
                            img = '\
                            <span class="glyphicon glyphicon-zoom-in img-zoom"><span></span></span>\
                            <span class="img-wrap" data-width="'+el.attr('width')+'" data-height="'+el.attr('height')+'">\
                                <span class="img-table"><span class="img-cell"><img src="'+el.attr('url_utf8')+'" style="display: none;" /></span></span>\
                            </span>';
                        }
                        
                        dopParamsHTML += '\
                        <span class="size-image">'+imageSize+'</span>\
                        '+img+'\
                        <span class="create-time">'+createTime.toLocaleDateString()+' '+createTime.getHours()+':'+((createTime.getMinutes() <= 9) ? '0'+createTime.getMinutes() : createTime.getMinutes())+'</span>\
                        <span class="modified-time">'+modifiedTime.toLocaleDateString()+' '+createTime.getHours()+':'+((createTime.getMinutes() <= 9) ? '0'+createTime.getMinutes() : createTime.getMinutes())+'</span>\
                        <span class="size-file '+sizeLogClass+'"><span class="visual-effect" style="width: '+sizePercentWidth+'%;"></span><span class="text">'+sizeFile+'</span></span>\
                        ';
                    }
                    resHTML +=
                    '<li class="file '+isImage+'">\
                        <a href="'+el.attr('url_utf8')+'">'+el.attr('name_utf8')+'</a>\
                        <span class="file-ico" data-file-extension="'+fileExtension+'">\
                            <i class="fa"></i>\
                            <span class="file-extension">'+fileExtension+'</span>\
                        </span>\
                        '+dopParamsHTML+'\
                    </li>';
                }
                //==========
            }
            resHTML += '<div class="clear"></div></ul>';
            return resHTML;
        }
        //==========
        else
        //Данных о содержимом папки нет (незагружалась)
        {
            return '';
        }
        //==========
    }
    
    fileManager.prototype.getXMLFolderFiles = function(async, func)
    {
        var async = async || false;
        var resXML;
        
        $.ajax({
            url: "shablonizator.php",
            type: "POST",
            cache: false,
            data: ({module: 'filemanager', zapros: 'start', text_encoding: shablonizator.textEncodingServer, xml_fail: this.urlXMLSavedData}),
            async: async,
            success: function(xml){
                resXML = $($.parseXML('<\?xml version="1.0" encoding="UTF-8"\?><wrap>'+xml+'</wrap>'));
                if(func !== undefined)
                {
                    func(resXML);
                }
            }
        });
        
        if(!async)
        //Синхронно
        {
            return resXML;
        }
    }
    
    fileManager.prototype.getXMLOneFolderContent = function(dir, async, func)
    {
        var async = async || false;
        var resXML;
        var this_ = this;
        
        $.ajax({
            url: "shablonizator.php",
            type: "POST",
            cache: false,
            data: ({module: 'filemanager', zapros: 'podgruzit_papku', dir: dir, text_encoding: shablonizator.textEncodingServer}),
            async: async,
            success: function(xml){
                resXML = $($.parseXML('<\?xml version="1.0" encoding="UTF-8"\?><wrap>'+xml+'</wrap>'));
                if(func !== undefined)
                {
                    func(resXML);
                }
            }
        });
        
        if(!async)
        //Синхронно
        {
            return resXML;
        }
    }
    
    fileManager.prototype.createFolderPanel = function(url)
    {
        if(url === '#' || url === '')
        {
            url = '.';
        }
        
        if((this.openParams.folderPanel) || this.opened === false)//this.session.folderPanel.currentFolder != url
        {
            var resBreadcrumb = '';
            if(url == '.')
            {
                resBreadcrumb =
                '<li class="active">Дом</li>';
            }
            else if(/^[^\/]+$/gim.exec(url)) {
                resBreadcrumb =
                '<li><a href="#">Дом</a></li>\
                <li class="active">'+url+'</li>';
            }
            else if(/\//gim.exec(url))
            {
                var folders = url.split('/');
                var urlTemp = '';
                
                resBreadcrumb =
                '<li><a href="#">Дом</a></li>';
                
                for(var i = 0; i < folders.length; i++)
                {
                    if(0 === i)
                    {
                        urlTemp += folders[i];
                        resBreadcrumb +=
                        '<li><a href="'+urlTemp+'">'+folders[i]+'</a></li>';
                    }
                    else if(0 < i && i < folders.length - 1)
                    {
                        urlTemp += '/'+folders[i];
                        resBreadcrumb +=
                        '<li><a href="'+urlTemp+'">'+folders[i]+'</a></li>';
                    }
                    else if(i === folders.length - 1)
                    {
                        resBreadcrumb +=
                        '<li>'+folders[i]+'</li>';
                    }
                }
            }
            
            this.jContainer.find(' .col-folder-detail .btn-header .breadcrumb').empty();
            this.jContainer.find(' .col-folder-detail .btn-header .breadcrumb').append(resBreadcrumb);
            
            var XMLFolderFiles = this.getXMLOneFolderContent(url, false);
            
            this.jContainer.find(' .file-manager .col-folder-detail .scroll-container').empty();
            this.jContainer.find(' .file-manager .col-folder-detail .scroll-container').append(this.generateOneFolderFromXML(XMLFolderFiles, true, true));
            
            this.session.folderPanel.currentFolder = url;
            
            var jAllLi = this.jContainer.find(' .file-manager .col-folder-detail .scroll-container li');//iosdfusdilhfisdhfisdghifhsdihfsdihfisdhfuisdguisdhishfisdf
            
            if(jAllLi.hasClass('notexists'))
            {
                var send = jAllLi.find(' a').text();
                this.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul').remove();
                this.jContainer.find(' .file-manager .col-folder-detail .scroll-container').append('<h2 class="text-center notexists">'+send+'</h2>');
            }
            else if(jAllLi.hasClass('unable_to_open_directory'))
            {
                var send = jAllLi.find(' a').text();
                this.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul').remove();
                this.jContainer.find(' .file-manager .col-folder-detail .scroll-container').append('<h2 class="text-center unable_to_open_directory">'+send+'</h2>');
            }
            else if(jAllLi.hasClass('empty'))
            {
                var send = jAllLi.find(' a').text();
                this.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul').remove();
                this.jContainer.find(' .file-manager .col-folder-detail .scroll-container').append('<h2 class="text-center empty">'+send+'</h2>');
            }
            else
            {
                if(this.jContainer.find(' .file-manager .col-folder-detail .btn-header .list-or-th input:checked').val() == 'th')
                {
                    this.jContainer.find(' .file-manager .col-folder-detail .scroll-container > ul').removeClass('list').addClass('th');
                    //Подстраивание изображений под контейнер
                    this.jContainer.find('.file-manager .col-folder-detail ul .img-wrap').each(function(){
                        var w = parseInt($(this).attr('data-width')), h = parseInt($(this).attr('data-height'));
                        var wc = $(this).width(), hc = $(this).height();
                        
                        if(w <= 10 || h <= 10)//Если картинка по ширине или высоте меньше 10 то увеличиваем её в 2 раза но если после увеличения другая сторона выходит за пределы то неувеличиваем
                        {
                            if(w * 2 <= wc && h * 2 <= hc)
                            {
                                w *= 2; h *= 2;
                                $(this).parent('*').find(' .glyphicon-zoom-in.img-zoom').addClass('active zoom-2x');
                            } 
                        }
                        
                        if(w > wc)
                        {
                            h = Math.round(h * wc / w) || 1;
                            w = wc;
                        }
                        
                        if(h > hc)
                        {
                            w = Math.round(w * hc / h) || 1;
                            h = hc;
                        }
                        
                        $(this).find(' img').attr('width', w).attr('height', h);
                    });
                    
                    this.jContainer.find('.file-manager .col-folder-detail ul .img-wrap img').css({display: 'inline-block'});
                    //==========
                }
                else
                {
                    this.jContainer.find(' .file-manager .col-folder-detail .scroll-container > ul').removeClass('th').addClass('list');
                    this.jContainer.find(' .file-manager .col-folder-detail ul .img-wrap img').css({display: 'none'});
                }
                
                //Включаем jQuery sectable//Выбор одного файла или папки стоит в конструкторе класса
                var this_= this;
                this.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul.ui-selectable').selectable('destroy');
                
                if(this.openParams.selected == 'folders')
                {
                    this.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul').selectable({
                        filter: ' > li.folder',
                        cancel: ' li.file, li.file *',
                        start: function(event, ui) {
                            this_.dblclickFDetailStart(event);
                        },
                        stop: function(event, ui) {
                            this_.jContainer.find(' .file-manager .col-left-nav .home li').removeClass('selecting');
                            
                            this_.dblclickFDetailStop(event);
                        }
                    });
                }
                else if(this.openParams.selected == 'files')
                {
                    this.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul').selectable({
                        filter: ' > li.file',
                        cancel: ' li.folder, li.folder *',
                        start: function(event, ui) {
                            this_.dblclickFDetailStart(event);
                        },
                        stop: function(event, ui) {
                            this_.jContainer.find(' .file-manager .col-left-nav .home li').removeClass('selecting');
                            
                            this_.dblclickFDetailStop(event);
                            this_.clickFDetail(event);
                        }
                    });
                }
                else if(this.openParams.selected == 'all')
                {
                    this.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul').selectable({
                        filter: ' > li',
                        start: function(event, ui) {
                            this_.dblclickFDetailStart(event);
                        },
                        stop: function(event, ui) {
                            this_.jContainer.find(' .file-manager .col-left-nav .home li').removeClass('selecting');
                            
                            this_.dblclickFDetailStop(event);
                            this_.clickFDetail(event);
                        }
                    });
                }
                //==========
            }
            if(this.jContainer.find(' .file-manager .col-folder-detail .btn-header .list-or-th input:checked').val() == 'th')
            {
                var _this = this;
                
                _this.updateCenterItemsFolderPanel();
                setTimeout(function(){
                    _this.updateCenterItemsFolderPanel();
                }, 1);
            }
        }
    }
    
    fileManager.prototype.updateCenterItemsFolderPanel = function()
    {
        if(this.openParams.folderPanel && this.opened)
        {
            var jUl = this.jContainer.find(' .file-manager .col-folder-detail .scroll-container ul').first();
            
            //Очиста атрибута style от свойства "padding-left"
            if(jUl.attr('style'))
            {
                var styleClearPLeft = jUl.attr('style').replace(/padding\-left:[^;]*;/gim, '').replace(/\s{2,}/gim, ' ').replace(/(^\s+|\s+$)/gim, '');
                jUl.attr('style', styleClearPLeft);
            }
            
            var hConteiner = Math.floor(jUl.width());
            var wItem = Math.ceil(this.jContainer.find(' .file-manager .col-folder-detail .scroll-container li').first().outerWidth(true));
            var colItemsOneRow = Math.floor(hConteiner / wItem);
            
            var resPLeft = Math.floor((hConteiner - (wItem * colItemsOneRow)) / 2);
            jUl.css({paddingLeft: resPLeft+'px'});
        }
    }
    
    fileManager.prototype.updateZoomPanel = function(url, w, h, z)
    {
        var maxSizeToZoom = 20, zoom;
        if(this.openParams.zoomPanel && url !== null)
        {
            if(url !== this.session.zoomPanel.currentIMG)
            {
                //alert(this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom input[value="1"]').size());
                this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom input[value="1"]').attr('checked', true);
                this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom label.btn').removeClass('active');
                this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom input[value="1"]').closest('label').first().addClass('active');
                if(w < maxSizeToZoom && h < maxSizeToZoom)
                {
                    this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom input[value="4"]').attr('checked', true);
                    this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom label.btn').removeClass('active');
                    this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom input[value="4"]').closest('label').first().addClass('active');
                }
                this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom .btn').removeClass('btn-default btn-primary btn-success btn-info btn-warning btn-danger btn-link')
                .each(function(){
                    if($(this).hasClass("active"))
                    {
                        $(this).addClass('btn-'+$(this).attr('data-btn-color'));
                    }
                    else
                    {
                        $(this).addClass('btn-default');
                    }
                });
            }
            
            if(z !== undefined)
            {
                zoom = z;
            }
            else
            {
                zoom = parseFloat(this.jContainer.find(' .file-manager .col-big-img .btn-header .zoom .active input').attr('value'));
            }
            
            this.jContainer.find(' .file-manager .col-big-img .scroll-container').empty();
            this.jContainer.find(' .file-manager .col-big-img .scroll-container').append('<img src="'+url+'" width="'+(Math.round(w * zoom))+'" height="" alt="'+(Math.round(h * zoom))+'" />');
            
            this.session.zoomPanel.currentIMG = url;
            this.session.zoomPanel.w = w;
            this.session.zoomPanel.h = h;
        }
    }
    
    fileManager.prototype.dblclickFDetailStart = function(event)
    {
        //Максимальное время за которое должен быть совершен двойной клик
        var deltaTime = 1200;
        //Максимальное отклонение курсора
        var deltaCursorPos = 2;
        //Определение что произошол двойной клик
        var time = new Date().getTime();
        if(time > this.dblclickFDetail.stop.time && this.dblclickFDetail.stop.time > this.dblclickFDetail.start.time && time - this.dblclickFDetail.start.time <= deltaTime && Math.abs(this.dblclickFDetail.start.cursorPosition.x - event.clientX) <= deltaCursorPos && Math.abs(this.dblclickFDetail.start.cursorPosition.y - event.clientY) <= deltaCursorPos)
        {
            if(this.dblclickFDetail.curentItem !== undefined && this.dblclickFDetail.curentItem.size() == 1 && this.dblclickFDetail.start.cursorPosition.x !== undefined && this.dblclickFDetail.start.cursorPosition.y !== undefined)
            {
                if(this.dblclickFDetail.curentItem.hasClass('file'))
                {
                    var oneItem = this.dblclickFDetail.curentItem.find(' > a').first();
                    var href = oneItem.attr('href');
                    var isFolder = $(this).first().hasClass('folder');
                    
                    if(/(jpg|png|gif)$/gim.test(href))
                    {
                        this.event('dblclick-file-fdetail', {isFolder: false, url: href, width: parseInt(oneItem.find(' ~ .size-image .w').text()), height: parseInt(oneItem.find(' ~ .size-image .h').text())});
                    }
                    else
                    {
                        this.event('dblclick-file-fdetail', {isFolder: false, url: href});
                    }
                }
                else if(this.dblclickFDetail.curentItem.hasClass('folder'))
                {
                    this.event('dblclick-folder-fdetail', this.dblclickFDetail.curentItem.find(' > a').attr('href'));
                }
                else
                {
                    throw new Error('То что вы выбрали не являеться ни папкой ни файлом!');
                }
            }
        }
        
        this.dblclickFDetail.start.time = new Date().getTime();
        this.dblclickFDetail.start.cursorPosition.x = Math.round(event.clientX);
        this.dblclickFDetail.start.cursorPosition.y = Math.round(event.clientY);
    }
    
    fileManager.prototype.dblclickFDetailStop = function(event)
    {
        this.dblclickFDetail.curentItem = this.jContainer.find(' .col-folder-detail .scroll-container li.ui-selected');
        this.dblclickFDetail.stop.time = new Date().getTime();
    }
    
    fileManager.prototype.clickFDetail = function()
    {
        var jItem = this.jContainer.find(' .col-folder-detail .scroll-container li.ui-selected');
        if(jItem.size() == 1 && jItem.hasClass('file'))
        {
            this.event('click-file-fdetail', jItem);
        }
    }
    
    fileManager.prototype.close = function()
    {
        if(this.opened === true)
        {
            this.jContainer.find(' .file-manager .scroll-container').empty();
            this.XMLFolderFiles.find(' folder[opened="0"]').empty();
            this.jContainer.css({display: 'none'});
            this.opened = false;
            
            this.event('close');
        }
    }
    
    //==============================================
    /*ГЕНЕРАЦИЯ СОБЫТИЙ
    Принимает:
        1. Имя генерируемого события
        2. Данные которые нужно передать
        обработчикам текущего события*/
    //==============================================
    fileManager.prototype.event = function(event, data)
    {
        if(typeof event == 'string')
        {
            if(event in this.gEventList)
            {
                var callbacks = this.gEventList[event];
                for(var i in callbacks)
                {
                    callbacks[i](data);
                }
            }
            
            if(event in this.gEventListOne)
            {
                var callbacks = this.gEventListOne[event];
                for(var i in callbacks)
                {
                    callbacks[i](data);
                }
                //Очищаем
                this.gEventListOne[event] = new Array();
            }
        }
    }
    
    //==============================================
    /*УСТАНОВКА СЛУШАТЕЛЕЙ СОБЫТИЙ
    Принимает:
        1. Имя генерируемого события
        2. Функция обработчик события*/
    //==============================================
    fileManager.prototype.on = function(event, func)
    {
        if(typeof event == 'string')
        {
            if(!this.gEventList[event])
            {
                this.gEventList[event] = new Array();
            }
            this.gEventList[event].push(func);
        }
    }
    
    //==============================================
    /*УСТАНОВКА СЛУШАТЕЛЕЙ СОБЫТИЙ НА 1 ВЫЗОВ
    Принимает:
        1. Имя генерируемого события
        2. Функция обработчик события*/
    //==============================================
    fileManager.prototype.one = function(event, func)
    {
        if(typeof event == 'string')
        {
            if(!this.gEventListOne[event])
            {
                this.gEventListOne[event] = new Array();
            }
            this.gEventListOne[event].push(func);
        }
    }
    
    fileManager.open_folder_to_xml = function(folder)
    {
        if(folder.find(' > folder[opened="1"]').size())
        {
            var temp_xml = '';
            var temp = folder.find(' > folder[opened="1"]');
            var count = temp.size();
            for(var i = 0; i < count; i++)
            {
                var tekushaya_papka = $(temp.get(i));
                var href = tekushaya_papka.attr('url_utf8');
                temp_xml += '<folder href="'+href+'">'+fileManager.open_folder_to_xml(tekushaya_papka)+'</folder>';
            }
            return temp_xml;
        }
        else {
            return '';
        }
    }
    
    //Удаляем навигатор
    
    fileManager.prototype.delete_ = function(){
        
        $(this.jContainer+' .file-manager').remove();
        
        if(fileManager.fileManagers.length > 0)
        {
            for(var i = 0; i < fileManager.fileManagers.length; i++)
            {
                if(fileManager.fileManagers[i] === this)
                {
                    fileManager.fileManagers.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    //Удаляем все навигаторы
    
    fileManager.delete_All = function(){
        if(fileManager.fileManagers.length > 0)
        {
            var navigatorsLength = fileManager.fileManagers.length;
            for(var i = 0; i < navigatorsLength; i++)
            {
                fileManager.fileManagers[0].delete_();
            }
        }
    }
    
    //Сохраняем раскрытые папки в текущем навигаторе
    
    fileManager.prototype.savePapki = function(){
        $.ajax({
          url: "shablonizator.php",
          type: "POST",
          cache: false,
          data: ({module: 'filemanager', zapros: 'zapisat_xml', text_encoding: shablonizator.textEncodingServer, papki_xml: fileManager.open_folder_to_xml(this.XMLFolderFiles.find(' > wrap')), xml_fail: this.urlXMLSavedData}),
          dataType: "html",
          async: true//Поставил чтоб при закрытии браузера успевало на сервер отослать данные для сохранения (ВОЗМОЖНО ПРИДЁТЬСЯ ВЕРНУТЬ FALSE)
       });
    }
    
    //Сохраняем все раскрытые папки во всех навигаторах
    
    fileManager.savePapkiAllNavigators = function(){
        if(fileManager.fileManagers.length > 0)
        {
            var navigators_length = fileManager.fileManagers.length;
            for(var i = 0; i < navigators_length; i++)
            {
                fileManager.fileManagers[i].savePapki();
            }
        }
    }
    
    //Сохраняем при завершении работы
    
    $(window).on("beforeunload", function() {
        fileManager.savePapkiAllNavigators();
    });
    
    //Создаём плагин jQuery
    jQuery.fn.fileManager = function(urlXMLSavedData){
        if(this.size())
        {
            return new fileManager($(this.get(0)), urlXMLSavedData);
        }
    };
})(jQuery);