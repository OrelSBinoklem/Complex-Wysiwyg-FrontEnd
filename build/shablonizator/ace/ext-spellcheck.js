define("ace/ext/spellcheck",["require","exports","module","ace/lib/event","ace/editor","ace/config"],function(e,t,n){var i=e("../lib/event");t.contextMenuHandler=function(e){var t=e.target,n=t.textInput.getElement();if(t.selection.isEmpty()){var s=t.getCursorPosition(),o=t.session.getWordRange(s.row,s.column),r=t.session.getTextRange(o);if(t.session.tokenRe.lastIndex=0,t.session.tokenRe.test(r)){var l="",c=r+" "+l;n.value=c,n.setSelectionRange(r.length+1,r.length+1),n.setSelectionRange(0,0);var a=!1;i.addListener(n,"keydown",function e(){i.removeListener(n,"keydown",e),a=!0}),t.textInput.setInputHandler(function(e){if(console.log(e,c,n.selectionStart,n.selectionEnd),e==c)return"";if(0===e.lastIndexOf(c,0))return e.slice(c.length);if(e.substr(n.selectionEnd)==c)return e.slice(0,-c.length);if(e.slice(-2)==l){var i=e.slice(0,-2);if(" "==i.slice(-1))return a?i.substring(0,n.selectionEnd):(i=i.slice(0,-1),t.session.replace(o,i),"")}return e})}}};var s=e("../editor").Editor;e("../config").defineOptions(s.prototype,"editor",{spellcheck:{set:function(e){var n=this.textInput.getElement();n.spellcheck=!!e,e?this.on("nativecontextmenu",t.contextMenuHandler):this.removeListener("nativecontextmenu",t.contextMenuHandler)},value:!0}})});