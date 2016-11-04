fn = function (o) {
	var r = "";

	r += '\
		<div class="row insert-pack">\
			<div class="row"><div class="col-xs-12" data-action="copy_folder" data-url="" data-src="base_shablons/html5/files/base"></div></div>';

	r += ( o["fonts_folder"]["fonts"] )                                      ? '<div class="row"><div class="col-xs-12" data-action="create_folder" data-url="fonts"></div></div>' : '';
	r +=                                                                       '<div class="row"><div class="col-xs-12" data-action="copy_file" data-url="favicon.ico" data-src="base_shablons/html5/files/favicon.ico"></div></div>';
	r += ( o["resetorframework"]["erik"] )                                   ? '<div class="row"><div class="col-xs-12" data-action="copy_file" data-url="css/reset.css" data-src="base_shablons/html5/files/reset.css"></div></div>' : '';
	r += ( o["resetorframework"]["bootstrap"] )                              ? '<div class="row"><div class="col-xs-12" data-action="copy_folder" data-url="" data-src="base_shablons/html5/files/bootstrap 3"></div></div>' : '';
	r += ( o["selectpicker"]["true"] && o["resetorframework"]["bootstrap"] ) ? '<div class="row"><div class="col-xs-12" data-action="copy_folder" data-url="js/bootstrap-select-1.9.4" data-src="base_shablons/html5/files/bootstrap-select-1.9.4"></div></div>' : '';
	r += ( o["font_awesome"]["true"] )                                       ? '<div class="row"><div class="col-xs-12" data-action="copy_folder" data-url="" data-src="base_shablons/html5/files/font-awesome-4.5.0"></div></div>' : '';
	r += ( o["jquery"]["1.12.0"] )                                           ? '<div class="row"><div class="col-xs-12" data-action="copy_file" data-url="js/jquery-1.12.0.min.js" data-src="base_shablons/html5/files/jquery/jquery-1.12.0.min.js"></div></div>' : '';
	r += ( o["jquery"]["2.2.0"] )                                            ? '<div class="row"><div class="col-xs-12" data-action="copy_file" data-url="js/jquery-2.2.0.min.js" data-src="base_shablons/html5/files/jquery/jquery-2.2.0.min.js"></div></div>' : '';
	r += ( o["jquery_migrate"]["1.3.0"] )                                    ? '<div class="row"><div class="col-xs-12" data-action="copy_file" data-url="js/jquery-migrate-1.3.0.min.js" data-src="base_shablons/html5/files/jquery-migrate/jquery-migrate-1.3.0.min.js"></div></div>' : '';
	r += ( o["jquery_ui"]["1.12.0"] )                                        ? '<div class="row"><div class="col-xs-12" data-action="copy_folder" data-url="js/jquery-ui-1.11.4" data-src="base_shablons/html5/files/jquery_ui/jquery-ui-1.11.4"></div></div>' : '';
	r += ( o["modernizr"]["2.8.3"] )                                         ? '<div class="row"><div class="col-xs-12" data-action="copy_file" data-url="js/modernizr-2.8.3.min.js" data-src="base_shablons/html5/files/modernizr-2.8.3.min.js"></div></div>' : '';
	r += ( o["device"]["true"] )                                             ? '<div class="row"><div class="col-xs-12" data-action="copy_file" data-url="js/device.min.js" data-src="base_shablons/html5/files/device.min.js"></div></div>' : '';

	r += '\
			<div class="row"><div class="col-xs-12" data-action="create_file" data-url="index.php" data-name="index.php"></div></div>\
			<div class="row"><div class="col-xs-12" data-action="create_file" data-url="css/main.css" data-name="css/main.css"></div></div>\
		</div>';

	return r;
}
