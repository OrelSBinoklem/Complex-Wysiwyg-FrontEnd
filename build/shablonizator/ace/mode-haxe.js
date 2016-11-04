define("ace/mode/haxe",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/haxe_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(e,t,n){var o=e("../lib/oop"),r=e("./text").Mode,i=e("../tokenizer").Tokenizer,s=e("./haxe_highlight_rules").HaxeHighlightRules,a=e("./matching_brace_outdent").MatchingBraceOutdent,u=e("./behaviour/cstyle").CstyleBehaviour,c=e("./folding/cstyle").FoldMode,l=function(){var e=new s;this.$tokenizer=new i(e.getRules()),this.$outdent=new a,this.$behaviour=new u,this.$keywordList=e.$keywordList,this.foldingRules=new c};o.inherits(l,r),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(e,t,n){var o=this.$getIndent(t),r=this.$tokenizer.getLineTokens(t,e),i=r.tokens;if(i.length&&"comment"==i[i.length-1].type)return o;if("start"==e){var s=t.match(/^.*[\{\(\[]\s*$/);s&&(o+=n)}return o},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)}}.call(l.prototype),t.Mode=l}),define("ace/mode/haxe_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],function(e,t,n){var o=e("../lib/oop"),r=e("./doc_comment_highlight_rules").DocCommentHighlightRules,i=e("./text_highlight_rules").TextHighlightRules,s=function(){var e="break|case|cast|catch|class|continue|default|else|enum|extends|for|function|if|implements|import|in|inline|interface|new|override|package|private|public|return|static|super|switch|this|throw|trace|try|typedef|untyped|var|while|Array|Void|Bool|Int|UInt|Float|Dynamic|String|List|Hash|IntHash|Error|Unknown|Type|Std",t="null|true|false",n=this.createKeywordMapper({"variable.language":"this",keyword:e,"constant.language":t},"identifier");this.$rules={start:[{token:"comment",regex:"\\/\\/.*$"},r.getStartRule("doc-start"),{token:"comment",regex:"\\/\\*",next:"comment"},{token:"string.regexp",regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:n,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"},{token:"punctuation.operator",regex:"\\?|\\:|\\,|\\;|\\."},{token:"paren.lparen",regex:"[[({<]"},{token:"paren.rparen",regex:"[\\])}>]"},{token:"text",regex:"\\s+"}],comment:[{token:"comment",regex:".*?\\*\\/",next:"start"},{token:"comment",regex:".+"}]},this.embedRules(r,"doc-",[r.getEndRule("start")])};o.inherits(s,i),t.HaxeHighlightRules=s}),define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){var o=e("../lib/oop"),r=e("./text_highlight_rules").TextHighlightRules,i=function(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},{token:"comment.doc.tag",regex:"\\bTODO\\b"},{defaultToken:"comment.doc"}]}};o.inherits(i,r),i.getStartRule=function(e){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:e}},i.getEndRule=function(e){return{token:"comment.doc",regex:"\\*\\/",next:e}},t.DocCommentHighlightRules=i}),define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){var o=e("../range").Range,r=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t),r=n.match(/^(\s*\})/);if(!r)return 0;var i=r[1].length,s=e.findMatchingBracket({row:t,column:i});if(!s||s.row==t)return 0;var a=this.$getIndent(e.getLine(s.row));e.replace(new o(t,0,t,i-1),a)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(r.prototype),t.MatchingBraceOutdent=r}),define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"],function(e,t,n){var o=e("../../lib/oop"),r=e("../behaviour").Behaviour,i=e("../../token_iterator").TokenIterator,s=e("../../lib/lang"),a=["text","paren.rparen","punctuation.operator"],u=["text","paren.rparen","punctuation.operator","comment"],c=0,l=-1,g="",d=0,h=-1,m="",f="",p=function(){p.isSaneInsertion=function(e,t){var n=e.getCursorPosition(),o=new i(t,n.row,n.column);if(!this.$matchTokenType(o.getCurrentToken()||"text",a)){var r=new i(t,n.row,n.column+1);if(!this.$matchTokenType(r.getCurrentToken()||"text",a))return!1}return o.stepForward(),o.getCurrentTokenRow()!==n.row||this.$matchTokenType(o.getCurrentToken()||"text",u)},p.$matchTokenType=function(e,t){return t.indexOf(e.type||e)>-1},p.recordAutoInsert=function(e,t,n){var o=e.getCursorPosition(),r=t.doc.getLine(o.row);this.isAutoInsertedClosing(o,r,g[0])||(c=0),l=o.row,g=n+r.substr(o.column),c++},p.recordMaybeInsert=function(e,t,n){var o=e.getCursorPosition(),r=t.doc.getLine(o.row);this.isMaybeInsertedClosing(o,r)||(d=0),h=o.row,m=r.substr(0,o.column)+n,f=r.substr(o.column),d++},p.isAutoInsertedClosing=function(e,t,n){return c>0&&e.row===l&&n===g[0]&&t.substr(e.column)===g},p.isMaybeInsertedClosing=function(e,t){return d>0&&e.row===h&&t.substr(e.column)===f&&t.substr(0,e.column)==m},p.popAutoInsertedClosing=function(){g=g.substr(1),c--},p.clearMaybeInsertedClosing=function(){d=0,h=-1},this.add("braces","insertion",function(e,t,n,o,r){var i=n.getCursorPosition(),a=o.doc.getLine(i.row);if("{"==r){var u=n.getSelectionRange(),c=o.doc.getTextRange(u);if(""!==c&&"{"!==c&&n.getWrapBehavioursEnabled())return{text:"{"+c+"}",selection:!1};if(p.isSaneInsertion(n,o))return/[\]\}\)]/.test(a[i.column])?(p.recordAutoInsert(n,o,"}"),{text:"{}",selection:[1,1]}):(p.recordMaybeInsert(n,o,"{"),{text:"{",selection:[1,1]})}else if("}"==r){var l=a.substring(i.column,i.column+1);if("}"==l){var g=o.$findOpeningBracket("}",{column:i.column+1,row:i.row});if(null!==g&&p.isAutoInsertedClosing(i,a,r))return p.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}else if("\n"==r||"\r\n"==r){var h="";p.isMaybeInsertedClosing(i,a)&&(h=s.stringRepeat("}",d),p.clearMaybeInsertedClosing());var l=a.substring(i.column,i.column+1);if("}"==l||""!==h){var m=o.findMatchingBracket({row:i.row,column:i.column},"}");if(!m)return null;var f=this.getNextLineIndent(e,a.substring(0,i.column),o.getTabString()),x=this.$getIndent(a);return{text:"\n"+f+"\n"+x+h,selection:[1,f.length,1,f.length]}}}}),this.add("braces","deletion",function(e,t,n,o,r){var i=o.doc.getTextRange(r);if(!r.isMultiLine()&&"{"==i){var s=o.doc.getLine(r.start.row),a=s.substring(r.end.column,r.end.column+1);if("}"==a)return r.end.column++,r;d--}}),this.add("parens","insertion",function(e,t,n,o,r){if("("==r){var i=n.getSelectionRange(),s=o.doc.getTextRange(i);if(""!==s&&n.getWrapBehavioursEnabled())return{text:"("+s+")",selection:!1};if(p.isSaneInsertion(n,o))return p.recordAutoInsert(n,o,")"),{text:"()",selection:[1,1]}}else if(")"==r){var a=n.getCursorPosition(),u=o.doc.getLine(a.row),c=u.substring(a.column,a.column+1);if(")"==c){var l=o.$findOpeningBracket(")",{column:a.column+1,row:a.row});if(null!==l&&p.isAutoInsertedClosing(a,u,r))return p.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}}),this.add("parens","deletion",function(e,t,n,o,r){var i=o.doc.getTextRange(r);if(!r.isMultiLine()&&"("==i){var s=o.doc.getLine(r.start.row),a=s.substring(r.start.column+1,r.start.column+2);if(")"==a)return r.end.column++,r}}),this.add("brackets","insertion",function(e,t,n,o,r){if("["==r){var i=n.getSelectionRange(),s=o.doc.getTextRange(i);if(""!==s&&n.getWrapBehavioursEnabled())return{text:"["+s+"]",selection:!1};if(p.isSaneInsertion(n,o))return p.recordAutoInsert(n,o,"]"),{text:"[]",selection:[1,1]}}else if("]"==r){var a=n.getCursorPosition(),u=o.doc.getLine(a.row),c=u.substring(a.column,a.column+1);if("]"==c){var l=o.$findOpeningBracket("]",{column:a.column+1,row:a.row});if(null!==l&&p.isAutoInsertedClosing(a,u,r))return p.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}}),this.add("brackets","deletion",function(e,t,n,o,r){var i=o.doc.getTextRange(r);if(!r.isMultiLine()&&"["==i){var s=o.doc.getLine(r.start.row),a=s.substring(r.start.column+1,r.start.column+2);if("]"==a)return r.end.column++,r}}),this.add("string_dquotes","insertion",function(e,t,n,o,r){if('"'==r||"'"==r){var i=r,s=n.getSelectionRange(),a=o.doc.getTextRange(s);if(""!==a&&"'"!==a&&'"'!=a&&n.getWrapBehavioursEnabled())return{text:i+a+i,selection:!1};var u=n.getCursorPosition(),c=o.doc.getLine(u.row),l=c.substring(u.column-1,u.column);if("\\"==l)return null;for(var g,d=o.getTokens(s.start.row),h=0,m=-1,f=0;f<d.length&&(g=d[f],"string"==g.type?m=-1:m<0&&(m=g.value.indexOf(i)),!(g.value.length+h>s.start.column));f++)h+=d[f].value.length;if(!g||m<0&&"comment"!==g.type&&("string"!==g.type||s.start.column!==g.value.length+h-1&&g.value.lastIndexOf(i)===g.value.length-1)){if(!p.isSaneInsertion(n,o))return;return{text:i+i,selection:[1,1]}}if(g&&"string"===g.type){var x=c.substring(u.column,u.column+1);if(x==i)return{text:"",selection:[1,1]}}}}),this.add("string_dquotes","deletion",function(e,t,n,o,r){var i=o.doc.getTextRange(r);if(!r.isMultiLine()&&('"'==i||"'"==i)){var s=o.doc.getLine(r.start.row),a=s.substring(r.start.column+1,r.start.column+2);if(a==i)return r.end.column++,r}})};o.inherits(p,r),t.CstyleBehaviour=p}),define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,n){var o=e("../../lib/oop"),r=(e("../../range").Range,e("./fold_mode").FoldMode),i=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};o.inherits(i,r),function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,this.getFoldWidgetRange=function(e,t,n){var o=e.getLine(n),r=o.match(this.foldingStartMarker);if(r){var i=r.index;return r[1]?this.openingBracketBlock(e,r[1],n,i):e.getCommentFoldRange(n,i+r[0].length,1)}if("markbeginend"===t){var r=o.match(this.foldingStopMarker);if(r){var i=r.index+r[0].length;return r[1]?this.closingBracketBlock(e,r[1],n,i):e.getCommentFoldRange(n,i,-1)}}}}.call(i.prototype)});