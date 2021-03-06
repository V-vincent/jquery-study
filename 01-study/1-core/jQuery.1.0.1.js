(function (window) {
  var jQuery = function () {
    // return new jQuery(); // 不合理的实例对象创建，会造成死循环
    return new jQuery.prototype.init();
  };
  jQuery.fn = jQuery.prototype = {
    init: function () {

    },
    // 可以扩展其他方法
    css: function () {

    }
  };
  // jQuery核心功能函数:extend，可以在外部或内部使用
  // 细节：需要扩展的对象必须是Object
  jQuery.fn.extend = jQuery.extend = function () {
    // console.log(arguments);
    var target = arguments[0] || {}; // target是需要扩展的对象
    var length = arguments.length;
    var i = 1;
    var deep = false; // 定义一个deep来判断是深拷贝 or 浅拷贝
    var option, name, copy, src, copyIsArray, clone;
    // 传入第一个参数如果为boolean，则是判断是否需要做深拷贝的操作
    if (typeof target === 'boolean') {
      deep = target; // 第一个参数为target
      target = arguments[1]; // 第二个参数才是需要扩展的对象
      i = 2; // i要加1
    }
    if (typeof target !== 'object') {
      target = {};
    }
    // 如果参数的个数等于1时 要么给jQuery本身扩展方法，要么给jQuery的实例对象扩展方法
    if (length === i) {
      target = this; // this: Query本身 or jQuery的实例对象fn
      i--;
    }

    // 浅拷贝  深拷贝
    for (; i < length; i++) {
      if ((option = arguments[i]) != null) { // i=1;对第一个对象扩展 第一个对象不要动；
        for (name in option) {
          // target[name] = option[name];
          // console.log(name);
          copy = option[name]; // option 当前遍历对象的值
          src = target[name]; // 第一个为 {} src为undefined
          if (deep && ($.isObject(copy) || (copyIsArray = $.isArray(copy)))) {
            // 深拷贝  copy需要是Object或者Array
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && $.isArray(src) ? src : [];
            } else {
              clone = src && $.isObject(src) ? src : {};
            }
            // console.log(clone, copy);
            target[name] = $.extend(deep, clone, copy); // 核心代码
          } else if (copy != undefined) { // 浅拷贝
            target[name] = copy;
          }
        }
      }
    }
    return target; // 返回扩展的对象
  };

  // 共享原型设计
  // 调用$时，会去找到jQuery原型上的init方法，把init当做一个构造函数，然后返回init的实例对象
  // jQuery原型上的init的构造函数跟jQuery本身共享一个原型
  // jQuery.prototype.init.prototype = jQuery.prototype; // 共享原型对象
  jQuery.fn.init.prototype = jQuery.fn;

  // 给jQuery扩展
  jQuery.extend({
    // 类型检测
    isObject: function (obj) {
      return toString.call(obj) === '[object Object]';
    },
    isArray: function (obj) {
      return toString.call(obj) === '[object Array]';
    },
  });
  window.$ = window.jQuery = jQuery; // 要创建一个$实例
})(window);