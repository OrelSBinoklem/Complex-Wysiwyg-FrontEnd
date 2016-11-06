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
			<h4>Название табов</h4>
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
			<h4>id или class табов</h4>
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
			<h4>Время анимации</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Анимация перемещения ползуночка в то место где вы кликнули на слайдере. Анимируеться тот ползунок который ближе к курсору">
			<form class="form-group" data-toggle="buttons">
				<input name="animate_time" type="text" class="form-control" placeholder="'string|n|false' def:0" data-validate="\d*" data-zapros="active" data-placement="bottom" data-toggle="popover" title="Значение" data-content="">
			</form> 
		</div>
	</div>
    <div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Отключение ползунка</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Ползунок не пропадает, а просто перестаёт реагировать">
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
    <div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Минимальное значение</h4>
		</div>
		<div class="col-xs-6">
			<input name="min" type="text" class="form-control" placeholder="-n|n def:0" data-instant-update="yes" data-validate="-?\d*" data-zapros="full_js">
		</div>
	</div>
    <div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Максимальное значение</h4>
		</div>
		<div class="col-xs-6">
			<input name="max" type="text" class="form-control" placeholder="-n|n def:100" data-instant-update="yes" data-validate="-?\d*" data-zapros="full_js">
		</div>
	</div>
    <div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Ориентация</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="При повторном клике по активной вкладке она закрываеться и получаеться что все вкладки могут быть одно временно закрытыми">
			<form class="btn-group btn-toggle-one-color" data-toggle="buttons" data-zapros="full_js">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="orientation" value="horizontal" checked="checked" />def:horizontal
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="orientation" value="vertical" />vertical
				</label>
			</form>
		</div>
	</div>
    <div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Диапазон</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="true - создаеться диапазо от min до max, min - создаеться 1 ползунок тоже от min do max и выглядет так как если выбор идёт от min (правая и левая части ползунка стилизуються по разному...) max - тоже что и min только max...">
			<select class="selectpicker db-selected" data-width="100%" data-zapros="full_js">
				<option name="range" value="none" selected="selected">Default:false</option>
				<option name="range" value="true">true</option>
				<option name="range" value="min">"min"</option>
				<option name="range" value="max">"max"</option>
			</select>
		</div>
	</div>
    <div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Шаг</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="шаг с которым будет меняться значения">
			<input name="step" type="text" class="form-control" placeholder="n def:1" data-instant-update="yes" data-validate="-?\d*" data-zapros="full_js">
		</div>
	</div>
    <div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Начальное значение</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="если ползунков несколько то применяеться к первому">
			<input name="one_value" type="text" class="form-control" placeholder="n def:0" data-instant-update="yes" data-validate="-?\d*" data-zapros="full_js">
		</div>
	</div>
    <div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Несколько значений</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Если включен диапазон то значения должно 2, если нет то сколько угодно. Сколько будет задано значений столько и будет создано ползунков. ПЕРЕЧИСЛИТЕ ЧИСЛА ЧЕРЕЗ ЗАПЯТУЮ">
			<input name="values" type="text" class="form-control" placeholder="array" data-instant-update="yes" data-validate="-?\d*" data-zapros="full_js">
		</div>
	</div>
	<h2>Настройки <small>css</small></h2>
	<hr />
	<div class="row">
        <div class="col-xs-6">
			<h4>Контейнер</h4>
        </div>
		<div class="col-xs-6">
            <form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="container_reset" value="container_no_reset" checked="checked" />Нет
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="container_reset" value="container_reset" />Обнулить
				</label>
			</form>
            <div class="container_no_reset" style="margin-top: 5px;">
				<div class="option-editor" data-name="container_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
			<div class="container_reset" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="container_css_reset" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
		</div>
    </div>
	<div class="row" style="margin-top: 15px;">
        <div class="col-xs-6">
			<h4>Промежуток (range)</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="range_reset" value="range_no_reset" checked="checked" />Нет
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="range_reset" value="range_reset" />Обнулить
				</label>
			</form>
			<div class="range_no_reset" style="margin-top: 5px;">
				<div class="option-editor" data-name="range_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
			<div class="range_reset" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="range_css_reset" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
		</div>
    </div>
	<div class="row" style="margin-top: 15px;">
        <div class="col-xs-6">
			<h4>Ползунки</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="polzunok_reset" value="polzunok_no_reset" checked="checked" />Нет
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="polzunok_reset" value="polzunok_reset" />Обнулить
				</label>
			</form>
			<div class="polzunok_no_reset" style="margin-top: 5px;">
				<div class="option-editor" data-name="polzunok_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
			<div class="polzunok_reset" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="polzunok_css_reset" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
		</div>
    </div>
	<h2>Дополнения</h2>
	<hr />
	<h2>Контент</h2>
</div>
<?php echo '<datatext name="container_css">'; ?>
&.ui-corner-all {
    border-radius: 4px;
}

&.ui-widget-content {
    border: 1px solid #aaaaaa;
    background: #ffffff url("images/ui-bg_flat_75_ffffff_40x100.png") 50% 50% repeat-x;
    color: #222222;
}

&.ui-slider-horizontal {
    height: .8em;
}

&.ui-slider-vertical {
    width: .8em;
}

&.ui-slider {
    position: relative;
    text-align: left;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="container_css_reset">'; ?>
&.ui-corner-all {
    border-radius: 0;
}

&.ui-widget-content {
    border: none;
    background: #fff;
    color: #000;
}

&.ui-slider-horizontal {
    height: .8em;
}

&.ui-slider-vertical {
    width: .8em;
}

&.ui-slider {
    position: relative;
    text-align: left;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="range_css">'; ?>
&.ui-slider .ui-slider-range {
    position: absolute;
    z-index: 1;
    font-size: .7em;
    display: block;
    border: 0;
    background-position: 0 0;
}

&.ui-slider-horizontal .ui-slider-range {
    top: 0;
    height: 100%;
}

&.ui-slider-vertical .ui-slider-range {
    left: 0;
    width: 100%;
}

.ui-slider-range.ui-corner-all {
    border-radius: 4px;
}

.ui-slider-range.ui-widget-header {
    border: 1px solid #aaaaaa;
    background: #cccccc url("images/ui-bg_highlight-soft_75_cccccc_1x100.png") 50% 50% repeat-x;
    color: #222222;
    font-weight: bold;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="range_css_reset">'; ?>
&.ui-slider .ui-slider-range {
    position: absolute;
    z-index: 1;
    font-size: .7em;
    display: block;
    border: 0;
    background-position: 0 0;
}

&.ui-slider-horizontal .ui-slider-range {
    top: 0;
    height: 100%;
}

&.ui-slider-vertical .ui-slider-range {
    left: 0;
    width: 100%;
}

.ui-slider-range.ui-corner-all {
    border-radius: 0;
}

.ui-slider-range.ui-widget-header {
    border: 1px solid #aaaaaa;
    background: #fff;
    color: #000;
    font-weight: normal;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="polzunok_css">'; ?>
&.ui-widget-content .ui-state-default {
    border: 1px solid #d3d3d3;
    background: #e6e6e6 url("images/ui-bg_glass_75_e6e6e6_1x400.png") 50% 50% repeat-x;
    font-weight: normal;
    color: #555555;
}

&.ui-slider .ui-slider-handle {
    position: absolute;
    z-index: 2;
    width: 1.2em;
    height: 1.2em;
    cursor: default;
    -ms-touch-action: none;
    touch-action: none;
}

&.ui-slider-horizontal .ui-slider-handle {
    top: -.3em;
    margin-left: -.6em;
}

&.ui-slider-vertical .ui-slider-handle {
    left: -.3em;
    margin-left: 0;
    margin-bottom: -.6em;
}

.ui-slider-handle.ui-corner-all {
    border-radius: 4px;
}

&.ui-widget-content .ui-state-hover,
&.ui-widget-content .ui-state-focus {
	border: 1px solid #999999;
	background: #dadada url("images/ui-bg_glass_75_dadada_1x400.png") 50% 50% repeat-x;
	font-weight: normal;
	color: #212121;
}

&.ui-widget-content .ui-state-active {
	border: 1px solid #aaaaaa;
	background: #ffffff url("images/ui-bg_glass_65_ffffff_1x400.png") 50% 50% repeat-x;
	font-weight: normal;
	color: #212121;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="polzunok_css_reset">'; ?>
&.ui-widget-content .ui-state-default {
    border: none;
    background: #fff;
    font-weight: normal;
    color: #000;
}

&.ui-slider .ui-slider-handle {
    position: absolute;
    z-index: 2;
    width: 1.2em;
    height: 1.2em;
    cursor: default;
    -ms-touch-action: none;
    touch-action: none;
}

&.ui-slider-horizontal .ui-slider-handle {
    top: -.3em;
    margin-left: -.6em;
}

&.ui-slider-vertical .ui-slider-handle {
    left: -.3em;
    margin-left: 0;
    margin-bottom: -.6em;
}

.ui-slider-handle.ui-corner-all {
    border-radius: 0;
}

&.ui-widget-content .ui-state-hover,
&.ui-widget-content .ui-state-focus {
	border: none;
	background: #fff;
	font-weight: normal;
	color: #000;
}

&.ui-widget-content .ui-state-active {
	border: none;
	background: #fff;
	font-weight: normal;
	color: #000;
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