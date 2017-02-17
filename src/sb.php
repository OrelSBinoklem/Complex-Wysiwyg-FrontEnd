<?php /*$_GET['pass'] == 32216554*/ if(!isset($_POST['module'])): ?>
<!DOCTYPE html>
    <head>
        <title>Шаблонизатор</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,400italic' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="sb/css/reset.css">

        <!--jQuery, jQuery UI-->
        <link href="sb/css/ui-lightness/jquery-ui.css" rel="stylesheet">
		<script type="text/javascript" src="sb/js/jquery-1.11.2.min.js"></script>
        <script src="sb/js/jquery-ui-1.11.3.min.js"></script>

        <!--Bootstrap 3-->
        <link href="sb/css/bootstrap.css" rel="stylesheet" media="screen">
        <link href="sb/css/bootstrap-theme.css" rel="stylesheet" media="screen">
        <link href="sb/css/font-awesome.min.css" rel="stylesheet" media="screen">
        <link href="sb/js/selectpicker/bootstrap-select.min.css" rel="stylesheet" media="screen">
        <script src="sb/js/bootstrap.min.js"></script>
        <script src="sb/js/selectpicker/bootstrap-select.min.js"></script>
        <script src="sb/js/selectpicker/i18n/defaults-ru_RU.js"></script>
        
        <script src="sb/js/jquery.zclip.js"></script>

        <!--malihu-custom-scrollbar-->
        <link rel="stylesheet" href="sb/js/malihu-custom-scrollbar/jquery.mCustomScrollbar.min.css">
        <script type="text/javascript" src="sb/js/malihu-custom-scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>
        
        <!--GreenSock (крутые анимашки)-->
        <script type="text/javascript" src="sb/js/greensock/TimelineMax.min.js"></script>
        <script type="text/javascript" src="sb/js/greensock/TweenMax.min.js"></script>

        <!--Начало моих модулей-->
        <script type="text/javascript" src="sb/js/global.js"></script>
        <!--<script type="text/javascript" src="sb/js/mylib/proverka-raboti-koda.js"></script>-->

        <!--file-navigator-->
        <link rel="stylesheet" href="sb/js/mylib/file-navigator/file-navigator.css">
        <script type="text/javascript" src="sb/js/mylib/file-navigator/file-navigator.js"></script>

        <!--page-manager-visualizator-->
        <link rel="stylesheet" href="sb/js/mylib/page-manager-visualizator/custom-scrool-iframe.css">
        <script type="text/javascript" src="sb/js/mylib/page-manager-visualizator/custom-scrool-iframe.js"></script>
        <link rel="stylesheet" href="sb/js/mylib/page-manager-visualizator/map-navigator-iframe.css">
        <script type="text/javascript" src="sb/js/mylib/page-manager-visualizator/map-navigator-iframe.js"></script>
        <link rel="stylesheet" href="sb/js/mylib/page-manager-visualizator/resize-iframe.css">
        <script type="text/javascript" src="sb/js/mylib/page-manager-visualizator/resize-iframe.js"></script>
        <script type="text/javascript" src="sb/js/mylib/page-manager-visualizator/fixation-content-at-resize.js"></script>
        <link rel="stylesheet" href="sb/js/mylib/page-manager-visualizator/page-manager-visualizator.css">
        <script type="text/javascript" src="sb/js/mylib/page-manager-visualizator/page-manager-visualizator.js"></script>
        
        <!--pixel-perfect-->
        <link rel="stylesheet" href="sb/js/mylib/pixel-perfect/screenshots-manipulator.css">
        <script type="text/javascript" src="sb/js/mylib/pixel-perfect/screenshots-manipulator.js"></script>
        <link rel="stylesheet" href="sb/js/mylib/pixel-perfect/pixel-perfect.css">
        <script type="text/javascript" src="sb/js/mylib/pixel-perfect/pixel-perfect.js"></script>
        
        <link rel="stylesheet" href="sb/css/main.css">
        <script type="text/javascript" src="sb/js/main.js"></script>
    </head>
    <body>
        <div  id="testovaya_ssilka" class="twitter-bootstrap-3"><a href="#" class="btn btn-default" style="padding-left: 15px; position: fixed; left: 500px; top: 0; z-index: 100000;">Тест 1</a></div>

        <div class="shab-general-window">
            <div class="shab-general-window__top twitter-bootstrap-3">
                <div class="shab__top-menu">
                    <div class="pmv__select-page">
                        <select class="select-page selectpicker" data-width="389px"></select>
                        <div class="btn-group">
                            <button class="add_page btn btn-default"><span class="fa fa-plus-circle"></span></button>
                            <button class="add_page_href btn btn-default"><span class="fa fa-pencil-square-o"></span></button>
                        </div>
                    </div>
                    <div class="pp__select-resolution">
                        <select class="select-group selectpicker" data-width="246px"></select>
                        <button class="add-group btn btn-default"><span class="fa fa-plus-circle"></span></button>
                        <div class="pp-verstka-design btn-group btn-toggle-one-color">
                            <a href="#" class="pp__verstka-btn btn btn-primary active" data-btn-color="primary"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Вёрстка"><i class="fa fa-code"></i></span></a>
                            <a href="#" class="pp__50p-btn btn btn-default" data-btn-color="warning"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Полупрозрачная вёрстка поверх дизайна">50%</span></a>
                            <a href="#" class="pp__design-btn btn btn-default" data-btn-color="danger"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Изображение дизайна"><i class="fa fa-picture-o"></i></span></a>
                        </div>
                        <button class="pp__open-btn btn btn-default"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Открыть &quot;пиксель перфект&quot;"><span class="glyphicon glyphicon-th"></span></span></button>
                    </div>
                </div>

                <div class="shab-global-settings-generator">
                    <button class="btn btn-default shab__global-settings-btn"><span class="glyphicon glyphicon-cog"></span></button>
                    <div class="btn-group">
                        <a href="#" class="gc__select-generator-btn btn btn-default"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Меню выбора генератора кода"><i class="fa fa-bars"></i></span></a>
                        <a href="#" class="gc__open-generator-btn btn btn-default"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Окно генератора кода (ввод данных и генерация кода)"><i class="fa fa-pencil-square-o"></i><span></span></a>
                    </div>
                </div>
                <button class="btn btn-danger pmv__update-iframe-btn"><span data-toggle="tooltip" data-placement="bottom" data-original-title="Обновить страницу вёрстки"><span class="glyphicon glyphicon-refresh"></span></span></button>
            </div>
            <div class="shab-general-window__bottom">
                <div class="pp__file-navigator"></div>
                <div class="gc-wrap twitter-bootstrap-3"></div>
                <div class="gc__select-generator twitter-bootstrap-3">
                    <div class="panel panel-primary">
                        <div class="panel-heading">Меню выбора модуля</div>
                        <div class="gc__select-generator__panel-body panel-body">
                            <div class="btn-group gc__select-generator__type">
                                <button type="button" class="gc__select-generator-btn--html-plus-css btn btn-default active">html + css</button>
                                <button type="button" class="gc__select-generator-btn--plugins btn btn-default">&nbsp;Плагины&nbsp;</button>
                            </div>
                            <div class="btn-group gc__select-generator__collapse-uncollapse">
                                <button type="button" class="gc__select-generator__uncollapse btn btn-default"><i class="fa fa-expand"></i></button>
                                <button type="button" class="gc__select-generator__collapse btn btn-default"><i class="fa fa-compress"></i></button>
                            </div>
                            <div class="gc__select-generator--html-plus-css f-open gc__select-generator-level-1">

                            </div>
                            <div class="gc__select-generator--plugins f-open gc__select-generator-level-1" style="display: none">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="shab-right-column ui-1-11-3">
            <div id="wrap_iframe" class="twitter-bootstrap-3">

            </div>
        </div>
    <div id="wrapper_canvas_zoom"><canvas id='example'>Обновите браузер</canvas><div id="pricel"></div></div>
    <!--Окно с глобальными настройками-->
    <div class="shab__global-settings twitter-bootstrap-3">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Настройки редактора</h3>
            </div>
            <div class="panel-body">
                <h4>Кодировка на хосте</h4>
                <select id="text-encoding-server" size="1" >
                    <option value="Windows-1251">Windows-1251</option>
                    <option value="KOI8-R">KOI8-R</option>
                    <option value="ISO-8859-5">ISO-8859-5</option>
                    <option value="UTF-8">UTF-8</option>
                </select>
                <h4>Если sass, scss или less лежит в другой папке</h4>
                <div class="row">
                    <div class="col-xs-6">
                        <label for="shab__global-settings-rerouting-pattern">Какие пути рероутить</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="shab__global-settings-rerouting-pattern" placeholder="Regular">
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <label for="shab__global-settings-rerouting-relative-folder">Куда рероутить</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="shab__global-settings-rerouting-relative-folder" placeholder="Relative url">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--Модальное окно для добавления страниц в "менеджер страниц и визуализатор"-->
    <div id="modal-pp-add-page-href" class="twitter-bootstrap-3">
        <div class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close btn-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Ссылка на страницу</h4>
                    </div>
                    <div class="modal-body">
                        <form class="row">
                            <div class="col-xs-12">
                                <input type="text" class="pmv-href form-control" value="" />
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-close" data-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary btn-select">Добавить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="modal-pp-add-group" class="twitter-bootstrap-3">
        <div class="modal fade">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close btn-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Укажите ширину и высоту</h4>
                    </div>
                    <div class="modal-body">
                        <form class="row">
                            <div class="col-xs-6">
                                <div class="input-group">
                                    <div class="input-group-addon">w</div>
                                    <input type="text" class="form-control input-sm pp-width" placeholder="Ширина">
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <div class="input-group">
                                    <div class="input-group-addon">h</div>
                                    <input type="text" class="form-control input-sm pp-height" placeholder="Высота">
                                </div>
                            </div>
                        </form>
                        <div class="alert alert-warning alert-input-error" role="alert">Число от 10 до 9999</div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-close" data-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary btn-select">Выбрать</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="loading">
        <div class="wrap">
            <div class="content">
                <div class="circle"></div>
                <div class="circle1"></div>
            </div>
        </div>
    </div>
    </body>
</html>
<?php endif; ?>
<?php
if(isset($_POST['module']))
{
    switch ($_POST['module'])
    {
        case "base_url":
            require_once("sb/php/base_url.php");
            break;
        case "base_url_full":
            require_once("sb/php/base_url_full.php");
            break;
        case "filemanager":
            require_once("sb/php/filemanager.php");
            break;
        case "getfile":
            require_once("sb/php/getfile.php");
            break;
        case "pixel_perfect":
            require_once("sb/php/pixel_perfect.php");
            break;
        case "setfile":
            require_once("sb/php/setfile.php");
            break;
		case "file_exists":
			require_once("sb/php/file_exists.php");
            break;
        case "create_folder":
			require_once("sb/php/create_folder.php");
            break;
        case "create_update_file":
			require_once("sb/php/create_update_file.php");
            break;
        case "file_modified_time":
            require_once("sb/js/mylib/editor/file_modified_time.php");
            break;
    }
}

?>