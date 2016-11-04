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
			<h4>Название аккордеона</h4>
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
			<h4>id или class аккордеона</h4>
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
	<div class="row">
        <div class="col-xs-6">
			<h4>Анимация</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="false - без анимации, число - время анимации, строка - тип анимации, Объект - тип(easing) и время(duration) анимаци + можно вставить свойство down и передать тоже обьект с duration и easing, эта анимация down будет срабатывать при активации вкладки с меньшим индексом чем текущая активная вкладка т.е. при активации одной из предыдущих вкладок.">
			<select class="selectpicker db-selected" data-width="100%" data-zapros="full_js">
				<option name="animate" value="none" selected="selected">Default</option>
				<option name="animate" value="false">false (без анимации)</option>
				<option name="animate" value="time">Время</option>
				<option name="animate" value="type">Тип анимации</option>
				<option name="animate" value="object">Обьект</option>
			</select>
			<input type="text" class="time form-control" name="animate_time" placeholder="миллисекунды" style="display: none; margin-top: 5px;" data-zapros="full_js"/>
			<div class="type" style="display: none; margin-top: 5px;">
				<select class="selectpicker" data-width="100%" data-zapros="full_js">
					<option name="animate_type" value="linear" selected="selected">linear</option>
					<option name="animate_type" value="swing">swing</option>
					<option name="animate_type" value="easeInQuad">easeInQuad</option>
					<option name="animate_type" value="easeOutQuad">easeOutQuad</option>
					<option name="animate_type" value="easeInOutQuad">easeInOutQuad</option>
					<option name="animate_type" value="easeInCubic">easeInCubic</option>
					<option name="animate_type" value="easeOutCubic">easeOutCubic</option>
					<option name="animate_type" value="easeInOutCubic">easeInOutCubic</option>
					<option name="animate_type" value="easeInQuart">easeInQuart</option>
					<option name="animate_type" value="easeOutQuart">easeOutQuart</option>
					<option name="animate_type" value="easeInOutQuart">easeInOutQuart</option>
					<option name="animate_type" value="easeInQuint">easeInQuint</option>
					<option name="animate_type" value="easeOutQuint">easeOutQuint</option>
					<option name="animate_type" value="easeInOutQuint">easeInOutQuint</option>
					<option name="animate_type" value="easeInExpo">easeInExpo</option>
					<option name="animate_type" value="easeOutExpo">easeOutExpo</option>
					<option name="animate_type" value="easeInOutExpo">easeInOutExpo</option>
					<option name="animate_type" value="easeInSine">easeInSine</option>
					<option name="animate_type" value="easeOutSine">easeOutSine</option>
					<option name="animate_type" value="easeInOutSine">easeInOutSine</option>
					<option name="animate_type" value="easeInCirc">easeInCirc</option>
					<option name="animate_type" value="easeOutCirc">easeOutCirc</option>
					<option name="animate_type" value="easeInOutCirc">easeInOutCirc</option>
					<option name="animate_type" value="easeInElastic">easeInElastic</option>
					<option name="animate_type" value="easeOutElastic">easeOutElastic</option>
					<option name="animate_type" value="easeInOutElastic">easeInOutElastic</option>
					<option name="animate_type" value="easeInBack">easeInBack</option>
					<option name="animate_type" value="easeOutBack">easeOutBack</option>
					<option name="animate_type" value="easeInOutBack">easeInOutBack</option>
					<option name="animate_type" value="easeInBounce">easeInBounce</option>
					<option name="animate_type" value="easeOutBounce">easeOutBounce</option>
					<option name="animate_type" value="easeInOutBounce">easeInOutBounce</option>
				</select>
				<a class="btn btn-link" href="http://api.jqueryui.com/easings/" target="_blank">Easings (типы анимаций jQuery)</a>
			</div>
			<div class="object" style="display: none; margin-top: 5px;">
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
				<a class="btn btn-link" href="http://api.jqueryui.com/easings/" target="_blank">Easings (типы анимаций jQuery)</a>
				<h5><strong>Доп. анимация down</strong></h5>
				<form class="btn-group btn-toggle-one-color image-separate-active db-selected" data-toggle="buttons"style="margin-top: 5px;" data-zapros="full_js">
					<label class="btn btn-default active" data-btn-color="default">
						<input type="radio" name="down" value="none" checked="checked" />Нет
					</label>
					<label class="btn btn-default" data-btn-color="success">
						<input type="radio" name="down" value="down" />Да
					</label>
				</form>
				<div class="down" style="display: none; margin-top: 5px;">
					<input type="text" class="form-control" name="animate_time_down" placeholder="миллисекунды" style="margin-bottom: 5px;" data-zapros="full_js"/>
					<select class="selectpicker" data-width="100%" data-zapros="full_js">
						<option name="animate_type_down" value="linear" selected="selected">linear</option>
						<option name="animate_type_down" value="swing">swing</option>
						<option name="animate_type_down" value="easeInQuad">easeInQuad</option>
						<option name="animate_type_down" value="easeOutQuad">easeOutQuad</option>
						<option name="animate_type_down" value="easeInOutQuad">easeInOutQuad</option>
						<option name="animate_type_down" value="easeInCubic">easeInCubic</option>
						<option name="animate_type_down" value="easeOutCubic">easeOutCubic</option>
						<option name="animate_type_down" value="easeInOutCubic">easeInOutCubic</option>
						<option name="animate_type_down" value="easeInQuart">easeInQuart</option>
						<option name="animate_type_down" value="easeOutQuart">easeOutQuart</option>
						<option name="animate_type_down" value="easeInOutQuart">easeInOutQuart</option>
						<option name="animate_type_down" value="easeInQuint">easeInQuint</option>
						<option name="animate_type_down" value="easeOutQuint">easeOutQuint</option>
						<option name="animate_type_down" value="easeInOutQuint">easeInOutQuint</option>
						<option name="animate_type_down" value="easeInExpo">easeInExpo</option>
						<option name="animate_type_down" value="easeOutExpo">easeOutExpo</option>
						<option name="animate_type_down" value="easeInOutExpo">easeInOutExpo</option>
						<option name="animate_type_down" value="easeInSine">easeInSine</option>
						<option name="animate_type_down" value="easeOutSine">easeOutSine</option>
						<option name="animate_type_down" value="easeInOutSine">easeInOutSine</option>
						<option name="animate_type_down" value="easeInCirc">easeInCirc</option>
						<option name="animate_type_down" value="easeOutCirc">easeOutCirc</option>
						<option name="animate_type_down" value="easeInOutCirc">easeInOutCirc</option>
						<option name="animate_type_down" value="easeInElastic">easeInElastic</option>
						<option name="animate_type_down" value="easeOutElastic">easeOutElastic</option>
						<option name="animate_type_down" value="easeInOutElastic">easeInOutElastic</option>
						<option name="animate_type_down" value="easeInBack">easeInBack</option>
						<option name="animate_type_down" value="easeOutBack">easeOutBack</option>
						<option name="animate_type_down" value="easeInOutBack">easeInOutBack</option>
						<option name="animate_type_down" value="easeInBounce">easeInBounce</option>
						<option name="animate_type_down" value="easeOutBounce">easeOutBounce</option>
						<option name="animate_type_down" value="easeInOutBounce">easeInOutBounce</option>
					</select>
				</div>
			</div>
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
			<h4>Отключение аккордеона</h4>
		</div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="Аккордеон не пропадает, а просто перестаёт реагировать">
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
				<option name="event" value="click" selected="selected">Default:click</option>
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
	<div class="row" style="margin-top: 15px;">
        <div class="col-xs-6">
			<h4>Заголовки</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="header" type="text" class="form-control" placeholder="jQuery selector" data-zapros="full_js" data-placement="left" data-toggle="tooltip" title="Кнопки по которым кликаете чтобы открыть пункт аккордеона. def:> li > :first-child,> :not(li):even">
			</form>
		</div>
	</div>
	<div class="row">
        <div class="col-xs-6">
			<h4>Высота контента</h4>
        </div>
		<div class="col-xs-6" data-placement="left" data-toggle="tooltip" title="'auto' - по максимально высокому контенту, 'fill' - по высоте контейнера, 'content' - по контенту">
			<select class="selectpicker" data-width="100%" data-zapros="full_js">
				<option name="heightStyle" value="none" selected="selected">Default:auto</option>
				<option name="heightStyle" value="auto">auto</option>
				<option name="heightStyle" value="fill">fill</option>
				<option name="heightStyle" value="content">content</option>
			</select>
		</div>
    </div>
	<div class="row" style="margin-top: 15px;">
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
				<input name="icons_header" type="text" class="form-control" placeholder="Обычное" data-zapros="full_js">
				<input name="icons_activeHeader" type="text" class="form-control" placeholder="Активное" data-zapros="full_js" style="margin-top: 5px;">
				<a class="btn btn-link" href="http://api.jqueryui.com/theming/icons/" target="_blank">Иконки jQuery</a>
			</form>
			<form class="custom_font form-group" style="display: none; margin-top: 5px;" data-placement="left" data-toggle="tooltip" title="Классы двух иконок без служебных классов 'glyphicon' и 'fa' и без точки. Первая иконка обычное состояние вторая активное">
				<input name="custom_font_header" type="text" class="form-control" placeholder="Обычное" data-zapros="full_js">
				<input name="custom_font_activeHeader" type="text" class="form-control" placeholder="Активное" data-zapros="full_js" style="margin-top: 5px;">
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
			<div class="option-editor" data-name="container_css" data-mode="css" data-validate="" data-zapros="css"></div>
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
		<div class="col-xs-12">
			<div class="input-group">
				<span class="input-group-addon">-</span>
				<input name="zagolovok" type="text" class="form-control" placeholder="Заголовок" data-instant-update="yes" data-validate=".+" data-zapros="change-content">
			</div>
		</div>
		<div class="col-xs-12" style="margin-top: 5px;">
			<div class="option-editor" data-name="content" data-mode="html" data-validate=".+" data-zapros="change-content"></div>
		</div>
	</div>
</div>
<?php echo '<datatext name="content">'; ?>
<p>Контент</p>
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="custom_image">'; ?>
left: .5em;
top: 50%;
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="headers_css">'; ?>
> .ui-accordion-header {
    display: block;
    cursor: pointer;
    position: relative;
    margin: 2px 0 0 0;
    padding: .5em .5em .5em .7em;
    min-height: 0;
    /* support: IE7; */
    font-size: 100%;
}

> .ui-state-default {
    border: 1px solid #d3d3d3;
    background: #e6e6e6 url("images/ui-bg_glass_75_e6e6e6_1x400.png") 50% 50% repeat-x;
    font-weight: normal;
    color: #555555;
}

> .ui-state-hover,
> .ui-state-focus {
	border: 1px solid #999999;
	background: #dadada url("images/ui-bg_glass_75_dadada_1x400.png") 50% 50% repeat-x;
	font-weight: normal;
	color: #212121;
}

> .ui-state-active {
	border: 1px solid #aaaaaa;
	background: #ffffff url("images/ui-bg_glass_65_ffffff_1x400.png") 50% 50% repeat-x;
	font-weight: normal;
	color: #212121;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="headers_css_reset">'; ?>
> .ui-accordion-header {
    display: block;
    cursor: pointer;
    position: relative;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
    min-height: 0;
    /* support: IE7; */
    font-size: 100%;
}

> .ui-state-default {
    border: none;
    background: transparent;
    font-weight: normal;
    color: #333;
}

> .ui-state-hover,
> .ui-state-focus {
	border: none;
	background: transparent;
	font-weight: normal;
	color: #333;
}

> .ui-state-active {
	border: none;
	background: transparent;
	font-weight: normal;
	color: #333;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="content_css">'; ?>
> .ui-accordion-content {
    padding: 1em 2.2em;
    border-top: 0;
    overflow: auto;
}

> .ui-widget-content {
    border: 1px solid #aaaaaa;
    background: #ffffff url("images/ui-bg_flat_75_ffffff_40x100.png") 50% 50% repeat-x;
    color: #222222;
}

> .ui-corner-bottom {
    border-bottom-right-radius: 4px;
	border-bottom-left-radius: 4px;
}
<?php echo '</datatext>'; ?>
<?php echo '<datatext name="content_css_reset">'; ?>
> .ui-accordion-content {
    padding: 0 0;
    border-top: 0;
    overflow: auto;
}

> .ui-widget-content {
    border: none;
    background: transparent;
    color: #333;
}

> .ui-corner-bottom {
    border-bottom-right-radius: 0;
	border-bottom-left-radius: 0;
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