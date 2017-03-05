var modules={},pageManagerVisualizator,pixelPerfect;!function(r){jQuery.fn.multiFind=function(r){if("string"==typeof r){var e,t=r.split(",");for(var l in t){var n=t[l];0==l?e=this.find(" "+n):e.add(this.find(" "+n))}return e}return this}}(jQuery);var shablonizator={};shablonizator.base_url_page="",shablonizator.base_url_page_full="";var str=function(){};str.parsingUrl=function(r,e){var t=r+"::"+(void 0===e?"undefined":e);if(t in str.parsingUrl._cache)return str.parsingUrl._cache[t];var l=/^([^\?#]*)(\?[^\?#]*)?(#[^\?#]*)?$/.exec(r),n="",a=l[2]||null;a=null!==a?a.substring(1):null,null!==a?(n="?"+a,a=a.split("&"),a=a.map(function(r){return r=r.split("="),{name:r[0],value:r[1]}})):a=new Array;var s=l[3]||null;s=null!==s?s.substring(1):null,l=l[1];var i,o,u=/^(https?:\/\/|\/)/.exec(l);if(null!==u)if(/^http/.test(u[1]))l=l.substring(u[1].length),u=u[1].substr(0,u[1].length-2),i="absolute",o=2;else{if(!/^\//.test(u[1]))throw new Error("Неудалось определить тип url:"+r);l=l.substring(u[1].length),u=null,i="local",o=1}else u=null,i="relative",o=0;var c=null,h=null;if("absolute"==i){if(h=/^(([\w\-\.\~]+)(\:(\d{1,6}))?)/i.exec(l),null===h)throw new Error("Неудалось выделить домен:"+r);l=l.substring(h[1].length),l=l.replace(/^\//,""),c=h[4]||null,c=null!==c?parseInt(c):null,h=h[2]}void 0===e&&(e=/\.[\w]{1,16}$/i.test(l));var p=null,d=new Array,f="",b="";if("relative"==i){p=0;var g=/^((\.\.\/)*)/.exec(l);null!==g&&(l=l.substring(g[1].length),p=Math.round(g[1].length/3))}if(e){var d=l.split("/"),v=/^([\w\-\.\~ %]*)\.([\w]+)$/i.exec(d[d.length-1]);if(null===v)throw new Error("Неудалось определить имя файла:"+r);f=v[1],b=v[2],d.splice(d.length-1,1)}else l=l.replace(/\/$/,""),d=l.split("/"),0!=d.length&&""!=d[0]||(d=new Array);var m={type:i,typePriority:o,protocol:u,domain:h,port:c,numberOfFoldersUp:p,arrFolders:d,fileName:f,fileExtension:b,fileNameFull:""!=f||""!=b?f+"."+b:"",paramsStr:n,paramsObj:a,hash:s};if(Object.keys(str.parsingUrl._cache).length>=str.parsingUrl.cacheLimit)for(var y in str.parsingUrl._cache)if(delete str.parsingUrl._cache[y],Object.keys(str.parsingUrl._cache).length<str.parsingUrl.cacheLimit)break;return str.parsingUrl._cache[t]=m,m},str.parsingUrl.cacheLimit=100,str.parsingUrl._cache={},str.intermediateUrl=function(r,e,t,l){var n=str.parsingUrl(e,l);if("absolute"==n.type)return e;var a=str.parsingUrl(r,t);if("local"==n.type)return"absolute"==a.type?a.protocol+"//"+a.domain+(null!==a.port?a.port:"")+e:e;if("relative"==n.type){var s="";switch(a.type){case"relative":var i=0,o=new Array;a.arrFolders.length<n.numberOfFoldersUp?i=n.numberOfFoldersUp-a.arrFolders.length:o=a.arrFolders.slice(0,a.arrFolders.length-n.numberOfFoldersUp),i+=a.numberOfFoldersUp,o=o.concat(n.arrFolders),s+=new Array(i+1).join("../")+(o.length?o.join("/"):"");break;case"local":if(a.arrFolders.length<n.numberOfFoldersUp)throw new Error("Папок в url 1:"+r+": Меньше чем возвратов в url 2:"+e);var o=a.arrFolders.slice(0,a.arrFolders.length-n.numberOfFoldersUp);o=o.concat(n.arrFolders),s+="/"+(o.length?o.join("/"):"");break;case"absolute":if(a.arrFolders.length<n.numberOfFoldersUp)throw new Error("Папок в url 1:"+r+": Меньше чем возвратов в url 2:"+e);var o=a.arrFolders.slice(0,a.arrFolders.length-n.numberOfFoldersUp);o=o.concat(n.arrFolders),s+=a.protocol+"//"+a.domain+(null!==a.port?a.port:"")+o.reduce(function(r,e){return r+"/"+e},"")}return/\/$/.test(s)||""==s||(s+="/"),s+=n.fileNameFull+n.paramsStr+(null!==n.hash?"#"+n.hash:""),"relative"==a.type&&"relative"==n.type&&"/"==s&&(s=""),s}},str.relativeUrlFrom2Absolute=function(r,e,t,l){var n="",a=str.parsingUrl(r,t),s=str.parsingUrl(e,l);if("absolute"==a.type&&"absolute"==s.type){if(a.protocol+"//"+a.domain+(null!==a.port?a.port:"")==s.protocol+"//"+s.domain+(null!==s.port?s.port:"")){for(var i=[].concat(a.arrFolders),o=[].concat(s.arrFolders);i.length&&o.length&&i[0]==o[0];)i.shift(),o.shift();return n+=new Array(i.length+1).join("../")+(o.length?o.join("/"):""),/\/$/.test(n)||""==n||(n+="/"),n+=s.fileNameFull+s.paramsStr+(null!==s.hash?"#"+s.hash:""),"relative"==a.type&&"relative"==s.type&&"/"==n&&(n=""),n}return"error:domains_do_not_match"}throw new Error("Один из url'ов не являеться абсолютным:"+r+":url 2:"+e)},$(document).ready(function(){$("body").on("click"," .btn-toggle-one-color",function(){$(this).find(" .btn").removeClass("btn-default btn-primary btn-success btn-info btn-warning btn-danger btn-link").each(function(){$(this).hasClass("active")?$(this).addClass("btn-"+$(this).attr("data-btn-color")):$(this).addClass("btn-default")})}),$("body").on("change"," .btn-toggle-one-color input",function(){var r=$(this).closest(".btn-toggle-one-color").first();r.size()&&r.find(" .btn").removeClass("btn-default btn-primary btn-success btn-info btn-warning btn-danger btn-link").each(function(){$(this).find(" input").prop("checked")?$(this).addClass("btn-"+$(this).attr("data-btn-color")):$(this).addClass("btn-default")})})});
//# sourceMappingURL=global.js.map