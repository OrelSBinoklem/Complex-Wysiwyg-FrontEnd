fn = function(o) {
    var r = "";
    if( o["responsive"]["true"] || o["resetorframework"]["bootstrap"] ) {
        r += "@media (max-width: 1199px) {\n\
    \n\
}\n\
\n\
@media (max-width: 991px) {\n\
    \n\
}\n\
\n\
@media (max-width: 767px) {\n\
    \n\
}\n\
\n\
@media (max-width: 479px) {\n\
    \n\
}";
    }

    return r;
}