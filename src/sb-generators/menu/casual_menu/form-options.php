<div class="gc_glob-container">
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
			<h4>Название меню</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="name" type="text" class="form-control" placeholder="Имя для комментариев" data-validate=".+" data-zapros="change-content" data-helper="3">
			</form>
		</div>
	</div>
	<div class="row">
        <div class="col-xs-6">
			<h4>id или class меню</h4>
        </div>
		<div class="col-xs-6">
			<form class="form-group" data-toggle="buttons">
				<input name="idclassmenu" type="text" class="form-control" data-helper="3" placeholder="#id или .class" data-validate="(^(\.|\#)[a-zA-Zа-яА-Я])">
			</form>
		</div>
	</div>
    <h2>Настройки <small>модуля</small></h2>
	<hr />
    <div class="row">
        <div class="col-xs-6">
			<h4>Меню по центру</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color centermenu" data-toggle="buttons">
        		<label class="btn btn-default active" data-btn-color="default">
        			<input type="radio" name="centermenu" value="none" checked="checked" />Нет
        		</label>
        		<label class="btn btn-default" data-btn-color="success">
        			<input type="radio" name="centermenu" value="center" />Да
        		</label>
        	</form>
		</div>
	</div>
    <h2>Настройки <small>css</small></h2>
	<hr />
    <div class="row">
        <div class="col-xs-6">
			<h4>Высота меню</h4>
        </div>
		<div class="col-xs-6">
			<div class="input-group">
                <input name="height" type="text" class="form-control spinner height-menu" placeholder="Число" data-zapros="css">
                <select class="selectpicker height-menu-unit">
    				<option name="heightunit" value="px" selected="selected">px</option>
    				<option name="heightunit" value="%">%</option>
    				<option name="heightunit" value="em">em</option>
    				<option name="heightunit" value="pt">pt</option>
    			</select>
            </div>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Отступы между пунктами</h4>
        </div>
		<div class="col-xs-6">
			<div class="input-group">
                <input name="ml_puncts" type="text" class="form-control spinner" placeholder="Число" data-zapros="css">
                <select class="selectpicker">
    				<option name="ml_punctsunit" value="px" selected="selected">px</option>
    				<option name="ml_punctsunit" value="%">%</option>
    				<option name="ml_punctsunit" value="em">em</option>
    				<option name="ml_punctsunit" value="pt">pt</option>
    			</select>
            </div>
		</div>
	</div>
    <div class="row">
        <div class="col-xs-6">
			<h4>Разделитель</h4>
        </div>
		<div class="col-xs-6">
			<form class="btn-group btn-toggle-one-color image-separate-active db-selected" data-toggle="buttons">
        		<label class="btn btn-default active" data-btn-color="default">
        			<input type="radio" name="imgsepar" value="none" checked="checked" />Нет
        		</label>
        		<label class="btn btn-default" data-btn-color="success">
        			<input type="radio" name="imgsepar" value="image-separate-container" />Да
        		</label>
        	</form>
            <div class="add-src-image form-group image-separate-container" style="display: none;">
                <label>Картинка разделителя</label>
                <div class="input-group src">
                    <input name="imgsepar_src" type="text" class="form-control image-separate gc-src" placeholder="Путь">
                    <div class="input-group-btn">
                        <button class="btn btn-default"><span class="glyphicon glyphicon-plus-sign"></span></button>
                    </div>
                </div>
                <form class="row">
                    <div class="col-xs-6">
                        <div class="input-group">
                            <div class="input-group-addon">w</div>
                            <input name="imgsepar_w" type="text" class="form-control input-sm spinner gc-width" placeholder="Ширина" data-zapros="css">
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="input-group">
                            <div class="input-group-addon">h</div>
                            <input name="imgsepar_h" type="text" class="form-control input-sm spinner gc-height" placeholder="Высота" data-zapros="css">
                        </div>
                    </div>
                </form>
                <form class="row">
                    <div class="col-xs-6">
                        <div class="input-group">
                            <div class="input-group-addon"><span class="fa fa-long-arrow-left"></span></div>
                            <input name="imgsepar_r" type="text" class="form-control input-sm spinner" placeholder="Отступ справа" data-zapros="css">
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="input-group">
                            <div class="input-group-addon"><span class="fa fa-long-arrow-down"></span></div>
                            <input name="imgsepar_t" type="text" class="form-control input-sm spinner" placeholder="Отступ сверху" data-zapros="css">
                        </div>
                    </div>
                </form>
            </div>
		</div>
	</div>
    <h2>Дополнения</h2>
	<hr />
	<h2>Контент</h2>
	<hr />
    <div class="row">
        <div class="col-xs-6">
			<h4>Количество пунктов меню</h4>
        </div>
		<div class="col-xs-6">
			<div class="form-group count-puncts db-repeat" data-item-class="menu-punkt">
                <div class="input-group">
                	<input name="puncts_count" type="text" maxlength="2" class="form-control" placeholder="Введите число от 1 до 99" data-validate="^([1-9]\d?)$" data-helper="2" data-zapros="change-content"/>
                	<div class="input-group-btn">
                		<button class="btn btn-default db-generate">
                			GO
                		</button>
                	</div>
                </div>
            </div>
		</div>
	</div>
    <div class="row menu-punkts">
        <div class="col-xs-6 col-xs-offset-3">
            <input name="puncts_text" type="text" class="form-control input-sm menu-punkt" style="display: none; margin-top: 5px;" placeholder="Название" data-instant-update="yes" data-validate=".+"  data-zapros="change-content">
        </div>
    </div>
</div>
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