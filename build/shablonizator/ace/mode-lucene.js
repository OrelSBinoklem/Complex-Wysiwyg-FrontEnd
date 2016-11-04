define("ace/mode/lucene",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/lucene_highlight_rules"],function(e,t,r){var n=e("../lib/oop"),o=e("./text").Mode,i=e("../tokenizer").Tokenizer,a=e("./lucene_highlight_rules").LuceneHighlightRules,l=function(){this.$tokenizer=new i((new a).getRules())};n.inherits(l,o),t.Mode=l}),define("ace/mode/lucene_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"],function(e,t,r){var n=e("../lib/oop"),o=(e("../lib/lang"),e("./text_highlight_rules").TextHighlightRules),i=function(){this.$rules={start:[{token:"constant.character.negation",regex:"[\\-]"},{token:"constant.character.interro",regex:"[\\?]"},{token:"constant.character.asterisk",regex:"[\\*]"},{token:"constant.character.proximity",regex:"~[0-9]+\\b"},{token:"keyword.operator",regex:"(?:AND|OR|NOT)\\b"},{token:"paren.lparen",regex:"[\\(]"},{token:"paren.rparen",regex:"[\\)]"},{token:"keyword",regex:"[\\S]+:"},{token:"string",regex:'".*?"'},{token:"text",regex:"\\s+"}]}};n.inherits(i,o),t.LuceneHighlightRules=i});