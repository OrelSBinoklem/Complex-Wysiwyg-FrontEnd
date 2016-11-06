define("ace/mode/pascal",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/pascal_highlight_rules","ace/mode/folding/coffee"],function(e,t,n){var o=e("../lib/oop"),i=e("./text").Mode,a=e("../tokenizer").Tokenizer,r=e("./pascal_highlight_rules").PascalHighlightRules,l=e("./folding/coffee").FoldMode,s=function(){var e=new r;this.foldingRules=new l,this.$tokenizer=new a(e.getRules())};o.inherits(s,i),function(){this.lineCommentStart=["--","//"],this.blockComment=[{start:"(*",end:"*)"},{start:"{",end:"}"}]}.call(s.prototype),t.Mode=s}),define("ace/mode/pascal_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){var o=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,a=function(){this.$rules={start:[{caseInsensitive:!0,token:"keyword.control.pascal",regex:"\\b(?:(absolute|abstract|all|and|and_then|array|as|asm|attribute|begin|bindable|case|class|const|constructor|destructor|div|do|do|else|end|except|export|exports|external|far|file|finalization|finally|for|forward|goto|if|implementation|import|in|inherited|initialization|interface|interrupt|is|label|library|mod|module|name|near|nil|not|object|of|only|operator|or|or_else|otherwise|packed|pow|private|program|property|protected|public|published|qualified|record|repeat|resident|restricted|segment|set|shl|shr|then|to|try|type|unit|until|uses|value|var|view|virtual|while|with|xor))\\b"},{caseInsensitive:!0,token:["variable.pascal","text","storage.type.prototype.pascal","entity.name.function.prototype.pascal"],regex:"\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?(?=(?:\\(.*?\\))?;\\s*(?:attribute|forward|external))"},{caseInsensitive:!0,token:["variable.pascal","text","storage.type.function.pascal","entity.name.function.pascal"],regex:"\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?"},{token:"constant.numeric.pascal",regex:"\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"},{token:"punctuation.definition.comment.pascal",regex:"--.*$",push_:[{token:"comment.line.double-dash.pascal.one",regex:"$",next:"pop"},{defaultToken:"comment.line.double-dash.pascal.one"}]},{token:"punctuation.definition.comment.pascal",regex:"//.*$",push_:[{token:"comment.line.double-slash.pascal.two",regex:"$",next:"pop"},{defaultToken:"comment.line.double-slash.pascal.two"}]},{token:"punctuation.definition.comment.pascal",regex:"\\(\\*",push:[{token:"punctuation.definition.comment.pascal",regex:"\\*\\)",next:"pop"},{defaultToken:"comment.block.pascal.one"}]},{token:"punctuation.definition.comment.pascal",regex:"\\{",push:[{token:"punctuation.definition.comment.pascal",regex:"\\}",next:"pop"},{defaultToken:"comment.block.pascal.two"}]},{token:"punctuation.definition.string.begin.pascal",regex:'"',push:[{token:"constant.character.escape.pascal",regex:"\\\\."},{token:"punctuation.definition.string.end.pascal",regex:'"',next:"pop"},{defaultToken:"string.quoted.double.pascal"}]},{token:"punctuation.definition.string.begin.pascal",regex:"'",push:[{token:"constant.character.escape.apostrophe.pascal",regex:"''"},{token:"punctuation.definition.string.end.pascal",regex:"'",next:"pop"},{defaultToken:"string.quoted.single.pascal"}]},{token:"keyword.operator",regex:"[+\\-;,/*%]|:=|="}]},this.normalizeRules()};o.inherits(a,i),t.PascalHighlightRules=a}),define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(e,t,n){var o=e("../../lib/oop"),i=e("./fold_mode").FoldMode,a=e("../../range").Range,r=t.FoldMode=function(){};o.inherits(r,i),function(){this.getFoldWidgetRange=function(e,t,n){var o=this.indentationBlock(e,n);if(o)return o;var i=/\S/,r=e.getLine(n),l=r.search(i);if(l!=-1&&"#"==r[l]){for(var s=r.length,c=e.getLength(),p=n,d=n;++n<c;){r=e.getLine(n);var u=r.search(i);if(u!=-1){if("#"!=r[u])break;d=n}}if(d>p){var g=e.getLine(d).length;return new a(p,s,d,g)}}},this.getFoldWidget=function(e,t,n){var o=e.getLine(n),i=o.search(/\S/),a=e.getLine(n+1),r=e.getLine(n-1),l=r.search(/\S/),s=a.search(/\S/);if(i==-1)return e.foldWidgets[n-1]=l!=-1&&l<s?"start":"","";if(l==-1){if(i==s&&"#"==o[i]&&"#"==a[i])return e.foldWidgets[n-1]="",e.foldWidgets[n+1]="","start"}else if(l==i&&"#"==o[i]&&"#"==r[i]&&e.getLine(n-2).search(/\S/)==-1)return e.foldWidgets[n-1]="start",e.foldWidgets[n+1]="","";return l!=-1&&l<i?e.foldWidgets[n-1]="start":e.foldWidgets[n-1]="",i<s?"start":""}}.call(r.prototype)});