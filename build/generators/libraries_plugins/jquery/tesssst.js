function equalWidth()
{
	//Одинаковая ширина колонок в блоке "Статистика"
    var countCol = $(\''+j.find(' .pre-selector input[type="text"]').val()+' ul li\').size();
    $(\''+j.find(' .pre-selector input[type="text"]').val()+' ul li\').each(function(){
        alert($(this).html())
    });
    if(countCol > 0)
    {
        var width = Math.floor(100 / countCol * 10000) / 10000;
        $(\''+j.find(' .pre-selector input[type="text"]').val()+' ul li\').css({width: width+\'%\'});
    }
}
equalWidth();
$(document).ready(equalWidth);