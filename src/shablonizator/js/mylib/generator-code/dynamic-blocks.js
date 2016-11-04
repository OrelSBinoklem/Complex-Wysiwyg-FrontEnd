(function($){

    var defaultOptions = {

    };

    var generatorCode__dynamicBlocks = function($container, options) {
        this._options = options;
        var ____ = this;
        ____.$container = $container;

        this._create = function() {
            //Свойства
            //Обработчики событий
            $container.on('click', ' .db__repeat[data-name] .db__repeat-add-el', ____._handlerAddRepeatElement);
            $container.on('click', ' .db__repeat[data-name] .db__repeat-add-el', ____._handlerRemoveRepeatElement);
            $container.on('click', ' .db__repeat[data-name] .db__repeat-null', ____._handlerShowFirstRepeatElement);
            $container.on('db.updated.repeat', ____._refreshIndexesForRepeater);

            $container.on('change', ' .db__selected', ____._handlerShowHiddenSelectedElement);
        }

        this._destroy = function() {

        }

        //Реинициализация при вставке нового контента
        this.reinitForNewContent = function () {
            $container.find(' .gc__manager-fields .db__selected[data-name] + * > *').attr("data-show", "0");

            $container.find(' .gc__manager-fields .db__repeat[data-name]').each(function() {
                $(this).append("<div class='db__repeat-null btn-block btn-default'>Добавить поле \"" + ($(this).attr("data-name")) + "\"</div>");
            })
            .find(" > *").not(".db__repeat-null")
            .attr("data-show", "0")
            .append(
                "<div class='db__repeat-buttons'>" +
                    "<div class='btn-group-vertical'>" +
                        "<button type='button' class='db__repeat-delete-el btn btn-danger btn-xs'>-</button>" +
                        "<button type='button' class='db__repeat-add-el btn btn-success btn-xs'>+</button>" +
                    "</div>" +
                "</div>"
            );
        }

        this._handlerRemoveRepeatElement = function () {
            var $el = $(this).closest(".db__repeat-buttons").parent("*");
            var $container = $el.parent("*");
                $el.hide({
                complete: function() {
                    if( !$el.siblings().not(".db__repeat-null").size() ) {
                        $el.siblings(".db__repeat-null").show({
                            complete: function() {
                                $el.attr("data-show", "0");
                                $container.trigger('db.updated.repeat', [$container.find(" > *").not(".db__repeat-null")]);
                            }
                        });
                    } else {
                        $el.remove();
                        $container.trigger('db.updated.repeat', [$container.find(" > *").not(".db__repeat-null")]);
                    }
                }
            });
        }

        this._handlerAddRepeatElement = function () {
            var $el = $(this).closest(".db__repeat-buttons").parent("*");
            var $container = $el.parent("*");
            var $clone = $el.clone();
            $el.after($clone.css({display: "none"}));
            $clone.show({
                complete: function() {
                    $container.trigger('db.updated.repeat', [$container.find(" > *").not(".db__repeat-null")]);
                }
            });
        }

        this._handlerShowFirstRepeatElement = function () {
            var $el = $(this).siblings().first();
            var $container = $el.parent("*");
            $(this).hide({
                complete: function() {
                    $el.show({
                        complete: function() {
                            $el.attr("data-show", "1");
                            $container.trigger('db.updated.repeat', [$container.find(" > *").not(".db__repeat-null")]);
                        }
                    });
                }
            });
        }

            this._refreshIndexesForRepeater = function (e, $elements) {
                var i = 0;
                $elements.each(function() {
                    $(this).attr("data-repeater-index", i);
                    i++;
                });
            }

        this._handlerShowHiddenSelectedElement = function(e){
            e.preventDefault();

            var dataNames = new Array();
            var $content = $(this).find(" + *");
            $(this).find(' input').add($(this).find(' option')).each(function(){
                if($(this).is("input")) {
                    dataNames.push({dataName: $(this).val(), show: $(this).prop("checked")});
                } else {
                    dataNames.push({dataName: $(this).val(), show: $(this).prop("selected")});
                }
            });

            var countChange = 0;
            for(var key in dataNames)
            {
                var item = dataNames[key];
                var $item = $content.find(' > [data-name="' + (item.dataName) + '"]');
                if(item.show) {
                    if($item.attr("data-show") == "0") {
                        (function($item){
                            countChange++;
                            $item.show({
                                complete: function() {
                                    countChange--;
                                    if( countChange <= 0 ) {
                                        $item.attr("data-show", "1");
                                        $container.trigger('db.updated.selected');
                                    }
                                }
                            });
                        })($item);
                    }
                } else {
                    if($item.attr("data-show") == "1") {
                        (function($item){
                            countChange++;
                            $item.hide({
                                complete: function() {
                                    countChange--;
                                    if( countChange <= 0 ) {
                                        $item.attr("data-show", "0");
                                        $container.trigger('db.updated.selected');
                                    }
                                }
                            });
                        })($item);
                    }
                }
            }
        }
    }
    
    modules.generatorCode__dynamicBlocks = generatorCode__dynamicBlocks;

})(jQuery);