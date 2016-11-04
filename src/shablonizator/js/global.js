var modules = {};

var pageManagerVisualizator, pageManagerVisualizatorFileManager;
var pixelPerfect;//Пиксель перфект
var editor;//Редактор
var liveStyle = {};//Редактор стилей на лету
var generatorCode;

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
        url: "shablonizator.php",
        type: "POST",
        cache: false,
        data: ({module: 'getfile', dir: 'shablonizator/global_settings.xml', text_encoding: 'UTF-8'}),
        async: false,
        success: function(data){
            shablonizator.settings = $($.parseXML(data));
        }
    });
    
    $.ajax({
        url: "shablonizator.php",
        type: "POST",
        cache: false,
        data: ({module: 'getfile', dir: 'shablonizator/global_session.xml', text_encoding: 'UTF-8'}),
        async: false,
        success: function(data){
            shablonizator.session = $($.parseXML(data));
        }
    });
    
    shablonizator.save_g_settings = function() {
        $.ajax({
            url: "shablonizator.php",
            async: true,
            cache: false,
            type: "POST",
            data: ({module: 'setfile', dir: 'shablonizator/global_settings.xml', file_text: shablonizator.settings.xml().join(''), text_encoding: 'UTF-8'}),
            success: function(data){
                
            }
        });
    }
    
    shablonizator.save_g_session = function() {
        $.ajax({
            url: "shablonizator.php",
            async: true,
            cache: false,
            type: "POST",
            data: ({module: 'setfile', dir: 'shablonizator/global_session.xml', file_text: shablonizator.session.xml().join(''), text_encoding: 'UTF-8'}),
            success: function(data){
                
            }
        });
    }
    
    shablonizator.textEncodingServer = shablonizator.settings.find('text_encoding_server').text();
})(jQuery);

shablonizator.base_url = '';
$.ajax({
      url: "shablonizator.php",
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
      url: "shablonizator.php",
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

/*Если например у нас в html есть подключаемый css файл с адресом url_1,
а внутри него картинка(background-image) с url_2 - то эта функция
возвратит путь от html до картинки*/
shablonizator.adres_faila_iz_faila_otnositelno_tretego_faila = function(url_1, url_2) {
    //alert(url_1+'---'+url_2);
    //console.log(url_1+'---'+url_2);
    var re_host = /^(https?\:\/\/[\w\.\-]{0,70}\/)(.+)$/i;
    var re_slesh = /^\//;
    var re_http = /^http\:\/\//i;
    var re_vozrati_papka_file = /^((\.\.\/)*)(([\w\~\@#\$\%\^\-\(\)\{\}\'\`\. ]+\/)*)([\w\-\. ]*\.[\w]{1,16})$/i;
    var base_url_no_host = re_host.exec(shablonizator.base_url_full);
    var base_url_host = re_host.exec(shablonizator.base_url_full)[1];
    var url_1_kol_vozvratov = 0;
    var url_1_papki = new Array();
    var url_2_kol_vozvratov = 0;
    var url_2_papki = new Array();
    //Если в начале слэш
    if(re_slesh.exec(url_1) !== null)
    {
        var base_url_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(base_url_no_host[2]);
        var base_url_papki_conkat = '';
        for(var i = 0; i < base_url_papki.length; i++) {base_url_papki_conkat += '../';}
        var result = shablonizator.tolko_otnositelnii_put_v_rezultate(base_url_papki_conkat + url_1.substring(1), url_2, true);
        if(result == 'other_domain')
        {
            return url_2;
        }
        else {
            return result;
        }
    }
    //Если в начале http
    else if(re_http.exec(url_1) !== null)
    {
        //Наш хост
        if(base_url_host === url_1.substring(0, base_url_host.length))
        {
            var base_url_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(base_url_no_host[2]);
            var base_url_papki_conkat = '';
            for(var i = 0; i < base_url_papki.length; i++) {base_url_papki_conkat += '../';}
            var result = shablonizator.tolko_otnositelnii_put_v_rezultate(base_url_papki_conkat + re_host.exec(url_1)[2], url_2, true);
            if(result == 'other_domain')
            {
                return url_2;
            }
            else {
                return result;
            }
        }
        //Не наш хост
        else {
            if(re_http.exec(url_2) !== null)
            {
                //Наш хост
                if(base_url_host === url_2.substring(0, base_url_host.length))
                {
                    return shablonizator.tolko_otnositelnii_put_v_rezultate('shablonizator.html', url_2, true);
                }
            }
            var base_url_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(base_url_no_host[2]);
            var base_url_papki_conkat = '';
            var url_1_host = re_host.exec(url_1)[1]; 
            var url_1_no_host = re_host.exec(url_1)[2]; 
            for(var i = 0; i < base_url_papki.length; i++) {base_url_papki_conkat += '../';}
            var result = shablonizator.tolko_otnositelnii_put_v_rezultate(base_url_papki_conkat + re_host.exec(url_1)[2], url_2, true);
            //Не наш хост
            if(result == 'other_domain')
            {
                return url_2;
            }
            else {
                //Если в url_2 слэш
                if(re_slesh.exec(url_2) !== null)
                {
                    return url_1_host + url_2.substring(1);
                }
                //Если относительный
                else {
                    var result = '';
                    url_1_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_1_no_host);
                    url_2_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov(url_2);
                    url_2_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_2);
                    url_2_file = re_vozrati_papka_file.exec(url_2)[5];
                    if(url_1_papki.length >= url_2_kol_vozvratov)
                    {
                        
                        url_1_papki.splice(url_1_papki.length - url_2_kol_vozvratov, url_2_kol_vozvratov);
                        
                        for(var i = 0; i < url_1_papki.length; i++)
                        {
                          result += url_1_papki[i];
                        }
                        for(var i = 0; i < url_2_papki.length; i++)
                        {
                          result += url_2_papki[i];
                        }
                        return url_1_host + result + url_2_file;
                    }
                    else {
                        throw new Error('Ошибка в shablonizator.adres_faila_iz_faila_otnositelno_tretego_faila');
                        alert('Ошибка в shablonizator.adres_faila_iz_faila_otnositelno_tretego_faila');
                    }
                }
            }
        }
    }
    //если url_1 просто относительный
    else if(re_vozrati_papka_file.exec(url_1) !== null) {
        var result = shablonizator.tolko_otnositelnii_put_v_rezultate(url_1, url_2, true);
        if(result == 'other_domain')
        {
            return url_2;
        }
        else {
            return result;
        }
    }
    else {
        throw new Error('Ошибка в shablonizator.adres_faila_iz_faila_otnositelno_tretego_faila');
        alert('Ошибка в shablonizator.adres_faila_iz_faila_otnositelno_tretego_faila');
        return false;
    }
}

shablonizator.adres_faila_iz_faila_otnositelno_obrabativaemoi_stranici = function(url_1, url_2) {
    var result = '';
    var temp_1 = '';
    var temp_2 = '';

    shablonizator.updateBasesUrlPage();
    
    temp_1 = shablonizator.base_url;
    temp_2 = shablonizator.base_url_full;
    shablonizator.base_url = shablonizator.base_url_page;
    shablonizator.base_url_full = shablonizator.base_url_page_full;
    try
    {
        result = shablonizator.adres_faila_iz_faila_otnositelno_tretego_faila(url_1, url_2);
    }
    catch(e)
    {
        throw new Error('некорректный url');
    }
    
    shablonizator.base_url = temp_1;
    shablonizator.base_url_full = temp_2;
    
    return result;
}

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
            throw new Error('Ошибка в shablonizator.updateBasesUrlPage');
        }
    } else {
        throw new Error('Страница находиться не на текущем домене');
    }
}

/*Тоже самое что и сверху только возвращает
относительный путь - если путь нельзя возратить
при условии что url второго файла будет ссылаться
на другой домен, то возвращает other_domain,
при ошибке false,
первым параметром всегда передаеться относительный путь к файлу,
также эта функция дает самый короткий относительный путь*/

/*3-й параметр если два url относительные то просто зделать
относительный url или зделать максимально короткий с
исползованием в расчетах base_url*/

shablonizator.tolko_otnositelnii_put_v_rezultate = function(url_1, url_2, min_length)/*Зделать ещё одну функцию чтоб url_1 был любым (не только относительным)*/ {
    var url_1_kol_vozvratov = 0;
    var url_1_papki = new Array();
    var url_2_kol_vozvratov = 0;
    var url_2_papki = new Array();
    var url_2_file = '';
    var result = '';
    var re_slesh = /^\//;
    var re_http = /^http\:\/\//i;
    var re_vozrati_papka_file = /^((\.\.\/)*)(([\w\~\@#\$\%\^\-\(\)\{\}\'\`\. ]+\/)*)([\w\-\. ]*\.[\w]{1,16})$/i;
    var re_host = /^(https?\:\/\/[\w\.\-]{0,70}\/)(.+)$/i;
    
    //Если в начале слэш
    if(re_slesh.exec(url_2) !== null)
    {
        var base_url_no_host = re_host.exec(shablonizator.base_url_full);
        var base_url_papki = new Array();
        var url_1_result_array = new Array();
        var result_vozvrati = 0;
        
        if(base_url_no_host !== null)
        {
            base_url_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(base_url_no_host[2]);
            url_1_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov(url_1);
            url_1_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_1);
            url_2 = url_2.substring(1);
            url_2_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_2);
            url_2_file = re_vozrati_papka_file.exec(url_2)[5];
            
            url_1_result_array = base_url_papki;//fix
                
            var min_length_papki = 0;
            var max_length_papki = 0;
            if(url_1_result_array.length > url_2_papki.length)
            {
                result_vozvrati = url_1_result_array.length - url_2_papki.length;
                min_length_papki = url_2_papki.length;
                max_length_papki = url_1_result_array.length;
            }
            else {
                min_length_papki = url_1_result_array.length;
                max_length_papki = url_2_papki.length;
            }
            
            var kol_sovpavshih_papok_v_nachale = 0;
            
            for(var i = 0; i < min_length_papki; i++)
            {
                if(url_1_result_array[i] === url_2_papki[i])
                {
                    kol_sovpavshih_papok_v_nachale++;
                }
                else {
                    break;
                }
            }
            
            result_vozvrati = result_vozvrati + min_length_papki - kol_sovpavshih_papok_v_nachale;
            for(var i = 0; i < result_vozvrati; i++)
            {
              result += '../';
            }
            for(var i = kol_sovpavshih_papok_v_nachale; i < url_2_papki.length; i++)
            {
                result += url_2_papki[i];
            }
            return result + url_2_file;
        }
        else {throw new Error('Ошибка в shablonizator.tolko_otnositelnii_put_v_rezultate'); alert('Ошибка в shablonizator.tolko_otnositelnii_put_v_rezultate');}
    }
    //Если в начале http
    else if(re_http.exec(url_2) !== null)
    {
        var base_url_no_host = re_host.exec(shablonizator.base_url_full);
        var base_url_host = re_host.exec(shablonizator.base_url_full)[1];
        var url_1_result_array = new Array();
        var base_url_papki = new Array();
        if(base_url_host === url_2.substring(0, base_url_host.length))
        {
            url_2 = re_host.exec(url_2)[2];
            var result_vozvrati = 0;
            
            base_url_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(base_url_no_host[2]);
            url_1_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov(url_1);
            url_1_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_1);
            url_2_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_2);
            url_2_file = re_vozrati_papka_file.exec(url_2)[5];
                
            if(base_url_papki.length >= url_1_kol_vozvratov)
            {
                url_1 = '';
                
                url_1_papki = base_url_papki;//fix
                var min_length_papki = 0;
                var max_length_papki = 0;
                if(url_1_papki.length > url_2_papki.length)
                {
                    result_vozvrati = url_1_papki.length - url_2_papki.length;
                    min_length_papki = url_2_papki.length;
                    max_length_papki = url_1_papki.length;
                }
                else {
                    min_length_papki = url_1_papki.length;
                    max_length_papki = url_2_papki.length;
                }
                
                var kol_sovpavshih_papok_v_nachale = 0;
                
                for(var i = 0; i < min_length_papki; i++)
                {
                    if(url_1_papki[i] === url_2_papki[i])
                    {
                        kol_sovpavshih_papok_v_nachale++;
                    }
                    else {
                        break;
                    }
                }
                
                result_vozvrati = result_vozvrati + min_length_papki - kol_sovpavshih_papok_v_nachale;
                for(var i = 0; i < result_vozvrati; i++)
                {
                  result += '../';
                }
                for(var i = kol_sovpavshih_papok_v_nachale; i < url_2_papki.length; i++)
                {
                    result += url_2_papki[i];
                }
                return result + url_2_file;
            }
        }
        else {
            return 'other_domain';
        }
    }
    //если url_2 просто относительный
    else if(re_vozrati_papka_file.exec(url_2) !== null) {
        //максимально короткий с использованием в расчетах base_url (тут надо учитыват и путь бызе юрл - притаком подходетеряеться информация о первом файле базе юрл и мы в результате получаем только более коротки url_2)
        if(min_length)
        {
            var base_url_no_host = re_host.exec(shablonizator.base_url_full);
            var base_url_papki = new Array();
            var url_1_result_array = new Array();
            var url_2_result_array = new Array();
            var result_vozvrati = 0;
            
            if(base_url_no_host !== null)
            {
                base_url_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(base_url_no_host[2]);
                url_1_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov(url_1);
                url_2_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov(url_2);
                url_1_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_1);
                url_2_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_2);
                url_2_file = re_vozrati_papka_file.exec(url_2)[5];
                
                if(base_url_papki.length >= url_1_kol_vozvratov && ((base_url_papki.length - url_1_kol_vozvratov + url_1_papki.length) >= url_2_kol_vozvratov))
                {
                    var kol_papok_concat = base_url_papki.length - url_1_kol_vozvratov;
                    for(var i = 0; i < kol_papok_concat; i++)
                    {
                        url_1_result_array[url_1_result_array.length] = base_url_papki[i];
                    }
                    
                    kol_papok_concat = url_1_papki.length;
                    
                    for(var i = 0; i < kol_papok_concat; i++)
                    {
                        url_1_result_array[url_1_result_array.length] = url_1_papki[i];
                    }
                    
                    kol_papok_concat = url_1_result_array.length - url_2_kol_vozvratov;
                    for(var i = 0; i < kol_papok_concat; i++)
                    {
                        url_2_result_array[url_2_result_array.length] = url_1_result_array[i];
                    }
                    
                    kol_papok_concat = url_2_papki.length;
                    
                    for(var i = 0; i < kol_papok_concat; i++)
                    {
                        url_2_result_array[url_2_result_array.length] = url_2_papki[i];
                    }
                    
                    url_1_result_array = base_url_papki;//fix (написано выше (относително басе юрл а не первого юрл))
                    
                    var min_length_papki = 0;
                    var max_length_papki = 0;
                    if(url_1_result_array.length > url_2_result_array.length)
                    {
                        result_vozvrati = url_1_result_array.length - url_2_result_array.length;
                        min_length_papki = url_2_result_array.length;
                        max_length_papki = url_1_result_array.length;
                    }
                    else {
                        min_length_papki = url_1_result_array.length;
                        max_length_papki = url_2_result_array.length;
                    }
                    
                    var kol_sovpavshih_papok_v_nachale = 0;
                    
                    for(var i = 0; i < min_length_papki; i++)
                    {
                        if(url_1_result_array[i] === url_2_result_array[i])
                        {
                            kol_sovpavshih_papok_v_nachale++;
                        }
                        else {
                            break;
                        }
                    }
                    
                    result_vozvrati = result_vozvrati + min_length_papki - kol_sovpavshih_papok_v_nachale;
                    for(var i = 0; i < result_vozvrati; i++)
                    {
                      result += '../';
                    }
                    for(var i = kol_sovpavshih_papok_v_nachale; i < url_2_result_array.length; i++)
                    {
                        result += url_2_result_array[i];
                    }
                    return result + url_2_file;
                }
                else {throw new Error('Ошибка в shablonizator.tolko_otnositelnii_put_v_rezultate'); alert('Ошибка в shablonizator.tolko_otnositelnii_put_v_rezultate (возвратов больше чем папок в base_url)');}
            }
            else {throw new Error('Ошибка в shablonizator.tolko_otnositelnii_put_v_rezultate'); alert('Ошибка в shablonizator.tolko_otnositelnii_put_v_rezultate');}
        }
        //Просто относителный из относительных
        else {
            url_1_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov(url_1);
            url_2_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov(url_2);
            url_1_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_1);
            url_2_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_2);
            url_2_file = re_vozrati_papka_file.exec(url_2)[5];
            
            if(url_2_kol_vozvratov > 0)
            {
                  var temp = url_2_kol_vozvratov - url_1_papki.length;
                  if(url_1_papki.length >= url_2_kol_vozvratov)
                  {
                      url_1_papki.splice(url_1_papki.length - url_2_kol_vozvratov, url_2_kol_vozvratov);
                  }
                  else{
                      url_1_papki.splice(0, url_1_papki.length);
                      url_1_kol_vozvratov = url_1_kol_vozvratov + temp;
                  }
            }
            for(var i = 0; i < url_1_kol_vozvratov; i++)
            {
              result += '../';
            }
            for(var i = 0; i < url_1_papki.length; i++)
            {
              result += url_1_papki[i];
            }
            for(var i = 0; i < url_2_papki.length; i++)
            {
              result += url_2_papki[i];
            }
            return result += url_2_file;
        }
    }
    else {
        throw new Error('Ошибка в shablonizator.tolko_otnositelnii_put_v_rezultate');        
        return false;
    }
}

/*Полный url из относительного (чтоб можно было сравнивать - потому что
несколько относительных путей могут ссылаться на один и тотже файл)*/

shablonizator.tolko_polnii_put_v_rezultate2 = function(url_1, url_2) {//несовсем
    if(/^https?/i.test(url_2) || /^\//i.test(url_2))
    {
        return url_2;
    }
    
    if(url_2 == '' || url_2 == '.')
    {
        return url_1;
    }
    
    var url_2_result_array = new Array();
    var result = '';
    var re_host = /^(https?\:\/\/[\w\.\-]{0,70}\/)(.+)$/i;
    var base_url_host = re_host.exec(url_1)[1];
    var base_url_no_host = re_host.exec(url_1)[2];
    var re_vozrati_papka_file = /^((\.\.\/)*)(([\w\~\@#\$\%\^\-\(\)\{\}\'\`\. ]+\/)*)([\w\-\. ]*\.[\w]{1,16})$/i;
    
    var base_url_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(base_url_no_host);
    var url_2_kol_vozvratov = shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov(url_2);
    var url_2_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_2);
    var url_2_file = re_vozrati_papka_file.exec(url_2)[5];
    
    var kol_papok_concat = base_url_papki.length - url_2_kol_vozvratov;
    if(kol_papok_concat < 0)
    {
        throw new Error('Ошибка в tolko_polnii_put_v_rezultate - количество возратов больше чем папок в base_url');
        return false;
    }
    for(var i = 0; i < kol_papok_concat; i++)
    {
        result += base_url_papki[i];
    }
    
    for(var i = 0; i < url_2_papki.length; i++)
    {
        result += url_2_papki[i];
    }
    
    return base_url_host + result + url_2_file;
}

shablonizator.tolko_otnositelnii_put_v_rezultate.kol_vozvratov = function(str) {
    var re_vozrati = /^((\.\.\/)*)/gim;
    var result = re_vozrati.exec(str);
    if(result !== null)
    {
        return result[1].length / 3;
    }
    else {
        return false;
    }
}

shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array = function(str) {
    var papki = new Array();
    var re_papka = /([\w\~\@#\$\%\^\-\(\)\{\}\'\`\. ]+\/)/gim;
    var result = null;

    while((result = re_papka.exec(str)) !== null)
    {
        if(result[1] != '../')
        {
            papki[papki.length] = result[1];
        }
    }
    return papki;
}

shablonizator.tolko_otnositelnii_put_v_rezultate.otnositelnii_put_iz_dvuh_full_url = function(url_1, url_2) {
    var url_1_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_1);
    var url_2_papki = shablonizator.tolko_otnositelnii_put_v_rezultate.papki_array(url_2);
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

//Вырезание тэгов "script" из html кода
shablonizator.deleteScriptTagsFromHtml = function(htmlCode) {//кавычки в html не экранируються(что упрощает работу)
    var offsetScripts = new Array();
    //Ищем начала открывающих тегов "script"
    var reFirstTagStyle = /(<!--[\s\S]*?-->|"[^"]*?"|'[^']*?'|<script)/gim;
    var firstTagStyle;
    while((firstTagStyle = reFirstTagStyle.exec(htmlCode)) != null)
    {
        var concateOffset = 0;
        var flagNaidenLastTagStyle = false;
        if(/^<script$/i.test(firstTagStyle[0]))
        {
            concateOffset = reFirstTagStyle.lastIndex;
            //Ищем конец открывающего тэга "script"
            var reFirstTagStyleEnd = /("[^"]*?"|'[^']*?'|>)/gim;
            var firstTagStyleEnd;
            var textFirstTagStyle = htmlCode.substr(reFirstTagStyle.lastIndex);
            while((firstTagStyleEnd = reFirstTagStyleEnd.exec(textFirstTagStyle)) != null)
            {
                if(/^>$/i.test(firstTagStyleEnd[0]))
                {
                    concateOffset += reFirstTagStyleEnd.lastIndex;
                    //Ищем закрывающий тэг "script"
                    var reLastTagStyle = /(\/\*[\s\S]*?\*\/|\/\/[\s\S]*?$|"([^"\\]|\\[\s\S])*?"|'([^'\\]|\\[\s\S])*?'|<\/script>)/gim;
                    var lastTagStyle;
                    var textLastTagStyle = textFirstTagStyle.substr(reFirstTagStyleEnd.lastIndex);
                    while((lastTagStyle = reLastTagStyle.exec(textLastTagStyle)) != null)
                    {
                        if(/^<\/script>$/i.test(lastTagStyle[0]))
                        {
                            concateOffset += reLastTagStyle.lastIndex;
                            flagNaidenLastTagStyle = true;
                            offsetScripts[offsetScripts.length] = {start: reFirstTagStyle.lastIndex - firstTagStyle[0].length, end: concateOffset};
                            break;
                        }
                    }
                    //=====
                    break;
                }
            }
            //=====
        }
    }
    //=====
    //Формируем код без скриптов
    if(offsetScripts.length == 0)
    {
        return htmlCode;
    }
    var result = "";
    for(var i = 0; i < offsetScripts.length; i++)
    {
        if(i === 0)
        {
            result += htmlCode.substring(0, offsetScripts[i].start);
        }
        if(0 < i && i < offsetScripts.length - 1)
        {
            result += htmlCode.substring(offsetScripts[i].end, offsetScripts[i + 1].start);
        }
        if(i === offsetScripts.length - 1)
        {
            result += htmlCode.substring(offsetScripts[i].end);
        }
        //alert(htmlCode.substring(offsetScripts[i].start, offsetScripts[i].end));
    }
    return result;
    //=====
}

//ДОПИСАТЬ МЕТОД КОТОРЫЙ САМ СОРТИРУЕТ (ДЛЯ УДОБСТВА)
/*Сравнение двух строк
Принимает 2 строки
Возращает:
0 - если равны,
1 - если "a" больше
-1 - если "b" больше*/
shablonizator.naturalCompareString = function(a, b) {
    a = shablonizator.stringSeparateStringAndDigits(a);
    b = shablonizator.stringSeparateStringAndDigits(b);
    
    return shablonizator.compareArrayString(a, b);
}

shablonizator.stringSeparateStringAndDigits = function(a) {
    return a.split(/(\d+)/gim);
}

shablonizator.compareArrayString = function(a, b) {
    var minLength = Math.min(a.length, b.length), isDigit = false, d1, d2;
    
    for(var i = 0; i < minLength; i++)
    {
        if(!isDigit)
        {
            //Сравниваем нециферные подстроки
            if(a[i] > b[i])
            {
                return 1;
            }
            if(a[i] < b[i])
            {
                return -1;
            }
            
            isDigit = true;
        }
        else
        {
            //Сравниваем цифры
            //Вначале по длинне, да и отрежем лишние нули слева - например: 0010 -> 10
            d1 = a[i].replace(/^0*/g, '');
            d2 = b[i].replace(/^0*/g, '');
            
            if(d1.length > d2.length)
            {
                return 1;
            }
            if(d1.length < d2.length)
            {
                return -1;
            }
            //Если по длинне числа равны то сравниваем обычным методом - посколько при равной длинне чисел он сравнивает так как надо
            if(d1 > d2)
            {
                return 1;
            }
            if(d1 < d2)
            {
                return -1;
            }
            
            isDigit = false;
        }
    }
    
    //Ещё проверяем по длинне (одна строка может иметь больше кусочков а поскольку мы сравниваем только по минимальному числу кусочков 
    //то эти кусочки в обеих строках могут быть равны, оставшиеся кусочки можно воспринимать ка большую длинну
    //так как если мин. набор кусочков совпал то он совпал и по длинне, то строка в которой больше кусочков будет точно иметь большее количество символов)
    if(a.length > b.length)
    {
        return 1;
    }
    if(a.length < b.length)
    {
        return -1;
    }
    
    return 0;
}

//Проверка существования папки или файла
shablonizator.fileExists = function(dir) {
    var exists = false;
    $.ajax({
        url: "shablonizator.php",
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

//Создать каталог
shablonizator.createFolder = function(dir) {
    $.ajax({
        url: "shablonizator.php",
        type: "POST",
        cache: false,
        data: ({module: 'create_folder', dir: dir, text_encoding: shablonizator.textEncodingServer}),
        async: false,
        success: function(data){
            console.log(data);
        }
    });
}

//Создать или перезаписать файл
shablonizator.createFile = function(dir, text, overwrite) {
    $.ajax({
        url: "shablonizator.php",
        type: "POST",
        cache: false,
        data: ({module: 'create_update_file', dir: dir, file_text: text, text_encoding: shablonizator.textEncodingServer, overwrite: overwrite || false}),
        async: false,
        success: function(data){
            
        }
    });
}

//Копировать папку
shablonizator.copyFolder = function(src, dest, overwrite) {
    $.ajax({
        url: "shablonizator.php",
        type: "POST",
        cache: false,
        data: ({module: 'copyist', zapros: 'copyfolder', source: src, dest: dest, text_encoding: shablonizator.textEncodingServer, overwrite: overwrite || false}),
        async: false,
        success: function(data){
            
        }
    });
}

//Копировать файл
shablonizator.copyFile = function(src, dest, overwrite) {
    $.ajax({
        url: "shablonizator.php",
        type: "POST",
        cache: false,
        data: ({module: 'copyist', zapros: 'copyfile', source: src, dest: dest, text_encoding: shablonizator.textEncodingServer, overwrite: overwrite || false}),
        async: false,
        success: function(data){
            
        }
    });
}

//Форматирование кода
shablonizator.formatter = function( code, type, async, callback ) {
    var error__ajax = false;
    var css = '';
    console.log(code, type);

    try {
        var url = 'http://127.0.0.1:1335/';
        var XHR = window.XDomainRequest || window.XMLHttpRequest;
        var xhr = new XHR();
        xhr.open('POST', url, async);
        xhr.onload = function()
        {
            //Запрос успешен
            callback( error__ajax, xhr.responseText );
            //Запрос успешен (конец)
        }
        xhr.onerror = function() {
            console.log("Ошибка отправки ajax запроса на форматтер кода");
            error__ajax = true;
            callback( error__ajax );
        }
        xhr.send( 'text='+encodeURIComponent(code)+'&type='+encodeURIComponent(type) );
    }
    catch(e) {
        console.log("Ошибка в отправлятеле ajax запросов");
        error__ajax = true;
        callback( error__ajax );
    }
}

/***********************************************/
//Для "twitter bootstrap 3"
/***********************************************/
$(document).ready(function(){
    $('body').on('click', ' .twitter-bootstrap-3 .btn-toggle-one-color', function(){
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
    
    $('body').on('change', ' .twitter-bootstrap-3 .btn-toggle-one-color input', function(){
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
