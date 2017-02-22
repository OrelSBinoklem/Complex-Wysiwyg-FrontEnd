var modules = {};

var pageManagerVisualizator, pageManagerVisualizatorFileManager;
var pixelPerfect;//Пиксель перфект

//jQuery XML -> XML Text
(function($){
    $.fn.xml = function () {var r=[];this.each(function(){r.push($.xml(this))});return r };
    $.xml = function(el) {
        if (window.XMLSerializer)
            return (new XMLSerializer()).serializeToString(el)
        var qw = function(s){return '"' + s.replace(/"/g,'&quot;') + '"'};
        if (!el) return "(null)";
        var res = "";
        var tag = el.nodeName.toLowerCase();
        var tagShow = tag.charAt(0) != "#";
        if (tagShow) res += '<' + tag;
        if (el.attributes)
            res += $.map(el.attributes,function(attr){
                if (attr.specified && attr.name.charAt(0) != '$')
                return ' '+attr.name /* .toLowerCase() */ + '=' + qw(attr.value)
            }).join('');
        if (tagShow && el.nodeValue == null && !el.hasChildNodes())
        return res+" />";
        if (tagShow)
            res+= ">";
        if (el.nodeType == 8)
            res += "<!-- " + el.nodeValue + " -->";
        else if (el.nodeValue != null)
            res +=  el.nodeValue.toXML();
        if (el.hasChildNodes && el.hasChildNodes())
            res += $.map(el.childNodes,function(child){return $.xml(child)}).join('');
        if (tagShow)  res += '</' + tag + '>';
        return res
    }
})(jQuery);

//Фикс работы find
(function($){
    jQuery.fn.multiFind = function(selector){

        if(typeof selector == "string")
        {
            var selectors = selector.split(',');
            var $result;

            for(var key in selectors)
            {
                var one__selector = selectors[key];
                if(key == 0)
                {
                    $result = this.find( " "+one__selector );
                }
                else
                {
                    console.log('$sresult:'+$result.size());
                    console.log('d'+(this.find( " "+one__selector ).size()));
                    $result.add( this.find( " "+one__selector ) );
                    console.log('$result:'+$result.size());
                }
            }

            return $result;
        }
        else
        {
            return this;
        }
    }
})(jQuery);

var shablonizator = {};//shablonizator

/*===============================================*/
/*Парсинг глобальных настроек и глобальной сессии*/
/*===============================================*/
(function($){
    $.ajax({
        url: "sb.php",
        type: "POST",
        cache: false,
        data: ({module: 'getfile', dir: 'sb/global_settings.xml', text_encoding: 'UTF-8'}),
        async: false,
        success: function(data){
            shablonizator.settings = $($.parseXML(data));
        }
    });
    
    $.ajax({
        url: "sb.php",
        type: "POST",
        cache: false,
        data: ({module: 'getfile', dir: 'sb/global_session.xml', text_encoding: 'UTF-8'}),
        async: false,
        success: function(data){
            shablonizator.session = $($.parseXML(data));
        }
    });
    
    shablonizator.save_g_settings = function() {
        $.ajax({
            url: "sb.php",
            async: true,
            cache: false,
            type: "POST",
            data: ({module: 'setfile', dir: 'sb/global_settings.xml', file_text: shablonizator.settings.xml().join(''), text_encoding: 'UTF-8'}),
            success: function(data){
                
            }
        });
    }
    
    shablonizator.save_g_session = function() {
        $.ajax({
            url: "sb.php",
            async: true,
            cache: false,
            type: "POST",
            data: ({module: 'setfile', dir: 'sb/global_session.xml', file_text: shablonizator.session.xml().join(''), text_encoding: 'UTF-8'}),
            success: function(data){
                
            }
        });
    }
    
    shablonizator.textEncodingServer = shablonizator.settings.find('text_encoding_server').text();
})(jQuery);

shablonizator.base_url = '';
$.ajax({
      url: "sb.php",
      type: "POST",
      async: false,
      cache: false,
      data: ({module: 'base_url'}),
      success: function(data){
        shablonizator.base_url = data;
    }
});

shablonizator.base_url_full = '';
$.ajax({
      url: "sb.php",
      type: "POST",
      async: false,
      cache: false,
      data: ({module: 'base_url_full'}),
      success: function(data){
        shablonizator.base_url_full = data;
    }
});

shablonizator.base_url_page = '';
shablonizator.base_url_page_full = '';

shablonizator.updateBasesUrlPage = function( currentPage ) {
    var result = '';

    var re_host = /^(https?\:\/\/[\w\.\-]{0,70}\/)(.+)$/i;
    var base_url_no_host = re_host.exec(shablonizator.base_url_full);
    
    var base_url_papki = new Array();
    var url_page_kol_vozvratov = 0;
    var url_page_papki = new Array();

    var relativeCurrentPage = shablonizator.tolko_otnositelnii_put_v_rezultate("hack.html", currentPage);
    if( relativeCurrentPage != "other_domain" ) {
        base_url_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(base_url_no_host[2]);
        url_page_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov( relativeCurrentPage );
        url_page_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array( relativeCurrentPage );

        if(base_url_papki.length >= url_page_kol_vozvratov)
        {
            base_url_papki.splice(base_url_papki.length - url_page_kol_vozvratov, url_page_kol_vozvratov);

            for(var i = 0; i < base_url_papki.length; i++)
            {
                result += base_url_papki[i];
            }
            for(var i = 0; i < url_page_papki.length; i++)
            {
                result += url_page_papki[i];
            }
            shablonizator.base_url_page = "/" + result;
            shablonizator.base_url_page_full = base_url_no_host[1] + result;
        }
        else {
            throw new Error('Ошибка в sb.updateBasesUrlPage');
        }
    } else {
        throw new Error('Страница находиться не на текущем домене');
    }
}

//==============================================
/* РАБОТА С URL*/
//==============================================
var str = function () {

}

//Разбераем url (есть кеш)
str.parsingUrl = function ( url, isFile ) {
    //Кеш
    var idCache = url + "::" + ((isFile === undefined)?"undefined":isFile);
    if( idCache in str.parsingUrl._cache ) {
        return str.parsingUrl._cache[idCache];
    }

    //Разделяем на обычный путь и переменные с якорем
    var url__temp = /^([^\?#]*)(\?[^\?#]*)?(#[^\?#]*)?$/.exec( url );
    var paramsStr = "";
    var paramsObj = url__temp[2] || null; paramsObj = (paramsObj !== null) ? paramsObj.substring(1) : null;
    if( paramsObj !== null ) {
        paramsStr = "?" + paramsObj;
        paramsObj = paramsObj.split("&");
        paramsObj = paramsObj.map(function (item) {
            item = item.split("=");
            return {
                name: item[0],
                value: item[1]
            };
        });
    } else {
        paramsObj = new Array();
    }
    var hash = url__temp[3] || null; hash = (hash !== null) ? hash.substring(1) : null;
    url__temp = url__temp[1];

    //Определяем тип url и протокол
    var type;
    var typePriority;

    var protocol = /^(https?:\/\/|\/)/.exec( url__temp );
    if( protocol !== null ) {
        if( /^http/.test(protocol[1]) ) {
            url__temp = url__temp.substring( protocol[1].length );
            protocol = protocol[1].substr(0, protocol[1].length - 2);
            type = "absolute";
            typePriority = 2;
        } else if( /^\//.test(protocol[1]) ) {
            url__temp = url__temp.substring( protocol[1].length );
            protocol = null;
            type = "local";
            typePriority = 1;
        } else {
            throw new Error( "Неудалось определить тип url:" + url );
        }
    } else {
        protocol = null;
        type = "relative";
        typePriority = 0;
    }

    //Определяем домен
    var port = null;
    var domain = null;
    if( type == "absolute" ) {
        domain = /^(([\w\-\.\~]+)(\:(\d{1,6}))?)/i.exec( url__temp );
        if( domain !== null ) {
            url__temp = url__temp.substring( domain[1].length );
            url__temp = url__temp.replace(/^\//, "");
            port = domain[4] || null; port = ( port !== null ) ? parseInt(port) : null;
            domain = domain[2];
        } else {
            throw new Error( "Неудалось выделить домен:" + url );
        }
    }

    //Автоматически определяем являеться ли папкой текущий url
    if( isFile === undefined ) {
        isFile = /\.[\w]{1,16}$/i.test( url__temp );
    }

    //Определяем возвраты, папки, имя файла и расширение
    var numberOfFoldersUp = null;
    var arrFolders = new Array();
    var fileName = "";
    var fileExtension = "";

    if( type == "relative" ) {
        numberOfFoldersUp = 0;
        var foldersUp = /^((\.\.\/)*)/.exec( url__temp );
        if( foldersUp !== null ) {
            url__temp = url__temp.substring( foldersUp[1].length );
            numberOfFoldersUp = Math.round( foldersUp[1].length / 3 );
        }
    }

    if( isFile ) {
        var arrFolders = url__temp.split("/");
        var fullFileName = /^([\w\-\.\~ %]*)\.([\w]+)$/i.exec( arrFolders[arrFolders.length - 1] );
        if( fullFileName !== null ) {
            fileName = fullFileName[1];
            fileExtension = fullFileName[2];
        } else {
            throw new Error( "Неудалось определить имя файла:" + url );
        }
        arrFolders.splice( arrFolders.length - 1, 1 );
    } else {
        url__temp = url__temp.replace(/\/$/, "");
        arrFolders = url__temp.split("/");
        if( arrFolders.length == 0 || arrFolders[0] == "" ) {
            arrFolders = new Array();
        }
    }

    var resObj = {
        type: type,
        typePriority: typePriority,
        protocol: protocol,
        domain: domain,
        port: port,
        numberOfFoldersUp: numberOfFoldersUp,
        arrFolders: arrFolders,
        fileName: fileName,
        fileExtension: fileExtension,
        fileNameFull: (fileName != "" || fileExtension != "")?fileName + "." + fileExtension:"",
        paramsStr: paramsStr,
        paramsObj: paramsObj,
        hash: hash
    };

    //Кеш
    if( Object.keys(str.parsingUrl._cache).length >= str.parsingUrl.cacheLimit ) {
        for( var key in str.parsingUrl._cache ) {
            delete str.parsingUrl._cache[key];
            if( Object.keys(str.parsingUrl._cache).length < str.parsingUrl.cacheLimit ) {
                break;
            }
        }
    }
    str.parsingUrl._cache[idCache] = resObj;

    return resObj;
}

str.parsingUrl.cacheLimit = 100;
str.parsingUrl._cache = {};

//Если у нас 3 подключённых файла и 2 url ко второму и третьему
//то этот метод создаст url к третьему файлу который можно вставить в первый
//и он будет вести именно к третьему файлу
//Можно заместо url передавать расспарсееные объекты url
str.intermediateUrl = function ( url__1, url__2, isFile__1, isFile__2 ) {
    var u2 = str.parsingUrl( url__2, isFile__2 );
    if( u2.type == "absolute" ) {
        return url__2;
    }
    var u1 = str.parsingUrl( url__1, isFile__1 );

    if( u2.type == "local" ) {
        if( u1.type == "absolute" ) {
            return u1.protocol + "//" +
                u1.domain + ((u1.port !== null)?u1.port:"") +
                url__2;
        } else {
            return url__2;
        }
    }

    if( u2.type == "relative" ) {
        var resultUrl = "";
        switch( u1.type ) {
            case "relative":
                var res__numberOfFoldersUp = 0;
                var res__Folders = new Array();
                if( u1.arrFolders.length < u2.numberOfFoldersUp ) {
                    res__numberOfFoldersUp = u2.numberOfFoldersUp - u1.arrFolders.length;
                } else {
                    res__Folders = u1.arrFolders.slice( 0, u1.arrFolders.length - u2.numberOfFoldersUp );
                }
                res__numberOfFoldersUp += u1.numberOfFoldersUp;
                res__Folders = res__Folders.concat( u2.arrFolders );

                resultUrl += (new Array(res__numberOfFoldersUp + 1).join("../")) +
                    ((res__Folders.length)?res__Folders.join("/"):"");
                break;
            case "local":
                if( u1.arrFolders.length < u2.numberOfFoldersUp ) {
                    throw new Error( "Папок в url 1:" + url__1 + ": Меньше чем возвратов в url 2:" + url__2 );
                }
                var res__Folders = u1.arrFolders.slice( 0, u1.arrFolders.length - u2.numberOfFoldersUp );
                res__Folders = res__Folders.concat( u2.arrFolders );
                resultUrl += "/" + ((res__Folders.length)?res__Folders.join("/"):"");
                break;
            case "absolute":
                if( u1.arrFolders.length < u2.numberOfFoldersUp ) {
                    throw new Error( "Папок в url 1:" + url__1 + ": Меньше чем возвратов в url 2:" + url__2 );
                }
                var res__Folders = u1.arrFolders.slice( 0, u1.arrFolders.length - u2.numberOfFoldersUp );
                res__Folders = res__Folders.concat( u2.arrFolders );
                resultUrl += u1.protocol + "//" +
                    u1.domain + ((u1.port !== null)?u1.port:"") +
                    res__Folders.reduce(function(concat, current) {return concat + "/" + current}, "");
                break;
        }
        if( !(/\/$/.test(resultUrl)) && resultUrl != "" ) {
            resultUrl += "/";
        }
        resultUrl += u2.fileNameFull + u2.paramsStr + ( (u2.hash !== null)?"#"+u2.hash:"" );
        if( u1.type == "relative" && u2.type == "relative" && resultUrl == "/" ) {
            resultUrl = "";
        }
        return resultUrl;
    }
}

//Относительный путь между двумя абсолютными url
str.relativeUrlFrom2Absolute = function ( url__1, url__2, isFile__1, isFile__2 ) {
    var resultUrl = "";
    var u1 = str.parsingUrl( url__1, isFile__1 );
    var u2 = str.parsingUrl( url__2, isFile__2 );

    if( u1.type == "absolute" && u2.type == "absolute" ) {
        if( u1.protocol + "//" + u1.domain + ((u1.port !== null)?u1.port:"") == u2.protocol + "//" + u2.domain + ((u2.port !== null)?u2.port:"") ) {
            //Определяем относительный путь
            var f1 = [].concat(u1.arrFolders);
            var f2 = [].concat(u2.arrFolders);
            while( f1.length && f2.length ) {
                if( f1[0] == f2[0] ) {
                    f1.shift();
                    f2.shift();
                } else {
                    break;
                }
            }

            resultUrl += (new Array(f1.length + 1).join("../")) +
                ((f2.length)?f2.join("/"):"");
            if( !(/\/$/.test(resultUrl)) && resultUrl != "" ) {
                resultUrl += "/";
            }
            resultUrl += u2.fileNameFull + u2.paramsStr + ( (u2.hash !== null)?"#"+u2.hash:"" );
            if( u1.type == "relative" && u2.type == "relative" && resultUrl == "/" ) {
                resultUrl = "";
            }
            return resultUrl;
            //Определяем относительный путь (конец)

        } else {
            return "error:domains_do_not_match";
        }
    } else {
        throw new Error( "Один из url'ов не являеться абсолютным:" + url__1 + ":url 2:" + url__2 );
    }

}

//Проверка существования папки или файла
shablonizator.fileExists = function(dir) {
    var exists = false;
    $.ajax({
        url: "sb.php",
        type: "POST",
        cache: false,
        data: ({module: 'file_exists', dir: dir, text_encoding: shablonizator.textEncodingServer}),
        async: false,
        success: function(data){
            if(data == 'true')
            {
                exists = true;
            }
        }
    });
    return exists;
}

/***********************************************/
//Для "twitter bootstrap 3"
/***********************************************/
$(document).ready(function(){
    $('body').on('click', ' .btn-toggle-one-color', function(){
        $(this).find(' .btn').removeClass('btn-default btn-primary btn-success btn-info btn-warning btn-danger btn-link')
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
    });
    
    $('body').on('change', ' .btn-toggle-one-color input', function(){
        var BTNGroup = $(this).closest('.btn-toggle-one-color').first();
        if(BTNGroup.size())
        {
            BTNGroup.find(' .btn').removeClass('btn-default btn-primary btn-success btn-info btn-warning btn-danger btn-link')
            .each(function(){
                if($(this).find(' input').prop("checked"))
                {
                    $(this).addClass('btn-'+$(this).attr('data-btn-color'));
                }
                else
                {
                    $(this).addClass('btn-default');
                }
            });
        }
    });
});
