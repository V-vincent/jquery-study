(function(window){
    var jQuery = function(){
        return new jQuery.prototype.init();
    };
    jQuery.fn = jQuery.prototype = {
        init: function(){

        },
        css: function(){

        }
    };
    jQuery.fn.extend = jQuery.extend = function(){
        // console.log(arguments);
        var target = arguments[0] || {};
        var length = arguments.length;
        var i = 1;
        var deep = false;
        var option, name, src, copy, copyIsArray, clone;
        if (typeof target === 'boolean'){
            deep = target;
            target = arguments[1];
            i = 2;
        }

        if (typeof target !== 'object') {
            target = {};
        }

        if (length == i){
            target = this;
            i--;
        }
        for (; i < length; i++){
            if ((option = arguments[i]) != null) {
                for (name in option){
                    // console.log(name);
                    // target[name] = option[name];
                    copy = option[name];
                    src = target[name];
                    if (deep && $.isObject(copy) && (copyIsArray = $.isArray(copy))){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];
                        } else {
                            clone = src && $.isObject(src) ? src : [];
                        }
                        target[name] = $.extend(deep, clone, copy);
                    } else if(copy != undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };
    jQuery.extend({
        isObject: function(obj){
            return toString.call(obj) === ['object Object'];
        },
        isArray: function(obj){
            return toString.call(obj) === ['object Array'];
        }
    });
    jQuery.fn.init.prototype = jQuery.fn;
    window.$ = window.jQuery = jQuery;
})(window);
