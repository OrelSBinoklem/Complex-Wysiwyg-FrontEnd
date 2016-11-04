fn = function(o) {
    var r = "";
    if( o["responsive"]["true"] || o["resetorframework"]["bootstrap"] ) {
        r += "\
.class1 {\n\
color: red;\n\
.class2 {\n\
        color: blue;\n\
    }\n\
}";
    }

    return $.trim(r);
}