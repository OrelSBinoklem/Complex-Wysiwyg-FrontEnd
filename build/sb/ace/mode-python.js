define("ace/mode/python",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/python_highlight_rules","ace/mode/folding/pythonic","ace/range"],function(e,t,n){var r=e("../lib/oop"),i=e("./text").Mode,o=e("../tokenizer").Tokenizer,a=e("./python_highlight_rules").PythonHighlightRules,s=e("./folding/pythonic").FoldMode,g=e("../range").Range,l=function(){var e=new a;this.$tokenizer=new o(e.getRules()),this.$keywordList=e.$keywordList,this.foldingRules=new s("\\:")};r.inherits(l,i),function(){this.lineCommentStart="#",this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=this.$tokenizer.getLineTokens(t,e),o=i.tokens;if(o.length&&"comment"==o[o.length-1].type)return r;if("start"==e){var a=t.match(/^.*[\{\(\[\:]\s*$/);a&&(r+=n)}return r};var e={pass:1,return:1,raise:1,break:1,continue:1};this.checkOutdent=function(t,n,r){if("\r\n"!==r&&"\r"!==r&&"\n"!==r)return!1;var i=this.$tokenizer.getLineTokens(n.trim(),t).tokens;if(!i)return!1;do var o=i.pop();while(o&&("comment"==o.type||"text"==o.type&&o.value.match(/^\s+$/)));return!!o&&("keyword"==o.type&&e[o.value])},this.autoOutdent=function(e,t,n){n+=1;var r=this.$getIndent(t.getLine(n)),i=t.getTabString();r.slice(-i.length)==i&&t.remove(new g(n,r.length-i.length,n,r.length))}}.call(l.prototype),t.Mode=l}),define("ace/mode/python_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,o=function(){var e="and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield",t="True|False|None|NotImplemented|Ellipsis|__debug__",n="abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|binfile|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|set|apply|delattr|help|next|setattr|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern",r=this.createKeywordMapper({"invalid.deprecated":"debugger","support.function":n,"constant.language":t,keyword:e},"identifier"),i="(?:r|u|ur|R|U|UR|Ur|uR)?",o="(?:(?:[1-9]\\d*)|(?:0))",a="(?:0[oO]?[0-7]+)",s="(?:0[xX][\\dA-Fa-f]+)",g="(?:0[bB][01]+)",l="(?:"+o+"|"+a+"|"+s+"|"+g+")",c="(?:[eE][+-]?\\d+)",d="(?:\\.\\d+)",u="(?:\\d+)",h="(?:(?:"+u+"?"+d+")|(?:"+u+"\\.))",p="(?:(?:"+h+"|"+u+")"+c+")",x="(?:"+p+"|"+h+")",f="\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";this.$rules={start:[{token:"comment",regex:"#.*$"},{token:"string",regex:i+'"{3}',next:"qqstring3"},{token:"string",regex:i+'"(?=.)',next:"qqstring"},{token:"string",regex:i+"'{3}",next:"qstring3"},{token:"string",regex:i+"'(?=.)",next:"qstring"},{token:"constant.numeric",regex:"(?:"+x+"|\\d+)[jJ]\\b"},{token:"constant.numeric",regex:x},{token:"constant.numeric",regex:l+"[lL]\\b"},{token:"constant.numeric",regex:l+"\\b"},{token:r,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="},{token:"paren.lparen",regex:"[\\[\\(\\{]"},{token:"paren.rparen",regex:"[\\]\\)\\}]"},{token:"text",regex:"\\s+"}],qqstring3:[{token:"constant.language.escape",regex:f},{token:"string",regex:'"{3}',next:"start"},{defaultToken:"string"}],qstring3:[{token:"constant.language.escape",regex:f},{token:"string",regex:"'{3}",next:"start"},{defaultToken:"string"}],qqstring:[{token:"constant.language.escape",regex:f},{token:"string",regex:"\\\\$",next:"qqstring"},{token:"string",regex:'"|$',next:"start"},{defaultToken:"string"}],qstring:[{token:"constant.language.escape",regex:f},{token:"string",regex:"\\\\$",next:"qstring"},{token:"string",regex:"'|$",next:"start"},{defaultToken:"string"}]}};r.inherits(o,i),t.PythonHighlightRules=o}),define("ace/mode/folding/pythonic",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode"],function(e,t,n){var r=e("../../lib/oop"),i=e("./fold_mode").FoldMode,o=t.FoldMode=function(e){this.foldingStartMarker=new RegExp("([\\[{])(?:\\s*)$|("+e+")(?:\\s*)(?:#.*)?$")};r.inherits(o,i),function(){this.getFoldWidgetRange=function(e,t,n){var r=e.getLine(n),i=r.match(this.foldingStartMarker);if(i)return i[1]?this.openingBracketBlock(e,i[1],n,i.index):i[2]?this.indentationBlock(e,n,i.index+i[2].length):this.indentationBlock(e,n)}}.call(o.prototype)});