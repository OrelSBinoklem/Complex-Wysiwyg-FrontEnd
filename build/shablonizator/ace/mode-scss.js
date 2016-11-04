define("ace/mode/scss",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/scss_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/css","ace/mode/folding/cstyle"],function(e,t,r){var o=e("../lib/oop"),n=e("./text").Mode,i=e("../tokenizer").Tokenizer,a=e("./scss_highlight_rules").ScssHighlightRules,s=e("./matching_brace_outdent").MatchingBraceOutdent,l=e("./behaviour/css").CssBehaviour,u=e("./folding/cstyle").FoldMode,c=function(){this.$tokenizer=new i((new a).getRules()),this.$outdent=new s,this.$behaviour=new l,this.foldingRules=new u};o.inherits(c,n),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(e,t,r){var o=this.$getIndent(t),n=this.$tokenizer.getLineTokens(t,e).tokens;if(n.length&&"comment"==n[n.length-1].type)return o;var i=t.match(/^.*\{\s*$/);return i&&(o+=r),o},this.checkOutdent=function(e,t,r){return this.$outdent.checkOutdent(t,r)},this.autoOutdent=function(e,t,r){this.$outdent.autoOutdent(t,r)}}.call(c.prototype),t.Mode=c}),define("ace/mode/scss_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"],function(e,t,r){var o=e("../lib/oop"),n=e("../lib/lang"),i=e("./text_highlight_rules").TextHighlightRules,a=function(){var e=n.arrayToMap(function(){for(var e="-webkit-|-moz-|-o-|-ms-|-svg-|-pie-|-khtml-".split("|"),t="appearance|background-clip|background-inline-policy|background-origin|background-size|binding|border-bottom-colors|border-left-colors|border-right-colors|border-top-colors|border-end|border-end-color|border-end-style|border-end-width|border-image|border-start|border-start-color|border-start-style|border-start-width|box-align|box-direction|box-flex|box-flexgroup|box-ordinal-group|box-orient|box-pack|box-sizing|column-count|column-gap|column-width|column-rule|column-rule-width|column-rule-style|column-rule-color|float-edge|font-feature-settings|font-language-override|force-broken-image-icon|image-region|margin-end|margin-start|opacity|outline|outline-color|outline-offset|outline-radius|outline-radius-bottomleft|outline-radius-bottomright|outline-radius-topleft|outline-radius-topright|outline-style|outline-width|padding-end|padding-start|stack-sizing|tab-size|text-blink|text-decoration-color|text-decoration-line|text-decoration-style|transform|transform-origin|transition|transition-delay|transition-duration|transition-property|transition-timing-function|user-focus|user-input|user-modify|user-select|window-shadow|border-radius".split("|"),r="azimuth|background-attachment|background-color|background-image|background-position|background-repeat|background|border-bottom-color|border-bottom-style|border-bottom-width|border-bottom|border-collapse|border-color|border-left-color|border-left-style|border-left-width|border-left|border-right-color|border-right-style|border-right-width|border-right|border-spacing|border-style|border-top-color|border-top-style|border-top-width|border-top|border-width|border|bottom|box-shadow|box-sizing|caption-side|clear|clip|color|content|counter-increment|counter-reset|cue-after|cue-before|cue|cursor|direction|display|elevation|empty-cells|float|font-family|font-size-adjust|font-size|font-stretch|font-style|font-variant|font-weight|font|height|left|letter-spacing|line-height|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|marker-offset|margin|marks|max-height|max-width|min-height|min-width|opacity|orphans|outline-color|outline-style|outline-width|outline|overflow|overflow-x|overflow-y|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page|pause-after|pause-before|pause|pitch-range|pitch|play-during|position|quotes|richness|right|size|speak-header|speak-numeral|speak-punctuation|speech-rate|speak|stress|table-layout|text-align|text-decoration|text-indent|text-shadow|text-transform|top|unicode-bidi|vertical-align|visibility|voice-family|volume|white-space|widows|width|word-spacing|z-index".split("|"),o=[],n=0,i=e.length;n<i;n++)Array.prototype.push.apply(o,(e[n]+t.join("|"+e[n])).split("|"));return Array.prototype.push.apply(o,t),Array.prototype.push.apply(o,r),o}()),t=n.arrayToMap("hsl|hsla|rgb|rgba|url|attr|counter|counters|abs|adjust_color|adjust_hue|alpha|join|blue|ceil|change_color|comparable|complement|darken|desaturate|floor|grayscale|green|hue|if|invert|join|length|lighten|lightness|mix|nth|opacify|opacity|percentage|quote|red|round|saturate|saturation|scale_color|transparentize|type_of|unit|unitless|unqoute".split("|")),r=n.arrayToMap("absolute|all-scroll|always|armenian|auto|baseline|below|bidi-override|block|bold|bolder|border-box|both|bottom|break-all|break-word|capitalize|center|char|circle|cjk-ideographic|col-resize|collapse|content-box|crosshair|dashed|decimal-leading-zero|decimal|default|disabled|disc|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ellipsis|fixed|georgian|groove|hand|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|inactive|inherit|inline-block|inline|inset|inside|inter-ideograph|inter-word|italic|justify|katakana-iroha|katakana|keep-all|left|lighter|line-edge|line-through|line|list-item|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|medium|middle|move|n-resize|ne-resize|newspaper|no-drop|no-repeat|nw-resize|none|normal|not-allowed|nowrap|oblique|outset|outside|overline|pointer|progress|relative|repeat-x|repeat-y|repeat|right|ridge|row-resize|rtl|s-resize|scroll|se-resize|separate|small-caps|solid|square|static|strict|super|sw-resize|table-footer-group|table-header-group|tb-rl|text-bottom|text-top|text|thick|thin|top|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|zero".split("|")),o=n.arrayToMap("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow".split("|")),i=n.arrayToMap("@mixin|@extend|@include|@import|@media|@debug|@warn|@if|@for|@each|@while|@else|@font-face|@-webkit-keyframes|if|and|!default|module|def|end|declare".split("|")),a=n.arrayToMap("a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|u|ul|var|video|wbr|xmp".split("|")),s="\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))";this.$rules={start:[{token:"comment",regex:"\\/\\/.*$"},{token:"comment",regex:"\\/\\*",next:"comment"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:'["].*\\\\$',next:"qqstring"},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"string",regex:"['].*\\\\$",next:"qstring"},{token:"constant.numeric",regex:s+"(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)"},{token:"constant.numeric",regex:"#[a-f0-9]{6}"},{token:"constant.numeric",regex:"#[a-f0-9]{3}"},{token:"constant.numeric",regex:s},{token:["support.function","string","support.function"],regex:"(url\\()(.*)(\\))"},{token:function(n){return e.hasOwnProperty(n.toLowerCase())?"support.type":i.hasOwnProperty(n)?"keyword":r.hasOwnProperty(n)?"constant.language":t.hasOwnProperty(n)?"support.function":o.hasOwnProperty(n.toLowerCase())?"support.constant.color":a.hasOwnProperty(n.toLowerCase())?"variable.language":"text"},regex:"\\-?[@a-z_][@a-z0-9_\\-]*"},{token:"variable",regex:"[a-z_\\-$][a-z0-9_\\-$]*\\b"},{token:"variable.language",regex:"#[a-z0-9-_]+"},{token:"variable.language",regex:"\\.[a-z0-9-_]+"},{token:"variable.language",regex:":[a-z0-9-_]+"},{token:"constant",regex:"[a-z0-9-_]+"},{token:"keyword.operator",regex:"<|>|<=|>=|==|!=|-|%|#|\\+|\\$|\\+|\\*"},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"text",regex:"\\s+"},{caseInsensitive:!0}],comment:[{token:"comment",regex:".*?\\*\\/",next:"start"},{token:"comment",regex:".+"}],qqstring:[{token:"string",regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"',next:"start"},{token:"string",regex:".+"}],qstring:[{token:"string",regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'",next:"start"},{token:"string",regex:".+"}]}};o.inherits(a,i),t.ScssHighlightRules=a}),define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,r){var o=e("../range").Range,n=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var r=e.getLine(t),n=r.match(/^(\s*\})/);if(!n)return 0;var i=n[1].length,a=e.findMatchingBracket({row:t,column:i});if(!a||a.row==t)return 0;var s=this.$getIndent(e.getLine(a.row));e.replace(new o(t,0,t,i-1),s)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(n.prototype),t.MatchingBraceOutdent=n}),define("ace/mode/behaviour/css",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/mode/behaviour/cstyle","ace/token_iterator"],function(e,t,r){var o=e("../../lib/oop"),n=(e("../behaviour").Behaviour,e("./cstyle").CstyleBehaviour),i=e("../../token_iterator").TokenIterator,a=function(){this.inherit(n),this.add("colon","insertion",function(e,t,r,o,n){if(":"===n){var a=r.getCursorPosition(),s=new i(o,a.row,a.column),l=s.getCurrentToken();if(l&&l.value.match(/\s+/)&&(l=s.stepBackward()),l&&"support.type"===l.type){var u=o.doc.getLine(a.row),c=u.substring(a.column,a.column+1);if(":"===c)return{text:"",selection:[1,1]};if(!u.substring(a.column).match(/^\s*;/))return{text:":;",selection:[1,1]}}}}),this.add("colon","deletion",function(e,t,r,o,n){var a=o.doc.getTextRange(n);if(!n.isMultiLine()&&":"===a){var s=r.getCursorPosition(),l=new i(o,s.row,s.column),u=l.getCurrentToken();if(u&&u.value.match(/\s+/)&&(u=l.stepBackward()),u&&"support.type"===u.type){var c=o.doc.getLine(n.start.row),d=c.substring(n.end.column,n.end.column+1);if(";"===d)return n.end.column++,n}}}),this.add("semicolon","insertion",function(e,t,r,o,n){if(";"===n){var i=r.getCursorPosition(),a=o.doc.getLine(i.row),s=a.substring(i.column,i.column+1);if(";"===s)return{text:"",selection:[1,1]}}})};o.inherits(a,n),t.CssBehaviour=a}),define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"],function(e,t,r){var o=e("../../lib/oop"),n=e("../behaviour").Behaviour,i=e("../../token_iterator").TokenIterator,a=e("../../lib/lang"),s=["text","paren.rparen","punctuation.operator"],l=["text","paren.rparen","punctuation.operator","comment"],u=0,c=-1,d="",g=0,p=-1,h="",m="",b=function(){b.isSaneInsertion=function(e,t){var r=e.getCursorPosition(),o=new i(t,r.row,r.column);if(!this.$matchTokenType(o.getCurrentToken()||"text",s)){var n=new i(t,r.row,r.column+1);if(!this.$matchTokenType(n.getCurrentToken()||"text",s))return!1}return o.stepForward(),o.getCurrentTokenRow()!==r.row||this.$matchTokenType(o.getCurrentToken()||"text",l)},b.$matchTokenType=function(e,t){return t.indexOf(e.type||e)>-1},b.recordAutoInsert=function(e,t,r){var o=e.getCursorPosition(),n=t.doc.getLine(o.row);this.isAutoInsertedClosing(o,n,d[0])||(u=0),c=o.row,d=r+n.substr(o.column),u++},b.recordMaybeInsert=function(e,t,r){var o=e.getCursorPosition(),n=t.doc.getLine(o.row);this.isMaybeInsertedClosing(o,n)||(g=0),p=o.row,h=n.substr(0,o.column)+r,m=n.substr(o.column),g++},b.isAutoInsertedClosing=function(e,t,r){return u>0&&e.row===c&&r===d[0]&&t.substr(e.column)===d},b.isMaybeInsertedClosing=function(e,t){return g>0&&e.row===p&&t.substr(e.column)===m&&t.substr(0,e.column)==h},b.popAutoInsertedClosing=function(){d=d.substr(1),u--},b.clearMaybeInsertedClosing=function(){g=0,p=-1},this.add("braces","insertion",function(e,t,r,o,n){var i=r.getCursorPosition(),s=o.doc.getLine(i.row);if("{"==n){var l=r.getSelectionRange(),u=o.doc.getTextRange(l);if(""!==u&&"{"!==u&&r.getWrapBehavioursEnabled())return{text:"{"+u+"}",selection:!1};if(b.isSaneInsertion(r,o))return/[\]\}\)]/.test(s[i.column])?(b.recordAutoInsert(r,o,"}"),{text:"{}",selection:[1,1]}):(b.recordMaybeInsert(r,o,"{"),{text:"{",selection:[1,1]})}else if("}"==n){var c=s.substring(i.column,i.column+1);if("}"==c){var d=o.$findOpeningBracket("}",{column:i.column+1,row:i.row});if(null!==d&&b.isAutoInsertedClosing(i,s,n))return b.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}else if("\n"==n||"\r\n"==n){var p="";b.isMaybeInsertedClosing(i,s)&&(p=a.stringRepeat("}",g),b.clearMaybeInsertedClosing());var c=s.substring(i.column,i.column+1);if("}"==c||""!==p){var h=o.findMatchingBracket({row:i.row,column:i.column},"}");if(!h)return null;var m=this.getNextLineIndent(e,s.substring(0,i.column),o.getTabString()),f=this.$getIndent(s);return{text:"\n"+m+"\n"+f+p,selection:[1,m.length,1,m.length]}}}}),this.add("braces","deletion",function(e,t,r,o,n){var i=o.doc.getTextRange(n);if(!n.isMultiLine()&&"{"==i){var a=o.doc.getLine(n.start.row),s=a.substring(n.end.column,n.end.column+1);if("}"==s)return n.end.column++,n;g--}}),this.add("parens","insertion",function(e,t,r,o,n){if("("==n){var i=r.getSelectionRange(),a=o.doc.getTextRange(i);if(""!==a&&r.getWrapBehavioursEnabled())return{text:"("+a+")",selection:!1};if(b.isSaneInsertion(r,o))return b.recordAutoInsert(r,o,")"),{text:"()",selection:[1,1]}}else if(")"==n){var s=r.getCursorPosition(),l=o.doc.getLine(s.row),u=l.substring(s.column,s.column+1);if(")"==u){var c=o.$findOpeningBracket(")",{column:s.column+1,row:s.row});if(null!==c&&b.isAutoInsertedClosing(s,l,n))return b.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}}),this.add("parens","deletion",function(e,t,r,o,n){var i=o.doc.getTextRange(n);if(!n.isMultiLine()&&"("==i){var a=o.doc.getLine(n.start.row),s=a.substring(n.start.column+1,n.start.column+2);if(")"==s)return n.end.column++,n}}),this.add("brackets","insertion",function(e,t,r,o,n){if("["==n){var i=r.getSelectionRange(),a=o.doc.getTextRange(i);if(""!==a&&r.getWrapBehavioursEnabled())return{text:"["+a+"]",selection:!1};if(b.isSaneInsertion(r,o))return b.recordAutoInsert(r,o,"]"),{text:"[]",selection:[1,1]}}else if("]"==n){var s=r.getCursorPosition(),l=o.doc.getLine(s.row),u=l.substring(s.column,s.column+1);if("]"==u){var c=o.$findOpeningBracket("]",{column:s.column+1,row:s.row});if(null!==c&&b.isAutoInsertedClosing(s,l,n))return b.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}}),this.add("brackets","deletion",function(e,t,r,o,n){var i=o.doc.getTextRange(n);if(!n.isMultiLine()&&"["==i){var a=o.doc.getLine(n.start.row),s=a.substring(n.start.column+1,n.start.column+2);if("]"==s)return n.end.column++,n}}),this.add("string_dquotes","insertion",function(e,t,r,o,n){if('"'==n||"'"==n){var i=n,a=r.getSelectionRange(),s=o.doc.getTextRange(a);if(""!==s&&"'"!==s&&'"'!=s&&r.getWrapBehavioursEnabled())return{text:i+s+i,selection:!1};var l=r.getCursorPosition(),u=o.doc.getLine(l.row),c=u.substring(l.column-1,l.column);if("\\"==c)return null;for(var d,g=o.getTokens(a.start.row),p=0,h=-1,m=0;m<g.length&&(d=g[m],"string"==d.type?h=-1:h<0&&(h=d.value.indexOf(i)),!(d.value.length+p>a.start.column));m++)p+=g[m].value.length;if(!d||h<0&&"comment"!==d.type&&("string"!==d.type||a.start.column!==d.value.length+p-1&&d.value.lastIndexOf(i)===d.value.length-1)){if(!b.isSaneInsertion(r,o))return;return{text:i+i,selection:[1,1]}}if(d&&"string"===d.type){var f=u.substring(l.column,l.column+1);if(f==i)return{text:"",selection:[1,1]}}}}),this.add("string_dquotes","deletion",function(e,t,r,o,n){var i=o.doc.getTextRange(n);if(!n.isMultiLine()&&('"'==i||"'"==i)){var a=o.doc.getLine(n.start.row),s=a.substring(n.start.column+1,n.start.column+2);if(s==i)return n.end.column++,n}})};o.inherits(b,n),t.CstyleBehaviour=b}),define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,r){var o=e("../../lib/oop"),n=(e("../../range").Range,e("./fold_mode").FoldMode),i=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};o.inherits(i,n),function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,this.getFoldWidgetRange=function(e,t,r){var o=e.getLine(r),n=o.match(this.foldingStartMarker);if(n){var i=n.index;return n[1]?this.openingBracketBlock(e,n[1],r,i):e.getCommentFoldRange(r,i+n[0].length,1)}if("markbeginend"===t){var n=o.match(this.foldingStopMarker);if(n){var i=n.index+n[0].length;return n[1]?this.closingBracketBlock(e,n[1],r,i):e.getCommentFoldRange(r,i,-1)}}}}.call(i.prototype)});