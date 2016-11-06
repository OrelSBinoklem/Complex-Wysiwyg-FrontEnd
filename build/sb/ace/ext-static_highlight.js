define("ace/ext/static_highlight",["require","exports","module","ace/edit_session","ace/layer/text","ace/config"],function(e,t,n){var i=e("../edit_session").EditSession,s=e("../layer/text").Text,o=".ace_static_highlight {font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'Droid Sans Mono', monospace;font-size: 12px;}.ace_static_highlight .ace_gutter {width: 25px !important;display: block;float: left;text-align: right;padding: 0 3px 0 0;margin-right: 3px;position: static !important;}.ace_static_highlight .ace_line { clear: both; }.ace_static_highlight .ace_gutter-cell {-moz-user-select: -moz-none;-khtml-user-select: none;-webkit-user-select: none;user-select: none;}",a=e("../config");t.render=function(e,n,s,o,c,r){function l(){var i=t.renderSync(e,n,s,o,c);return r?r(i):i}var d=0,h=i.prototype.$modes;return"string"==typeof s&&(d++,a.loadModule(["theme",s],function(e){s=e,--d||l()})),"string"==typeof n&&(d++,a.loadModule(["mode",n],function(e){h[n]||(h[n]=new e.Mode),n=h[n],--d||l()})),d||l()},t.renderSync=function(e,t,n,a,c){a=parseInt(a||1,10);var r=new i("");r.setUseWorker(!1),r.setMode(t);var l=new s(document.createElement("div"));l.setSession(r),l.config={characterWidth:10,lineHeight:20},r.setValue(e);for(var d=[],h=r.getLength(),u=0;u<h;u++)d.push("<div class='ace_line'>"),c||d.push("<span class='ace_gutter ace_gutter-cell' unselectable='on'>"+(u+a)+"</span>"),l.$renderLine(d,u,!0,!1),d.push("</div>");var g="<div class='"+n.cssClass+"'><div class='ace_static_highlight'>"+d.join("")+"</div></div>";return l.destroy(),{css:o+n.cssText,html:g}}});