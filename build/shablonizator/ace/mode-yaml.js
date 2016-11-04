define("ace/mode/yaml",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/yaml_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/folding/coffee"],function(e,t,n){var r=e("../lib/oop"),o=e("./text").Mode,i=e("../tokenizer").Tokenizer,a=e("./yaml_highlight_rules").YamlHighlightRules,g=e("./matching_brace_outdent").MatchingBraceOutdent,s=e("./folding/coffee").FoldMode,d=function(){this.$tokenizer=new i((new a).getRules()),this.$outdent=new g,this.foldingRules=new s};r.inherits(d,o),function(){this.lineCommentStart="#",this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t);if("start"==e){var o=t.match(/^.*[\{\(\[]\s*$/);o&&(r+=n)}return r},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)}}.call(d.prototype),t.Mode=d}),define("ace/mode/yaml_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),o=e("./text_highlight_rules").TextHighlightRules,i=function(){this.$rules={start:[{token:"comment",regex:"#.*$"},{token:"list.markup",regex:/^(?:-{3}|\.{3})\s*(?=#|$)/},{token:"list.markup",regex:/^\s*[\-?](?:$|\s)/},{token:"constant",regex:"!![\\w//]+"},{token:"constant.language",regex:"[&\\*][a-zA-Z0-9-_]+"},{token:["meta.tag","keyword"],regex:/^(\s*\w.*?)(\:(?:\s+|$))/},{token:["meta.tag","keyword"],regex:/(\w+?)(\s*\:(?:\s+|$))/},{token:"keyword.operator",regex:"<<\\w*:\\w*"},{token:"keyword.operator",regex:"-\\s*(?=[{])"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:"[\\|>]\\w*",next:"qqstring"},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"constant.numeric",regex:/[+\-]?[\d_]+(?:(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?\b/},{token:"constant.numeric",regex:/[+\-]?\.inf\b|NaN\b|0x[\dA-Fa-f_]+|0b[10_]+/},{token:"constant.language.boolean",regex:"(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"},{token:"invalid.illegal",regex:"\\/\\/.*$"},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"}],qqstring:[{token:"string",regex:"(?=(?:(?:\\\\.)|(?:[^:]))*?:)",next:"start"},{token:"string",regex:".+"}]}};r.inherits(i,o),t.YamlHighlightRules=i}),define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){var r=e("../range").Range,o=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t),o=n.match(/^(\s*\})/);if(!o)return 0;var i=o[1].length,a=e.findMatchingBracket({row:t,column:i});if(!a||a.row==t)return 0;var g=this.$getIndent(e.getLine(a.row));e.replace(new r(t,0,t,i-1),g)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(o.prototype),t.MatchingBraceOutdent=o}),define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(e,t,n){var r=e("../../lib/oop"),o=e("./fold_mode").FoldMode,i=e("../../range").Range,a=t.FoldMode=function(){};r.inherits(a,o),function(){this.getFoldWidgetRange=function(e,t,n){var r=this.indentationBlock(e,n);if(r)return r;var o=/\S/,a=e.getLine(n),g=a.search(o);if(g!=-1&&"#"==a[g]){for(var s=a.length,d=e.getLength(),l=n,c=n;++n<d;){a=e.getLine(n);var u=a.search(o);if(u!=-1){if("#"!=a[u])break;c=n}}if(c>l){var h=e.getLine(c).length;return new i(l,s,c,h)}}},this.getFoldWidget=function(e,t,n){var r=e.getLine(n),o=r.search(/\S/),i=e.getLine(n+1),a=e.getLine(n-1),g=a.search(/\S/),s=i.search(/\S/);if(o==-1)return e.foldWidgets[n-1]=g!=-1&&g<s?"start":"","";if(g==-1){if(o==s&&"#"==r[o]&&"#"==i[o])return e.foldWidgets[n-1]="",e.foldWidgets[n+1]="","start"}else if(g==o&&"#"==r[o]&&"#"==a[o]&&e.getLine(n-2).search(/\S/)==-1)return e.foldWidgets[n-1]="start",e.foldWidgets[n+1]="","";return g!=-1&&g<o?e.foldWidgets[n-1]="start":e.foldWidgets[n-1]="",o<s?"start":""}}.call(a.prototype)});