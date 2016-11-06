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
			<h4>Активный пункт</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="active" type="text" class="form-control" placeholder="'n|-n|false' def:0" data-validate="\d*" data-zapros="active" data-placement="bottom" data-toggle="popover" title="Значение" data-content="Положительное от 0, если отрицательное отсчёт идёт от последней вкладки в обратном направлении. Если установить false то скрытыми будут все пункты - но такое возможно если опция collapsible: true">
			</form>
		</div>
	</div>
	<div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Схлопывание пунктов</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="При повторном клике по активной вкладке она закрываеться и получаеться что все вкладки могут быть одно временно закрытыми">
			<form class="btn-group btn-toggle-one-color" data-toggle="buttons" data-zapros="full_js">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="collapsible" value="none" checked="checked" />Нет (def:false)
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="collapsible" value="true" />true
				</label>
			</form>
		</div>
	</div>
	<div class="row" style="margin-top: 15px;">
		<div class="col-xs-6">
			<h4>Отключение табов</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Табы не пропадают, а просто перестают реагировать">
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
			<h4>Событие вызывающее активацию</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="false - без анимации, число - время анимации, строка - тип анимации, Объект - тип(duration) и время(easing) анимаци + можно вставить свойство down и передать тоже обьект с duration и easing, эта анимация down будет срабатывать при активации вкладки с меньшим индексом чем текущая активная вкладка т.е. при активации одной из предыдущих вкладок.">
			<select class="selectpicker db-selected" data-width="100%" data-zapros="event">
				<option name="event" value="none" selected="selected">Default:click</option>
				<option name="event" value="other">Свой вариант</option>
				<option name="event" value="click">click</option>
				<option name="event" value="contextmenu">contextmenu</option>
				<option name="event" value="dblclick">dblclick</option>
				<option name="event" value="hover">hover</option>
				<option name="event" value="mousedown">mousedown</option>
				<option name="event" value="mouseenter">mouseenter</option>
				<option name="event" value="mouseleave">mouseleave</option>
				<option name="event" value="mousemove">mousemove</option>
				<option name="event" value="mouseout">mouseout</option>
				<option name="event" value="mouseover">mouseover</option>
				<option name="event" value="mouseup">mouseup</option>
			</select>
			<a class="btn btn-link" href="https://api.jquery.com/category/events/mouse-events/" target="_blank">События мыши jQuery</a>
			<div class="other" style="display: none; margin-top: 5px;">
				<input class="form-control" name="event_other" placeholder="Событие" style="margin-top: 5px;"/>
			</div>
		</div>
    </div>
	<div class="row">
        <div class="col-xs-6">
			<h4>Высота контента</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="'auto' - по максимально высокому контенту, 'fill' - по высоте контейнера, 'content' - по контенту">
			<select class="selectpicker" data-width="100%" data-zapros="full_js">
				<option name="heightStyle" value="none" selected="selected">Default:content</option>
				<option name="heightStyle" value="auto">auto</option>
				<option name="heightStyle" value="fill">fill</option>
				<option name="heightStyle" value="content">content</option>
			</select>
		</div>
    </div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Анимация сокрытия</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="false - без анимации, число - время анимации, строка - эффект анимации, Объект - эффект(effect), задержка перед анимацией(delay), продолжительность(duration) и тип анимации(easing) + можно вставить в еффект имя метода для эффектов анимации и вставить свойства(опции) которые передадуться етому методу">
			<select class="selectpicker db-selected" data-width="100%" data-zapros="full_js">
				<option name="animate" value="none" selected="selected">Default</option>
				<option name="animate" value="false">false (без анимации)</option>
				<option name="animate" value="time">Время</option>
				<option name="animate" value="effect">Эффект анимации</option>
				<option name="animate" value="object">Обьект</option>
			</select>
			<input type="text" class="time form-control" name="animate_time" placeholder="миллисекунды" style="display: none; margin-top: 5px;" data-zapros="full_js"/>
			<div class="effect" style="display: none; margin-top: 5px;">
				<select class="selectpicker" data-width="100%" data-zapros="full_js">
                    <option name="animate_effect" value="blind">Blind</option>
                	<option name="animate_effect" value="bounce">Bounce</option>
                	<option name="animate_effect" value="clip">Clip</option>
                	<option name="animate_effect" value="drop">Drop</option>
                	<option name="animate_effect" value="explode">Explode</option>
                	<option name="animate_effect" value="fade" selected="selected">Fade</option>
                	<option name="animate_effect" value="fold">Fold</option>
                	<option name="animate_effect" value="highlight">Highlight</option>
                	<option name="animate_effect" value="puff">Puff</option>
                	<option name="animate_effect" value="pulsate">Pulsate</option>
                	<option name="animate_effect" value="scale">Scale</option>
                	<option name="animate_effect" value="shake">Shake</option>
                	<option name="animate_effect" value="size">Size</option>
                	<option name="animate_effect" value="slide">Slide</option>
                	<option name="animate_effect" value="transfer">Transfer</option>
				</select>
				<a class="btn btn-link" href="http://api.jqueryui.com/category/effects/" target="_blank">Методы эффектов jQuery</a>
                <a class="btn btn-link" href="http://jqueryui.com/effect/" target="_blank">Effects (типы эффектов jQuery)</a>
			</div>
			<div class="object" style="display: none; margin-top: 5px;">
                <select class="selectpicker" data-width="100%" data-zapros="full_js">
                    <option name="animate_effect_obj" value="blind">Blind</option>
                	<option name="animate_effect_obj" value="bounce">Bounce</option>
                	<option name="animate_effect_obj" value="clip">Clip</option>
                	<option name="animate_effect_obj" value="drop">Drop</option>
                	<option name="animate_effect_obj" value="explode">Explode</option>
                	<option name="animate_effect_obj" value="fade" selected="selected">Fade</option>
                	<option name="animate_effect_obj" value="fold">Fold</option>
                	<option name="animate_effect_obj" value="highlight">Highlight</option>
                	<option name="animate_effect_obj" value="puff">Puff</option>
                	<option name="animate_effect_obj" value="pulsate">Pulsate</option>
                	<option name="animate_effect_obj" value="scale">Scale</option>
                	<option name="animate_effect_obj" value="shake">Shake</option>
                	<option name="animate_effect_obj" value="size">Size</option>
                	<option name="animate_effect_obj" value="slide">Slide</option>
                	<option name="animate_effect_obj" value="transfer">Transfer</option>
				</select>
                <input type="text" class="form-control" name="animate_delay_obj" placeholder="миллисекунды" style="margin-bottom: 5px; margin-top: 5px;" data-zapros="full_js"/>
				<input type="text" class="form-control" name="animate_time_obj" placeholder="миллисекунды" style="margin-bottom: 5px;" data-zapros="full_js"/>
				<select class="selectpicker" data-width="100%" data-zapros="full_js">
					<option name="animate_type_obj" value="linear" selected="selected">linear</option>
					<option name="animate_type_obj" value="swing">swing</option>
					<option name="animate_type_obj" value="easeInQuad">easeInQuad</option>
					<option name="animate_type_obj" value="easeOutQuad">easeOutQuad</option>
					<option name="animate_type_obj" value="easeInOutQuad">easeInOutQuad</option>
					<option name="animate_type_obj" value="easeInCubic">easeInCubic</option>
					<option name="animate_type_obj" value="easeOutCubic">easeOutCubic</option>
					<option name="animate_type_obj" value="easeInOutCubic">easeInOutCubic</option>
					<option name="animate_type_obj" value="easeInQuart">easeInQuart</option>
					<option name="animate_type_obj" value="easeOutQuart">easeOutQuart</option>
					<option name="animate_type_obj" value="easeInOutQuart">easeInOutQuart</option>
					<option name="animate_type_obj" value="easeInQuint">easeInQuint</option>
					<option name="animate_type_obj" value="easeOutQuint">easeOutQuint</option>
					<option name="animate_type_obj" value="easeInOutQuint">easeInOutQuint</option>
					<option name="animate_type_obj" value="easeInExpo">easeInExpo</option>
					<option name="animate_type_obj" value="easeOutExpo">easeOutExpo</option>
					<option name="animate_type_obj" value="easeInOutExpo">easeInOutExpo</option>
					<option name="animate_type_obj" value="easeInSine">easeInSine</option>
					<option name="animate_type_obj" value="easeOutSine">easeOutSine</option>
					<option name="animate_type_obj" value="easeInOutSine">easeInOutSine</option>
					<option name="animate_type_obj" value="easeInCirc">easeInCirc</option>
					<option name="animate_type_obj" value="easeOutCirc">easeOutCirc</option>
					<option name="animate_type_obj" value="easeInOutCirc">easeInOutCirc</option>
					<option name="animate_type_obj" value="easeInElastic">easeInElastic</option>
					<option name="animate_type_obj" value="easeOutElastic">easeOutElastic</option>
					<option name="animate_type_obj" value="easeInOutElastic">easeInOutElastic</option>
					<option name="animate_type_obj" value="easeInBack">easeInBack</option>
					<option name="animate_type_obj" value="easeOutBack">easeOutBack</option>
					<option name="animate_type_obj" value="easeInOutBack">easeInOutBack</option>
					<option name="animate_type_obj" value="easeInBounce">easeInBounce</option>
					<option name="animate_type_obj" value="easeOutBounce">easeOutBounce</option>
					<option name="animate_type_obj" value="easeInOutBounce">easeInOutBounce</option>
				</select>
                <a class="btn btn-link" href="http://api.jqueryui.com/category/effects/" target="_blank">Методы эффектов jQuery</a>
                <a class="btn btn-link" href="http://jqueryui.com/effect/" target="_blank">Effects (типы эффектов jQuery)</a>
				<a class="btn btn-link" href="http://api.jqueryui.com/easings/" target="_blank">Easings (типы анимаций jQuery)</a>
			</div>
		</div>
    </div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Анимация раскрытия</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="false - без анимации, число - время анимации, строка - эффект анимации, Объект - эффект(effect), задержка перед анимацией(delay), продолжительность(duration) и тип анимации(easing) + можно вставить в еффект имя метода для эффектов анимации и вставить свойства(опции) которые передадуться етому методу">
			<select class="selectpicker db-selected" data-width="100%" data-zapros="full_js">
				<option name="animate_show" value="none" selected="selected">Default</option>
				<option name="animate_show" value="false">false (без анимации)</option>
				<option name="animate_show" value="time">Время</option>
				<option name="animate_show" value="effect">Эффект анимации</option>
				<option name="animate_show" value="object">Обьект</option>
			</select>
			<input type="text" class="time form-control" name="animate_show_time" placeholder="миллисекунды" style="display: none; margin-top: 5px;" data-zapros="full_js"/>
			<div class="effect" style="display: none; margin-top: 5px;">
				<select class="selectpicker" data-width="100%" data-zapros="full_js">
                    <option name="animate_show_effect" value="blind">Blind</option>
                	<option name="animate_show_effect" value="bounce">Bounce</option>
                	<option name="animate_show_effect" value="clip">Clip</option>
                	<option name="animate_show_effect" value="drop">Drop</option>
                	<option name="animate_show_effect" value="explode">Explode</option>
                	<option name="animate_show_effect" value="fade" selected="selected">Fade</option>
                	<option name="animate_show_effect" value="fold">Fold</option>
                	<option name="animate_show_effect" value="highlight">Highlight</option>
                	<option name="animate_show_effect" value="puff">Puff</option>
                	<option name="animate_show_effect" value="pulsate">Pulsate</option>
                	<option name="animate_show_effect" value="scale">Scale</option>
                	<option name="animate_show_effect" value="shake">Shake</option>
                	<option name="animate_show_effect" value="size">Size</option>
                	<option name="animate_show_effect" value="slide">Slide</option>
                	<option name="animate_show_effect" value="transfer">Transfer</option>
				</select>
				<a class="btn btn-link" href="http://api.jqueryui.com/category/effects/" target="_blank">Методы эффектов jQuery</a>
                <a class="btn btn-link" href="http://jqueryui.com/effect/" target="_blank">Effects (типы эффектов jQuery)</a>
			</div>
			<div class="object" style="display: none; margin-top: 5px;">
                <select class="selectpicker" data-width="100%" data-zapros="full_js">
                    <option name="animate_show_effect_obj" value="blind">Blind</option>
                	<option name="animate_show_effect_obj" value="bounce">Bounce</option>
                	<option name="animate_show_effect_obj" value="clip">Clip</option>
                	<option name="animate_show_effect_obj" value="drop">Drop</option>
                	<option name="animate_show_effect_obj" value="explode">Explode</option>
                	<option name="animate_show_effect_obj" value="fade" selected="selected">Fade</option>
                	<option name="animate_show_effect_obj" value="fold">Fold</option>
                	<option name="animate_show_effect_obj" value="highlight">Highlight</option>
                	<option name="animate_show_effect_obj" value="puff">Puff</option>
                	<option name="animate_show_effect_obj" value="pulsate">Pulsate</option>
                	<option name="animate_show_effect_obj" value="scale">Scale</option>
                	<option name="animate_show_effect_obj" value="shake">Shake</option>
                	<option name="animate_show_effect_obj" value="size">Size</option>
                	<option name="animate_show_effect_obj" value="slide">Slide</option>
                	<option name="animate_show_effect_obj" value="transfer">Transfer</option>
				</select>
                <input type="text" class="form-control" name="animate_show_delay_obj" placeholder="Задержка (миллисекунды)" style="margin-bottom: 5px; margin-top: 5px;" data-zapros="full_js"/>
				<input type="text" class="form-control" name="animate_show_time_obj" placeholder="Продолжительность (миллисекунды)" style="margin-bottom: 5px;" data-zapros="full_js"/>
				<select class="selectpicker" data-width="100%" data-zapros="full_js">
					<option name="animate_show_type_obj" value="linear" selected="selected">linear</option>
					<option name="animate_show_type_obj" value="swing">swing</option>
					<option name="animate_show_type_obj" value="easeInQuad">easeInQuad</option>
					<option name="animate_show_type_obj" value="easeOutQuad">easeOutQuad</option>
					<option name="animate_show_type_obj" value="easeInOutQuad">easeInOutQuad</option>
					<option name="animate_show_type_obj" value="easeInCubic">easeInCubic</option>
					<option name="animate_show_type_obj" value="easeOutCubic">easeOutCubic</option>
					<option name="animate_show_type_obj" value="easeInOutCubic">easeInOutCubic</option>
					<option name="animate_show_type_obj" value="easeInQuart">easeInQuart</option>
					<option name="animate_show_type_obj" value="easeOutQuart">easeOutQuart</option>
					<option name="animate_show_type_obj" value="easeInOutQuart">easeInOutQuart</option>
					<option name="animate_show_type_obj" value="easeInQuint">easeInQuint</option>
					<option name="animate_show_type_obj" value="easeOutQuint">easeOutQuint</option>
					<option name="animate_show_type_obj" value="easeInOutQuint">easeInOutQuint</option>
					<option name="animate_show_type_obj" value="easeInExpo">easeInExpo</option>
					<option name="animate_show_type_obj" value="easeOutExpo">easeOutExpo</option>
					<option name="animate_show_type_obj" value="easeInOutExpo">easeInOutExpo</option>
					<option name="animate_show_type_obj" value="easeInSine">easeInSine</option>
					<option name="animate_show_type_obj" value="easeOutSine">easeOutSine</option>
					<option name="animate_show_type_obj" value="easeInOutSine">easeInOutSine</option>
					<option name="animate_show_type_obj" value="easeInCirc">easeInCirc</option>
					<option name="animate_show_type_obj" value="easeOutCirc">easeOutCirc</option>
					<option name="animate_show_type_obj" value="easeInOutCirc">easeInOutCirc</option>
					<option name="animate_show_type_obj" value="easeInElastic">easeInElastic</option>
					<option name="animate_show_type_obj" value="easeOutElastic">easeOutElastic</option>
					<option name="animate_show_type_obj" value="easeInOutElastic">easeInOutElastic</option>
					<option name="animate_show_type_obj" value="easeInBack">easeInBack</option>
					<option name="animate_show_type_obj" value="easeOutBack">easeOutBack</option>
					<option name="animate_show_type_obj" value="easeInOutBack">easeInOutBack</option>
					<option name="animate_show_type_obj" value="easeInBounce">easeInBounce</option>
					<option name="animate_show_type_obj" value="easeOutBounce">easeOutBounce</option>
					<option name="animate_show_type_obj" value="easeInOutBounce">easeInOutBounce</option>
				</select>
                <a class="btn btn-link" href="http://api.jqueryui.com/category/effects/" target="_blank">Методы эффектов jQuery</a>
                <a class="btn btn-link" href="http://jqueryui.com/effect/" target="_blank">Effects (типы эффектов jQuery)</a>
				<a class="btn btn-link" href="http://api.jqueryui.com/easings/" target="_blank">Easings (типы анимаций jQuery)</a>
			</div>
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
			<h4>Заголовки</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="headers_reset" value="headers_no_reset" checked="checked" />Нет
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="headers_reset" value="headers_reset" />Обнулить
				</label>
			</form>
			<div class="headers_no_reset" style="margin-top: 5px;">
				<div class="option-editor" data-name="headers_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
			<div class="headers_reset" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="headers_css_reset" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
		</div>
    </div>
	<div class="row" style="margin-top: 15px;">
        <div class="col-xs-6">
			<h4>Контент</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color db-selected" data-toggle="buttons">
				<label class="btn btn-default active" data-btn-color="default">
					<input type="radio" name="content_reset" value="content_no_reset" checked="checked" />Нет
				</label>
				<label class="btn btn-default" data-btn-color="success">
					<input type="radio" name="content_reset" value="content_reset" />Обнулить
				</label>
			</form>
			<div class="content_no_reset" style="margin-top: 5px;">
				<div class="option-editor" data-name="content_css" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
			<div class="content_reset" style="display: none; margin-top: 5px;">
				<div class="option-editor" data-name="content_css_reset" data-mode="css" data-max-rows="20" data-validate="" data-zapros="css"></div>
			</div>
		</div>
    </div>
	<h2>Дополнения</h2>
	<hr />
	<h2>Контент</h2>
	<hr />
	<div class="row">
        <div class="col-xs-6 form-group count-puncts db-repeat" data-item-class="accordion-content">
			<label>Количество пунктов</label>
			<div class="input-group">
				<input name="content_count" type="text" maxlength="2" class="form-control" placeholder="Введите число от 1 до 99" data-validate="^([1-9]\d?)$"/>
				<div class="input-group-btn">
					<button class="btn btn-default db-generate">
						GO
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="row accordion-content" style="display: none; margin-top: 15px;">
		<div class="col-xs-6">
			<input name="zagolovok" type="text" class="form-control" placeholder="Заголовок" data-instant-update="yes" data-validate=".+" data-zapros="change-content">
		</div>
        <div class="col-xs-6">
            <input name="id_tab" type="text" class="form-control" placeholder="Идентификатор таба" data-instant-update="yes" data-validate=".+" data-zapros="change-content">
		</div>
		<div class="col-xs-12" style="margin-top: 5px;">
			<div class="option-editor" data-name="content" data-mode="html" data-validate=".+" data-zapros="change-content"></div>
		</div>
	</div>
</div>
<?php echo '<datatext name="content">'; ?>
<p>Контент</p>
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="container_css">'; ?>
&.ui-corner-all {
    border-radius: 4px;
}

&.ui-widget-content {
    border: 1px solid #aaaaaa;
    background: #ffffff url("images/ui-bg_flat_75_ffffff_40x100.png") 50% 50% repeat-x;
    color: #222222;
}
&.ui-tabs {
    position: relative;
    padding: .2em;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="container_css_reset">'; ?>
&.ui-corner-all {
    border-radius: 0;
}

&.ui-widget-content {
    border: none;
    background: #fff;
    color: #222222;
}
&.ui-tabs {
    position: relative;
    padding: 0;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="headers_css">'; ?>
> .ui-tabs-nav {
    margin: 0;
    padding: .2em .2em 0;
}

> .ui-corner-all {
    border-radius: 4px;
}

> .ui-widget-header {
    border: 1px solid #aaaaaa;
    background: #cccccc url("images/ui-bg_highlight-soft_75_cccccc_1x100.png") 50% 50% repeat-x;
    color: #222222;
    font-weight: bold;
}

> .ui-helper-clearfix:before,
> .ui-helper-clearfix:after {
    content: "";
    display: table;
    border-collapse: collapse;
}

> .ui-helper-clearfix:after {
    clear: both;
}

> .ui-tabs-nav li {
    list-style: none;
    float: left;
    position: relative;
    top: 0;
    margin: 1px .2em 0 0;
    border-bottom-width: 0;
    padding: 0;
    white-space: nowrap;
}

> .ui-tabs-nav .ui-state-default {
    border: 1px solid #d3d3d3;
    background: #e6e6e6 url("images/ui-bg_glass_75_e6e6e6_1x400.png") 50% 50% repeat-x;
    font-weight: normal;
    color: #555555;
}

> .ui-tabs-nav .ui-corner-top {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
}


> .ui-tabs-nav .ui-tabs-anchor {
    float: left;
    padding: .5em 1em;
    text-decoration: none;
}

> .ui-widget-header .ui-state-hover,
> .ui-widget-header .ui-state-focus {
	border: 1px solid #999999;
	background: #dadada url("images/ui-bg_glass_75_dadada_1x400.png") 50% 50% repeat-x;
	font-weight: normal;
	color: #212121;
}

> .ui-tabs-nav li.ui-tabs-active {
    margin-bottom: -1px;
    padding-bottom: 1px;
}
> .ui-widget-header .ui-state-active {
	border: 1px solid #aaaaaa;
	background: #ffffff url("images/ui-bg_glass_65_ffffff_1x400.png") 50% 50% repeat-x;
	font-weight: normal;
	color: #212121;
}

> .ui-tabs-nav .ui-state-default a,
> .ui-tabs-nav .ui-state-default a:link,
> .ui-tabs-nav .ui-state-default a:visited {
    color: #555555;
    text-decoration: none;
}

> .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor {
    cursor: text;
}
> .ui-tabs-nav .ui-state-hover a,
> .ui-tabs-nav .ui-state-hover a:hover,
> .ui-tabs-nav .ui-state-hover a:link,
> .ui-tabs-nav .ui-state-hover a:visited,
> .ui-tabs-nav .ui-state-focus a,
> .ui-tabs-nav .ui-state-focus a:hover,
> .ui-tabs-nav .ui-state-focus a:link,
> .ui-tabs-nav .ui-state-focus a:visited {
	color: #212121;
	text-decoration: none;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="headers_css_reset">'; ?>
> .ui-tabs-nav {
    margin: 0;
    padding: 0;
}

> .ui-corner-all {
    border-radius: 0;
}

> .ui-widget-header {
    border: none;
    background: #fff;
    color: #000;
    font-weight: normal;
}

> .ui-helper-clearfix:before,
> .ui-helper-clearfix:after {
    content: "";
    display: table;
    border-collapse: collapse;
}

> .ui-helper-clearfix:after {
    clear: both;
}

> .ui-tabs-nav li {
    list-style: none;
    float: left;
    position: relative;
    top: 0;
    margin: 0;
    border-bottom-width: 0;
    padding: 0;
    white-space: nowrap;
}

> .ui-tabs-nav .ui-state-default {
    border: none;
    background: #fff;
    font-weight: normal;
    color: #000;
}

> .ui-tabs-nav .ui-corner-top {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
}


> .ui-tabs-nav .ui-tabs-anchor {
    float: left;
    padding: 0;
    text-decoration: none;
}

> .ui-widget-header .ui-state-hover,
> .ui-widget-header .ui-state-focus {
	border: none;
	background: #fff;
	font-weight: normal;
	color: #000;
}

> .ui-tabs-nav li.ui-tabs-active {
    margin-bottom: -1px;
    padding-bottom: 1px;
}
> .ui-widget-header .ui-state-active {
	border: none;
	background: #fff;
	font-weight: normal;
	color: #000;
}

> .ui-tabs-nav .ui-state-default a,
> .ui-tabs-nav .ui-state-default a:link,
> .ui-tabs-nav .ui-state-default a:visited {
    color: #000;
    text-decoration: none;
}

> .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor {
    cursor: default;
}
> .ui-tabs-nav .ui-state-hover a,
> .ui-tabs-nav .ui-state-hover a:hover,
> .ui-tabs-nav .ui-state-hover a:link,
> .ui-tabs-nav .ui-state-hover a:visited,
> .ui-tabs-nav .ui-state-focus a,
> .ui-tabs-nav .ui-state-focus a:hover,
> .ui-tabs-nav .ui-state-focus a:link,
> .ui-tabs-nav .ui-state-focus a:visited {
	color: #000;
	text-decoration: none;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="content_css">'; ?>
> .ui-tabs-panel {
    display: block;
    border-width: 0;
    padding: 1em 1.4em;
    background: none;
}

> .ui-corner-bottom {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}

> .ui-widget-content {
    border: 1px solid #aaaaaa;
    background: #ffffff url("images/ui-bg_flat_75_ffffff_40x100.png") 50% 50% repeat-x;
    color: #222222;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="content_css_reset">'; ?>
> .ui-tabs-panel {
    display: block;
    border-width: 0;
    padding: 0;
    background: #fff;
}

> .ui-corner-bottom {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

> .ui-widget-content {
    border: none;
    background: #fff;
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