define("ace/mode/plain_text",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/text_highlight_rules","ace/mode/behaviour"],function(e,t,i){var o=e("../lib/oop"),n=e("./text").Mode,r=e("../tokenizer").Tokenizer,h=e("./text_highlight_rules").TextHighlightRules,u=e("./behaviour").Behaviour,a=function(){this.$tokenizer=new r((new h).getRules()),this.$behaviour=new u};o.inherits(a,n),function(){this.getNextLineIndent=function(e,t,i){return""}}.call(a.prototype),t.Mode=a});