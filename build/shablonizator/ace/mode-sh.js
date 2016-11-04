define("ace/mode/sh",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/sh_highlight_rules","ace/range"],function(e,t,n){var r=e("../lib/oop"),i=e("./text").Mode,o=e("../tokenizer").Tokenizer,s=e("./sh_highlight_rules").ShHighlightRules,a=e("../range").Range,l=function(){var e=new s;this.$tokenizer=new o(e.getRules()),this.$keywordList=e.$keywordList};r.inherits(l,i),function(){this.lineCommentStart="#",this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=this.$tokenizer.getLineTokens(t,e),o=i.tokens;if(o.length&&"comment"==o[o.length-1].type)return r;if("start"==e){var s=t.match(/^.*[\{\(\[\:]\s*$/);s&&(r+=n)}return r};var e={pass:1,return:1,raise:1,break:1,continue:1};this.checkOutdent=function(t,n,r){if("\r\n"!==r&&"\r"!==r&&"\n"!==r)return!1;var i=this.$tokenizer.getLineTokens(n.trim(),t).tokens;if(!i)return!1;do var o=i.pop();while(o&&("comment"==o.type||"text"==o.type&&o.value.match(/^\s+$/)));return!!o&&("keyword"==o.type&&e[o.value])},this.autoOutdent=function(e,t,n){n+=1;var r=this.$getIndent(t.getLine(n)),i=t.getTabString();r.slice(-i.length)==i&&t.remove(new a(n,r.length-i.length,n,r.length))}}.call(l.prototype),t.Mode=l}),define("ace/mode/sh_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,o=t.reservedKeywords="!|{|}|case|do|done|elif|else|esac|fi|for|if|in|then|until|while|&|;|export|local|read|typeset|unset|elif|select|set",s=t.languageConstructs="[|]|alias|bg|bind|break|builtin|cd|command|compgen|complete|continue|dirs|disown|echo|enable|eval|exec|exit|fc|fg|getopts|hash|help|history|jobs|kill|let|logout|popd|printf|pushd|pwd|return|set|shift|shopt|source|suspend|test|times|trap|type|ulimit|umask|unalias|wait",a=function(){var e=this.createKeywordMapper({keyword:o,"support.function.builtin":s,"invalid.deprecated":"debugger"},"identifier"),t="(?:(?:[1-9]\\d*)|(?:0))",n="(?:\\.\\d+)",r="(?:\\d+)",i="(?:(?:"+r+"?"+n+")|(?:"+r+"\\.))",a="(?:(?:"+i+"|"+r+"))",l="(?:"+a+"|"+i+")",g="(?:&"+r+")",u="[a-zA-Z][a-zA-Z0-9_]*",h="(?:(?:\\$"+u+")|(?:"+u+"=))",c="(?:\\$(?:SHLVL|\\$|\\!|\\?))",d="(?:"+u+"\\s*\\(\\))";this.$rules={start:[{token:"constant",regex:/\\./},{token:["text","comment"],regex:/(^|\s)(#.*)$/},{token:"string",regex:'"',push:[{token:"constant.language.escape",regex:/\\(?:[$abeEfnrtv\\'"]|x[a-fA-F\d]{1,2}|u[a-fA-F\d]{4}([a-fA-F\d]{4})?|c.|\d{1,3})/},{token:"constant",regex:/\$\w+/},{token:"string",regex:'"',next:"pop"},{defaultToken:"string"}]},{token:"variable.language",regex:c},{token:"variable",regex:h},{token:"support.function",regex:d},{token:"support.function",regex:g},{token:"string",start:"'",end:"'"},{token:"constant.numeric",regex:l},{token:"constant.numeric",regex:t+"\\b"},{token:e,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|~|<|>|<=|=>|=|!="},{token:"paren.lparen",regex:"[\\[\\(\\{]"},{token:"paren.rparen",regex:"[\\]\\)\\}]"}]},this.normalizeRules()};r.inherits(a,i),t.ShHighlightRules=a});