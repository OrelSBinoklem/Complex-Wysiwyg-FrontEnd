<div class="gc_glob-container">
    <h2>Настройки</h2>
	<hr />
    <div class="row">
        <div class="col-xs-6">
			<h4>Селектор</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Селектор меню">
            <div class="add-selector form-group">
                <div class="input-group">
                    <input name="selector" type="text" class="form-control" placeholder="CSS Селектор">
                    <div class="input-group-btn">
                        <button class="btn btn-default"><span class="glyphicon glyphicon-screenshot"></span></button>
                    </div>
                </div>
            </div>
		</div>
	</div>
	<div class="row">
        <div class="col-xs-6">
			<h4>Название меню</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="name" type="text" class="form-control" placeholder="Имя для комментариев" data-validate=".+" data-zapros="change-content" data-helper="3">
			</form>
		</div>
	</div>
    <h2>Настройки <small>модуля</small></h2>
	<hr />
    <div class="row">
        <div class="col-xs-6">
			<h4>На всю ширину</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Меню на всю ширину. Ширина задаеться пунктам таким образом что у них появляються одинаковые отступы слева и с права. При создании меню в котором пункты будут подстраиваться под ширину контента с помощю таблиц имеет недостаток, ширина отступов у каждого пункта зависит от контента внутри него, этот плагин делает чтоб отступы во всех пунктах были одинаковыми">
			<form class="btn-group btn-toggle-one-color centermenu" data-toggle="buttons">
        		<label class="btn btn-default active" data-btn-color="default">
        			<input type="radio" name="full_width" value="none" checked="checked" />false
        		</label>
        		<label class="btn btn-default" data-btn-color="success">
        			<input type="radio" name="full_width" value="true" />true
        		</label>
        	</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Фиксация меню при прокрутке</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Если изначально меню нефиксировано и его надо фиксировать когда оно коснёться верхнего края окна браузера при прокрутке">
			<form class="btn-group btn-toggle-one-color centermenu" data-toggle="buttons">
        		<label class="btn btn-default active" data-btn-color="default">
        			<input type="radio" name="fixed" value="none" checked="checked" />false
        		</label>
        		<label class="btn btn-default" data-btn-color="success">
        			<input type="radio" name="fixed" value="true" />true
        		</label>
        	</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Скроллинг к блоку при клике</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Скроллинг к блоку с определённым id при клике на пункт меню с ссылкой якорем в которой href='#id'">
			<form class="btn-group btn-toggle-one-color centermenu" data-toggle="buttons">
        		<label class="btn btn-default" data-btn-color="default">
        			<input type="radio" name="scroll_target" value="false" />false
        		</label>
        		<label class="btn btn-success active" data-btn-color="success">
        			<input type="radio" name="scroll_target" value="true" checked="checked" />true
        		</label>
        	</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Добавлять пунктам класс active при прокрутке</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Добавлять пунктам класс active при прокрутке к определённому блоку в котором id указавает на пункт с соответствующей ссылкой якорем">
			<form class="btn-group btn-toggle-one-color centermenu" data-toggle="buttons">
        		<label class="btn btn-default" data-btn-color="default">
        			<input type="radio" name="active_from_target" value="false" />false
        		</label>
        		<label class="btn btn-success active" data-btn-color="success">
        			<input type="radio" name="active_from_target" value="true" checked="checked" />true
        		</label>
        	</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Плашка которая ездит по пунктам при прокрутке</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Плашка которая ездит по пунктам при прокрутке. Плашка находиться под тем пуктом в котором ссылка якорь соответствует тому блоку к торому вы прокрутили">
			<form class="btn-group btn-toggle-one-color centermenu" data-toggle="buttons">
        		<label class="btn btn-default active" data-btn-color="default">
        			<input type="radio" name="slider" value="none" checked="checked" />false
        		</label>
        		<label class="btn btn-default" data-btn-color="success">
        			<input type="radio" name="slider" value="true" />true
        		</label>
        	</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>menuWrap</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title='Селектор для метода "closest" если первым элементом будет само меню то сработает метод parent( "*" )'>
			<input name="menu_wrap" type="text" class="form-control" placeholder='"div"'>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>menuItems</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Элементы меню первого уровня вложенности">
			<input name="menu_items" type="text" class="form-control" placeholder='" li:not(li li)"'>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>selectWidthMenuItems</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Именно те элементы которым надо увеличивать ширину чтобы меню растянулось на всю ширину. Этот селектор нужен для тех случаев когда некоторые пункты меню имеют фикс. ширину и их трогать ненадо, это селектор указывает на те пункты которые трогать можно...">
			<input name="select_width_menu_items" type="text" class="form-control" placeholder='" li:not(li li)"'>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>menuItemsAndSubMenu</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Все элементы меню">
			<input name="menu_items_and_sub_menu" type="text" class="form-control" placeholder='" li"'>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>widthFactor</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Если меню адаптивное и в зависимости от разрешения надо делать его в несколько строк, то можете использовать этот параметр, пока что алгорит неидеальный - количество строк в результате может получиться больше чем этот параметр">
			<input name="width_factor" type="text" class="form-control" placeholder='1'>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>duration</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Время анимации прокрутки к целевому блоку при клике по пункту меню">
			<input name="duration" type="text" class="form-control" placeholder='1000'>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>easing</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Формула анимации">
			<select class="selectpicker" data-width="100%" data-zapros="full_js">
				<option name="easing" value="linear">linear</option>
				<option name="easing" value="swing" selected="selected">swing</option>
				<option name="easing" value="easeInQuad">easeInQuad</option>
				<option name="easing" value="easeOutQuad">easeOutQuad</option>
				<option name="easing" value="easeInOutQuad">easeInOutQuad</option>
				<option name="easing" value="easeInCubic">easeInCubic</option>
				<option name="easing" value="easeOutCubic">easeOutCubic</option>
				<option name="easing" value="easeInOutCubic">easeInOutCubic</option>
				<option name="easing" value="easeInQuart">easeInQuart</option>
				<option name="easing" value="easeOutQuart">easeOutQuart</option>
				<option name="easing" value="easeInOutQuart">easeInOutQuart</option>
				<option name="easing" value="easeInQuint">easeInQuint</option>
				<option name="easing" value="easeOutQuint">easeOutQuint</option>
				<option name="easing" value="easeInOutQuint">easeInOutQuint</option>
				<option name="easing" value="easeInExpo">easeInExpo</option>
				<option name="easing" value="easeOutExpo">easeOutExpo</option>
				<option name="easing" value="easeInOutExpo">easeInOutExpo</option>
				<option name="easing" value="easeInSine">easeInSine</option>
				<option name="easing" value="easeOutSine">easeOutSine</option>
				<option name="easing" value="easeInOutSine">easeInOutSine</option>
				<option name="easing" value="easeInCirc">easeInCirc</option>
				<option name="easing" value="easeOutCirc">easeOutCirc</option>
				<option name="easing" value="easeInOutCirc">easeInOutCirc</option>
				<option name="easing" value="easeInElastic">easeInElastic</option>
				<option name="easing" value="easeOutElastic">easeOutElastic</option>
				<option name="easing" value="easeInOutElastic">easeInOutElastic</option>
				<option name="easing" value="easeInBack">easeInBack</option>
				<option name="easing" value="easeOutBack">easeOutBack</option>
				<option name="easing" value="easeInOutBack">easeInOutBack</option>
				<option name="easing" value="easeInBounce">easeInBounce</option>
				<option name="easing" value="easeOutBounce">easeOutBounce</option>
				<option name="easing" value="easeInOutBounce">easeInOutBounce</option>
			</select>
			<a class="btn btn-link" href="http://api.jqueryui.com/easings/" target="_blank">Easings (типы анимаций jQuery)</a>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>accountingMenuHeight</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Учитывать высоту меню при анимации прокрутки к нужному блоку, так чтобы заголовок незалазил под меню. можно передать true, число, или функцию которая будет возращать число">
            <select class="selectpicker db-selected">
				<option name="accounting_menu_height" value="default" selected="selected">def: true</option>
				<option name="accounting_menu_height" value="false">false</option>
				<option name="accounting_menu_height" value="number">число</option>
				<option name="accounting_menu_height" value="function">Функция</option>
			</select>
            <input name="accounting_menu_height_num" type="text" class="form-control number" placeholder='Число' style="margin-top: 5px; display: none;">
			<div class="option-editor function" data-name="accounting_menu_height_fn" data-mode="javascript" data-validate=".+" style="margin-top: 5px; display: none;"></div>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>deleteClassActiveNoFocusTargetsBlock</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Удалять класс active если в видимой части экрана браузера нету ниодного блока на который бы ссылалась хотябы одна ссылка якорь из этого меню">
			<form class="btn-group btn-toggle-one-color" data-toggle="buttons">
        		<label class="btn btn-default active" data-btn-color="default">
        			<input type="radio" name="delete_class_active_no_focus_targets_block" value="none" checked="checked" />false
        		</label>
        		<label class="btn btn-default" data-btn-color="success">
        			<input type="radio" name="delete_class_active_no_focus_targets_block" value="true" />true
        		</label>
        	</form>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>vertical</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Если меню вертикальное поставить true">
			<form class="btn-group btn-toggle-one-color" data-toggle="buttons">
        		<label class="btn btn-default active" data-btn-color="default">
        			<input type="radio" name="vertical" value="none" checked="checked" />false
        		</label>
        		<label class="btn btn-default" data-btn-color="success">
        			<input type="radio" name="vertical" value="true" />true
        		</label>
        	</form>
		</div>
	</div>
    <h2>Настройки <small>css</small></h2>
	<hr />
    <div class="row">
        <div class="col-xs-6">
			<h4>Кастомные стили</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Если дефолтные стили в плагине неустраивают можете перебить своими">
			<form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
        		<label class="btn btn-default active" data-btn-color="default">
        			<input type="radio" name="custom_css" value="none" checked="checked" />Нет
        		</label>
        		<label class="btn btn-default" data-btn-color="success">
        			<input type="radio" name="custom_css" value="custom_css" />Да
        		</label>
        	</form>
            <div class="option-editor custom_css" data-name="custom_css_code" data-mode="css" data-validate=".+" data-rows="22" style="margin-top: 5px; display: none;"></div>
		</div>
	</div>
    <h2>Дополнения</h2>
	<hr />
	<h2>Контент</h2>
	<hr />
</div>
<?php echo '<datatext name="accounting_menu_height_fn">'; ?>
function(g)
{
    var res = 0;
    g.containers.each(function(){
		res += $(this).outerHeight();
	});
    return res;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="custom_css_code">'; ?>
.bmc__fixed {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 1001;
}

.bmc__slider {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 5px;
    background-color: orange;
}

.bmc__slider_vertical {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    background-color: orange;
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