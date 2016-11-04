<div class="content gc_glob-container">
	<h2>Настройки</h2>
	<hr />
	<div class="row">
        <div class="col-xs-6">
			<h4>Вставить для теста</h4>
        </div>
		<div class="col-xs-6">
			<div class="add-selector form-group">
                <div class="input-group">
                    <input name="container" type="text" class="form-control" placeholder="CSS Селектор">
                    <div class="input-group-btn">
                        <button class="btn btn-default"><span class="glyphicon glyphicon-screenshot"></span></button>
                    </div>
                </div>
                <form class="btn-group btn-group-justified" role="group" data-toggle="buttons">
					<label class="btn btn-default btn-sm">
						<input type="radio" name="container_pos" value="before" />before
					</label> 
					<label class="btn btn-default btn-sm">
						<input type="radio" name="container_pos" value="prepend" />prepend
					</label>
					<label class="btn btn-default btn-sm active">
						<input type="radio" name="container_pos" value="append" checked="checked" />append
					</label> 
					<label class="btn btn-default btn-sm">
						<input type="radio" name="container_pos" value="after" />after
					</label> 
				</form>
            </div>
		</div>
	</div>
	<div class="row">
        <div class="col-xs-6">
			<h4>Название спиннера</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="name" type="text" class="form-control" placeholder="Имя для комментариев" data-validate=".+" data-zapros="change-content">
			</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Пре-селектор</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Пре-селектор нужен для уточнения применения стилей и скриптов. Он добавляеться в начало всех селекторов">
			<form class="form-group" data-toggle="buttons">
				<input name="pre_selector" type="text" class="form-control" placeholder="CSS селектор">
			</form>
		</div>
	</div>
	<div class="row">
        <div class="col-xs-6">
			<h4>id или class спиннера</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="idclass_accordion" type="text" class="form-control" placeholder="#id или .class">
			</form>
		</div>
	</div>
	<h2>Настройки <small>плагина</small></h2>
	<hr />
	<div class="row">
        <div class="col-xs-6">
			<h4>Культура (язык_СТРАНА)</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Надо подключить globalize.js">
			<form class="form-group" data-toggle="buttons">
				<input name="culture" type="text" class="form-control" placeholder="'n|-n|false' def:0" data-validate="\w*" data-zapros="culture">
			</form>
		</div>
	</div>
    <div class="row">
		<div class="col-xs-6">
			<h4>Отключение спиннера</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Спиннер не пропадает, а просто перестаёт реагировать">
			<form class="btn-group btn-toggle-one-color" data-toggle="buttons" data-zapros="disabled">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="disabled" value="false" checked="checked" />Нет (def:false)
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="disabled" value="true" />true
				</label>
			</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Иконки</h4>
        </div>
		<div class="col-xs-6">
			<select class="selectpicker db-selected" data-width="100%" data-zapros="full_js">
				<option name="icons" value="none" selected="selected">Default</option>
				<option name="icons" value="jquery">Иконки jQuery</option>
				<option name="icons" value="custom_font">Иконки bottstrap, font awesome</option>
				<option name="icons" value="custom_image">Иконки из спрайта</option>
				<option name="icons" value="disabled">Отключить стандартные иконки</option>
			</select>
			<form class="jquery form-group" style="display: none; margin-top: 5px;"  data-placement="left" data-toggle="tooltip" title="Классы двух стандартных jQuery иконок на обычное и активное состояния пункта, def:{ 'header': 'ui-icon-triangle-1-e', 'activeHeader': 'ui-icon-triangle-1-s' }">
				<input name="icons_down" type="text" class="form-control" placeholder="Обычное" data-zapros="full_js">
				<input name="icons_up" type="text" class="form-control" placeholder="Активное" data-zapros="full_js" style="margin-top: 5px;">
				<a class="btn btn-link" href="http://api.jqueryui.com/theming/icons/" target="_blank">Иконки jQuery</a>
			</form>
			<form class="custom_font form-group" style="display: none; margin-top: 5px;" data-placement="left" data-toggle="tooltip" title="Классы двух иконок без служебных классов 'glyphicon' и 'fa' и без точки. Первая иконка обычное состояние вторая активное">
				<input name="custom_font_down" type="text" class="form-control" placeholder="Обычное" data-zapros="full_js">
				<input name="custom_font_up" type="text" class="form-control" placeholder="Активное" data-zapros="full_js" style="margin-top: 5px;">
				<a class="btn btn-link" href="http://getbootstrap.com/components/#glyphicons" target="_blank">Иконки Twitter Bootstrap 3</a>
				<a class="btn btn-link" href="https://fortawesome.github.io/Font-Awesome/icons/" target="_blank">Иконки Font Awesome</a>
			</form>
			<div class="custom_image" style="display: none; margin-top: 5px;" data-placement="left" data-toggle="tooltip" title="Картинка (спрайт) h = 2*w два состояния обычное и активное">
				<div class="add-src-image form-group">
					<div class="input-group src">
						<input name="icons_img_src" type="text" class="form-control gc-src" placeholder="Путь" data-zapros="css">
						<div class="input-group-btn">
							<button class="btn btn-default"><span class="glyphicon glyphicon-plus-sign"></span></button>
						</div>
					</div>
					<form class="row">
						<div class="col-xs-6">
							<div class="input-group">
								<div class="input-group-addon">w</div>
								<input name="icons_img_w" type="text" class="form-control input-sm gc-width" placeholder="Ширина" data-zapros="css">
							</div>
						</div>
						<div class="col-xs-6">
							<div class="input-group">
								<div class="input-group-addon">h</div>
								<input name="icons_img_h" type="text" class="form-control input-sm gc-height" placeholder="Высота" data-zapros="css">
							</div>
						</div>
					</form>
				</div>
				<div class="option-editor" data-name="custom_image" data-mode="css" data-validate=".+" data-zapros="css"></div>
                <div class="option-editor" data-name="custom_image_down" data-mode="css" data-validate=".+" data-zapros="css" style="margin-top: 5px;"></div>
			</div>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Ускорение изменения</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
                <select class="selectpicker db-selected" data-width="100%" data-zapros="full_js">
    				<option name="incremental" value="none" selected="selected">Default:true</option>
    				<option name="incremental" value="false">false</option>
    				<option name="incremental" value="true">true</option>
    				<option name="incremental" value="i_function">Функция</option>
    			</select>
			</form>
			<div class="i_function" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="i_function" data-mode="css" data-max-rows="20" data-validate=""></div>
			</div>
		</div>
    </div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Минимум</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="min" type="text" class="form-control" placeholder="число" data-validate="\d*" data-zapros="full_js" />
			</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Максимум</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="max" type="text" class="form-control" placeholder="число" data-validate="\d*" data-zapros="full_js" />
			</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Формат чисел</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Надо подключить globalize.js">
			<form class="form-group" data-toggle="buttons">
				<input name="number_format" type="text" class="form-control" placeholder="число" data-validate="\w*" data-zapros="full_js" />
			</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Шаг (pageUp/pageDown)</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="page" type="text" class="form-control" placeholder="число - def:10" data-validate="\d*" data-zapros="full_js" />
			</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Шаг</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="step" type="text" class="form-control" placeholder="число - def:1" data-validate="\d*" data-zapros="full_js" />
			</form>
		</div>
	</div>
	<h2>Настройки <small>css</small></h2>
	<hr />
	<div class="row">
        <div class="col-xs-6">
			<h4>Контейнер</h4>
        </div>
		<div class="col-xs-6">
			<div class="option-editor" data-name="container_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
		</div>
    </div>
    <div class="row" style="margin-top: 15px;">
        <div class="col-xs-6">
			<h4>Обёртка</h4>
        </div>
		<div class="col-xs-6">
            <form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="wrap_reset" value="wrap_no_reset" checked="checked" />Нет
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="wrap_reset" value="wrap_reset" />Обнулить
				</label>
			</form>
            <div class="wrap_no_reset" style="margin-top: 5px;">
				<div class="option-editor" data-name="wrap_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
			<div class="wrap_reset" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="wrap_css_reset" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
		</div>
    </div>
	<div class="row" style="margin-top: 15px;">
        <div class="col-xs-6">
			<h4>Инпут</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="input_reset" value="input_no_reset" checked="checked" />Нет
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="input_reset" value="input_reset" />Обнулить
				</label>
			</form>
			<div class="input_no_reset" style="margin-top: 5px;">
				<div class="option-editor" data-name="input_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
			<div class="input_reset" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="input_css_reset" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
		</div>
    </div>
	<div class="row" style="margin-top: 15px;">
        <div class="col-xs-6">
			<h4>Стрелки</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="arrows_reset" value="arrows_no_reset" checked="checked" />Нет
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="arrows_reset" value="arrows_reset" />Обнулить
				</label>
			</form>
			<div class="arrows_no_reset" style="margin-top: 5px;">
				<div class="option-editor" data-name="arrows_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
			<div class="arrows_reset" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="arrows_css_reset" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
		</div>
    </div>
	<h2>Дополнения</h2>
	<hr />
	<h2>Контент</h2>
	<hr />
</div>
<?php echo '<datatext name="i_function">'; ?>
function(count){
    return count;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="custom_image">'; ?>
left: .5em;
top: 50%;
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="custom_image_down">'; ?>
left: .5em;
top: 50%;
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="container_css">'; ?>

<?php echo '</datatext>'; ?>
<?php echo '<datatext name="wrap_css">'; ?>
.ui-spinner {
    position: relative;
    display: inline-block;
    overflow: hidden;
    padding: 0;
    vertical-align: middle;
    border: 1px solid #aaaaaa;
    border-radius: 4px;
    background: #ffffff url("images/ui-bg_flat_75_ffffff_40x100.png") 50% 50% repeat-x;
    color: #222222;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="wrap_css_reset">'; ?>
.ui-spinner {
    position: relative;
    display: inline-block;
    overflow: hidden;
    padding: 0;
    vertical-align: middle;
    border: none;
    border-radius: 0;
    background: #fff;
    color: #000;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="input_css">'; ?>
.ui-spinner-input {
    border: none;
    background: none;
    color: inherit;
    padding: 0;
    margin: .2em 0;
    vertical-align: middle;
    margin-left: .4em;
    margin-right: 22px;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="input_css_reset">'; ?>
.ui-spinner-input {
    border: none;
    background: none;
    color: inherit;
    padding: 0;
    margin: 0;
    vertical-align: middle;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="arrows_css">'; ?>
.ui-spinner a.ui-spinner-up {
    border-top: none;
    border-bottom: none;
    border-right: none;
    text-decoration: none;
    width: 16px;
    height: 50%;
    font-size: .5em;
    padding: 0;
    margin: 0;
    text-align: center;
    position: absolute;
    cursor: default;
    display: block;
    overflow: hidden;
    right: 0;
    border-top-right-radius: 4px;
}

.ui-widget-content .ui-state-default {
    border: 1px solid #d3d3d3;
    background: #e6e6e6 url("images/ui-bg_glass_75_e6e6e6_1x400.png") 50% 50% repeat-x;
    font-weight: normal;
    color: #555555;
}

.ui-widget-content .ui-state-hover
.ui-widget-content .ui-state-focus {
	border: 1px solid #999999;
	background: #dadada url("images/ui-bg_glass_75_dadada_1x400.png") 50% 50% repeat-x;
	font-weight: normal;
	color: #212121;
}

.ui-widget-content .ui-state-active {
	border: 1px solid #aaaaaa;
	background: #ffffff url("images/ui-bg_glass_65_ffffff_1x400.png") 50% 50% repeat-x;
	font-weight: normal;
	color: #212121;
}

.ui-button-text-only .ui-button-text {
    padding: .4em 1em;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="arrows_css_reset">'; ?>
.ui-spinner a.ui-spinner-up {
    border-top: none;
    border-bottom: none;
    border-right: none;
    text-decoration: none;
    width: 16px;
    height: 50%;
    font-size: inherit;
    padding: 0;
    margin: 0;
    text-align: center;
    position: absolute;
    cursor: default;
    display: block;
    overflow: hidden;
    right: 0;
    border-top-right-radius: 0;
}

.ui-widget-content .ui-state-default {
    border: none;
    background: #fff;
    font-weight: normal;
    color: #000;
}

.ui-widget-content .ui-state-hover
.ui-widget-content .ui-state-focus {
	border: none;
    background: #fff;
    font-weight: normal;
    color: #000;
}

.ui-widget-content .ui-state-active {
	border: none;
    background: #fff;
    font-weight: normal;
    color: #000;
}

.ui-button-text-only .ui-button-text {
    padding: 0;
}
<?php echo '</datatext>'; ?>
<script name="ready">
container.find(' .selectpicker').selectpicker({
	style: 'btn-default'
});

function HOOK_ParseFormOptions($OptionsContainer)
{

}

function HOOK_SendFormOptions(transferOptionsObj)
{
	//console.log(transferOptionsObj);
}
</script>