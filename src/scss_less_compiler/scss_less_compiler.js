var http = require("http");
var url = require("url");
var querystring = require("querystring");
var less = require('less');
var sass = require('node-sass');
//formatter
var beautify_js = require('js-beautify'); // also available under "js" export
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;
//sass-convert
//var gulp = require('gulp');
//var sassdoc = require('sassdoc');
//var converter = require('sass-convert');
//var vfs = require('vinyl-fs');
//var through2 = require('through2').obj;

var server = new http.Server();

server.listen(1335, '127.0.0.1');

server.on('request', function(req, res){
	var postData = '';
	
	req.addListener('data', function(postDataChunk){
		postData += postDataChunk;    
	});
	
	req.addListener('end', function(){
		var parseData = querystring.parse(postData);
		if( parseData.type == "less" ) {
			try {
				less.render(parseData.text, {sourceMap: {}}).then(function (output) {
					res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
					res.end('compiled:' + (output.css.length) + "|" + output.css + output.map);
				},
				function(error){
					res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
					res.end('errorcompile:'+error);
				});
			}
			catch (e) {
				res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
				res.end('errorcompiler:Ошибка самого компилятора less');
			}
		} else if( parseData.type == "sass" || parseData.type == "scss" ) {
			try {
				sass.render({
					file: 'file.' + (parseData.type),
					data: parseData.text,
					outputStyle: 'nested',//expanded - простой стиль
					indentedSyntax: (parseData.type == "sass"),//Синтаксис с отступом
					sourceMap: true,
					outFile: 'output.css'
				}, function(error, result) { // node-style callback from v3.0.0 onwards
					if (error !== null) {
						//console.log(error.column);
						//console.log(error.line);
						res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
						res.end('errorcompile:' + error.message);
					}
					else {
						//JSON.stringify(result.map)
						res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
						res.end('compiled:' + (result.css.toString().length) + "|" + result.css.toString() + result.map);
					}
				});
			}
			catch (e) {
				res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
				res.end('errorcompiler:Ошибка самого компилятора sass, scss');
			}
		} else if( parseData.type == "formatter:html" || parseData.type == "formatter:htm" ) {
			res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
			res.end( beautify_html(parseData.text) );
		} else if( parseData.type == "formatter:css" ) {
			res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
			res.end( beautify_css(parseData.text) );
		} else if( parseData.type == "formatter:js" ) {
			res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
			res.end( beautify_js(parseData.text) );
		} else if( parseData.type == "formatter:scss" ) {
			/*gulp.task('beautify-scss', function () {
			  return gulp.src('fake.scss')
			  .pipe(through2(function(file, enc, callback){
				  file.contents = new Buffer(parseData.text);
				  callback(null, file);
			  }))
			  .pipe(converter({
				from: 'scss',
				to: 'sass',
			  }))
			  .pipe(through2(function(file, enc, callback){
				  if( file.extname = ".sass" ) {
					  res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
					res.end( file.contents.toString() );
				  }
				  callback(null, file);
			  }))
			  .pipe(gulp.dest('./output/*.sass'));
			});
			
			gulp.start("beautify-scss");*/
			
			res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
			res.end( parseData.text );
		}
	});
});