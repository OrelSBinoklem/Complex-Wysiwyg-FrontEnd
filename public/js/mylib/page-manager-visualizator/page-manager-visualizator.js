!function(e){var t=function(t,i,a){this._options=a;var o=this;o.$container=t;var s=new modules.customScrollIFrame(t,this._options),n=new modules.mapNavigatorIFrame(a.$mapNavigatorContainer,this._options),r=new modules.resizeIFrame(t,this._options),p=new modules.fixationContentAtResize(t,this._options);s._initPasteHTML(),t.on("pmv.load.iframe",function(){s.reload()}),t.on("pmv.load.iframe",n.reload),t.on("pmv.load.iframe",r.reload),t.on({"pmv.load.iframe":p.reload,"rif.start.resize":p.startFixation,"rif.stop.resize":p.stopFixation}),this._create=function(){this._init(),t.on("wheel",s._handlerMouseWheel)},this._destroy=function(){t.off("wheel",s._handlerMouseWheel),o._saveSession(),t.find(".pmv-outer-wrap").remove()},this._init=function(){},this.addPage=function(e){if(e in o._options.pageList){if(!o._options.pageList[e].active){for(var i in o._options.pageList)o._options.pageList[i].active=!1;o._options.pageList[e].active=!0,o.currentPage=e,t.trigger("pmv.change.pagelist"),o.selectPage(e)}}else{for(var i in o._options.pageList)o._options.pageList[i].active=!1;o._options.pageList[e]={active:!0},o.currentPage=e,t.trigger("pmv.change.pagelist"),o.selectPage(e)}},this.removePage=function(e){var i=!1;if(e in o._options.pageList){if(o._options.pageList[e].active){delete o._options.pageList[e];for(var a in o._options.pageList){o._options.pageList[a].active=!0,i=a,o.currentPage=e;break}t.trigger("pmv.change.pagelist"),o._destroyIFrame()}else delete o._options.pageList[e],t.trigger("pmv.change.pagelist"),o._saveSession();i!==!1&&o._createIFrame(i)}},this.reloadPage=function(){for(var e in o._options.pageList)if(o._options.pageList[e].active){o.selectPage(e);break}},this.selectPage=function(e){var i=!1;for(var a in o._options.pageList)e==a?(o._options.pageList[a].active===!1&&(i=!0),o._options.pageList[a].active=!0):o._options.pageList[a].active=!1;i&&(o.currentPage=e,t.trigger("pmv.change.pagelist")),o._destroyIFrame(),o._createIFrame(e)},this._createIFrame=function(i){t.trigger("pmv.prepaste.iframe"),o.lastLoadPage=i,o.currentPage=i,t.find(".pmv-fitting-wrap").append('<iframe id="'+o._options.nameIFrame+'" name="'+o._options.nameIFrame+'" src="'+i+'" width="100%" height="100%"></iframe>'),e("#"+o._options.nameIFrame).load(function(){t.trigger("pmv.load.iframe"),e("#"+o._options.nameIFrame).contents().find("body").on("click",function(t){e("body").trigger("click.body.iframe")})})},this._destroyIFrame=function(){o._saveSession(),e("#"+o._options.nameIFrame).remove()},this._restoreSession=function(t){switch("$session"in o||o.$session.find("pages page").each(function(){o._options.pageList[e(this).attr("href")]={active:"true"==e(this).attr("active")}}),t){case"pagelist":for(var i in o._options.pageList)if(o._options.pageList[i].active){o.selectPage(i);break}break;case"scroll_iframe":var a,s,n=window[o._options.nameIFrame],r=o.$session.find(" page[href='"+o.lastLoadPage+"'][scrolltop][scrollleft]");r.size()&&o.lastLoadPage in o._options.pageList&&(a=parseInt(r.attr("scrolltop")),s=parseInt(r.attr("scrollleft")),e(n.window).scrollTop(a),e(n.window).scrollLeft(s));break;case"position_iframe":var p,g,n=window[o._options.nameIFrame],c=e("#"+o._options.nameIFrame),l=c.closest(".pmv-fitting-wrap"),r=o.$session.find(" page[href='"+o.lastLoadPage+"'][l][t]");r.size()&&o.lastLoadPage in o._options.pageList&&(g=parseInt(r.attr("l")),p=parseInt(r.attr("t")),l.css({left:g,top:p}));break;case"size_iframe":var f,m,n=window[o._options.nameIFrame],c=e("#"+o._options.nameIFrame),l=c.closest(".pmv-fitting-wrap"),r=o.$session.find(" page[href='"+o.lastLoadPage+"'][w][h]");r.size()&&(f=parseInt(r.attr("w")),m=parseInt(r.attr("h")),l.css({width:f,height:m}))}},this._saveSession=function(){if("$session"in o){var t,i=o.$session.find(" pages");for(var a in o._options.pageList){var s=o._options.pageList[a],n=i.find("page[href='"+a+"']");if(n.size())n.attr("active",s.active);else if(t){var n=i.find("page[href='"+t+"']");n.after('<page href="'+a+'" active="'+s.active+'" />')}else i.append('<page href="'+a+'" active="'+s.active+'" />');t=a}if(i.find(" page").each(function(){e(this).attr("href")in o._options.pageList||e(this).remove()}),o._options.nameIFrame in window){var r=o.$session.find("pages page[href='"+o.lastLoadPage+"']");if(r.size()){var p=window[o._options.nameIFrame],g=e("#"+o._options.nameIFrame),c=g.closest(".pmv-fitting-wrap");r.attr("scrolltop",Math.round(e(p.window).scrollTop()||0)).attr("scrollleft",Math.round(e(p.window).scrollLeft()||0)).attr("l",Math.round(c.position().left)).attr("t",Math.round(c.position().top)).attr("w",Math.round(c.width())).attr("h",Math.round(c.height()))}}var l=o.$session.xml().join("");e.ajax({url:"sb.php",async:!0,cache:!1,type:"POST",data:{module:"setfile",dir:o._options.urlXML,file_text:l,text_encoding:"UTF-8"}})}},this._restoreSessionFromSubModules=function(){r._restoreSession(),s._restoreSession(),n._restoreSession(),r._centerIFrameAndNoEmptySpace()}};modules.pageManagerVisualizator=t}(jQuery);
//# sourceMappingURL=page-manager-visualizator.js.map
