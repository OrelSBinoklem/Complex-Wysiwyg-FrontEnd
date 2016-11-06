fn = function(o) {
	var r = "";

	r += '\n\
		<!DOCTYPE html>\n\
		<html lang="' + val(o["lang"]) + '">\n\
		<head>\n\
		<meta charset="utf-8" />\n\
		<title>' + (o["title"]) + '</title>\n\
		<meta name="description" content="' + (o["description"]) + '">\n\
			<meta name="keywords" content="' + (o["keywords"]) + '">';

	r += ( o["responsive"]["true"] || o["resetorframework"]["bootstrap"] )   ? '<meta name="viewport" content="width=device-width, initial-scale=1">' : '';
	r +=                                                                       '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">';
	r += ( o["resetorframework"]["erik"] )                                   ? '<link href="css/reset.css" rel="stylesheet">' : '';
	r += ( o["resetorframework"]["bootstrap"] )                              ? '<link href="css/bootstrap.min.css" rel="stylesheet">\n<link href="css/bootstrap-theme.css" rel="stylesheet">' : '';
	r += ( o["selectpicker"]["true"] && o["resetorframework"]["bootstrap"] ) ? '<link href="js/bootstrap-select-1.9.4/css/bootstrap-select.min.css" rel="stylesheet">' : '';
	r += ( o["font_awesome"]["true"] )                                       ? '<link href="css/font-awesome.min.css" rel="stylesheet">' : '';
	r += ( o["jquery_ui"]["1.12.0"] )                                        ? '<link href="js/jquery-ui-1.11.4/jquery-ui.min.css" rel="stylesheet">' : '';
	r +=                                                                       '<link href="css/main.css" rel="stylesheet">';
	r += ( o["modernizr"]["2.8.3"] )                                         ? '<script src="js/modernizr-2.8.3.min.js"></script>' : '';
	r += ( o["device"]["true"] )                                             ? '<script src="js/device.min.js"></script>' : '';
	r +=                                                                       '\n</head>\n<body>\n<p>Привет, мир</p>';
	r += ( o["jquery"]["1.12.0"] )                                           ? '<script src="https://code.jquery.com/jquery-1.12.0.min.js" type="text/javascript"></script>\n<script type="text/javascript">window.jQuery || document.write(\'<script src="js/jquery-1.12.0.min.js"><\/script>\')</script>' : '';
	r += ( o["jquery"]["2.2.0"] )                                            ? '<script src="https://code.jquery.com/jquery-2.2.0.min.js" type="text/javascript"></script>\n<script type="text/javascript">window.jQuery || document.write(\'<script src="js/jquery-2.2.0.min.js"><\/script>\')</script>' : '';
	r += ( o["jquery_migrate"]["1.3.0"] )                                    ? '<script src="https://code.jquery.com/jquery-migrate-1.3.0.min.js" type="text/javascript"></script>\n<script type="text/javascript">window.jQuery.migrateVersion || document.write(\'<script src="js/jquery-migrate-1.3.0.min.js"><\/script>\')</script>' : '';
	r += ( o["resetorframework"]["bootstrap"] )                              ? '<script src="js/bootstrap.min.js" type="text/javascript"></script>' : '';
	r += ( o["selectpicker"]["true"] && o["resetorframework"]["bootstrap"] ) ? '<script src="js/bootstrap-select-1.9.4/js/bootstrap-select.min.js" type="text/javascript"></script>\n<script src="js/bootstrap-select-1.9.4/js/i18n/defaults-'+ val(o["selectpicker_lang"]) +'.min.js" type="text/javascript"></script>' : '';
	r += ( o["jquery_ui"]["1.12.0"] )                                        ? '<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>\n<script type="text/javascript">window.jQuery.ui || document.write(\'<script src="js/jquery-ui-1.11.4/jquery-ui.min.js"><\/script>\')</script>' : '';

	r += '\n\
			<script src="js/main.js" type="text/javascript"></script>\n\
		</body>\n\
		</html>';
	return r;
}





