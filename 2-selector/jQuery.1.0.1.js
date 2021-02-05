(function (root) {
    var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    // 正则:匹配、过滤
    // ^<：以<开始
    // \：将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符
    // \w：匹配字母或数字或下划线 等价于 '[^A-Za-z0-9_]'
    // (\w+)：匹配多个字母或数字或下划线，并标记一个子表达式
    // \s*：\s匹配任意的空白符，*匹配前面的子表达式零次或多次，即\s*匹配零个或多个空白符
    // \/?>：匹配/>或>
    // ?：匹配前面的子表达式零次或一次，或指明一个非贪婪限定符
    // <(\w+)\s*\/?>：匹配类似<a>或者<a/>这样的文本
    // (?:)：非捕获分组，不会保存匹配到的值，也就是匹配 <\/\1>| ，但不会保存
    // \1：引用第一个分组，即(\w+)
    // |：指明两项之间的一个选择，即匹配<\/\1>或者空
    // $：以(?:<\/\1>|)或空结束

    // ^：匹配字符串的开始
    // $：匹配字符串的结束
    // ()：标记一个子表达式的开始和结束位置，匹配这些字符，要使用 \( 和 \)
    // \：将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符。'\\' 匹配 "\"
    // +：匹配前面的子表达式一次或多次。要匹配 + 字符，要使用 \+
    // *：匹配前面的子表达式零次或多次，匹配 * 字符，要使用 \*
    // ?：匹配前面的子表达式零次或一次，或指明一个非贪婪限定符。要匹配 ? 字符，要使用 \?
    // |：指明两项之间的一个选择。匹配 |，要使用 \|
    // \s：匹配任意的空白符
    // \1：引用第一个分组，\2：引用第二个分组
    var version = "1.0.1";

    // 传递进来的参数会给到jQuer的构造函数
    var jQuery = function (selector, context) {
        // return new jQuery(); // 不合理的实例对象创建，会造成死循环
        return new jQuery.prototype.init(selector, context);
    };
    jQuery.fn = jQuery.prototype = { // 原型对象
        length: 0,
        jquery: version,
        selector: "",
        init: function (selector, context) {
            // selector是传入参数，可以是对象、函数、字符串
            // context是document查询时限定的查询范围
            // document：HTML文件载入浏览器时会成为document对象，使我们可以从脚本中对HTML页面中的所有元素进行访问
            context = context || document;
            var match, elem, index = 0;
            // $() $(undefined) $(null) $(false) 返回this;
            if (!selector) {
                return this;
            }
            console.log(selector);
            // 如果传入的是字符串，有两个作用：查询DOM节点、创建DOM
            if (typeof selector === 'string') {
                // chartAt()方法用于返回指定索引处的字符
                // 检测是否是要创建DOM节点< >
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    match = [selector];
                }
                // 创建DOM节点
                if (match) {
                    // merge：合并数组 object array2 [DOM节点]
                    jQuery.merge(this, jQuery.parseHTML(selector, context)); // parseHTML解析HTML，创建一个DOM节点
                } else { // 查询DOM节点
                    elem = document.querySelectorAll(selector); // 类数组
                    // var elems = Array.prototype.slice.call(elem); // 转换为真正的数组
                    // var elems = [...elem]; // 转换为真正的数组
                    var elems = Array.from(elem);
                    this.length = elems.length;
                    for (; index < elems.length; index++) {
                        this[index] = elems[index];
                    }
                    this.context = context;
                    this.selector = selector;
                }
            } else if ( selector.nodeType ) { // 传入对象或数组的处理 
                // 为什么我的数组或对象没有nodeType属性？
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            } else if (jQuery.isFunction(selector)) { // 传入的是函数
                selector();
            }
        },
        // 可以扩展其他方法
        css: function () {
            console.log('css');
        }
    };
    // jQuery核心功能函数:extend，可以在外部或内部使用
    // 细节：第一个参数必须是Object/需要扩展的对象
    jQuery.fn.extend = jQuery.extend = function () {
        // console.log(arguments);
        var target = arguments[0] || {}; // target需要扩展的对象
        var length = arguments.length;
        var i = 1;
        var deep = false; // 深拷贝 or 浅拷贝
        var option, name, copy, src, copyIsArray, clone;
        // 判断是否需要做深拷贝
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1];
            i = 2;
        }
        if (typeof target !== 'object') {
            target = {};
        }
        // 判断参数的个数 =1时 要么给jQuery本身扩展方法，要么给jQuery的实例对象扩展方法
        if (length === i) {
            target = this; // Query本身 or jQuery的实例对象
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
                    if (deep && (jQuery.isObject(copy) || (copyIsArray = jQuery.isArray(copy)))) { // 深拷贝  copy需要是Object或者Array
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isObject(src) ? src : {};
                        }
                        // console.log(clone, copy);
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if (copy != undefined) { // 浅拷贝
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
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
        isArray: function (arr) {
            return toString.call(arr) === '[object Array]';
        },
        isFunction: function (fn) {
            return toString.call(fn) === '[object Function]';
        },
        // 合并数组  this [DOM节点]
        merge: function (first, second) {
            var slen = second.length, // 1
                flen = first.length, // 0
                j = 0;
            if (typeof slen === 'number') {
                for (; j < slen; j++) {
                    first[flen++] = second[j]; // 把DOM节点放在first(this)里面
                }
            } else {
                while (second[j] !== undefined) {
                    first[flen++] = second[j++];
                }
            }
            first.length = flen;
            return first; // first其实是jQuery的实例对象，存储了创建出来的DOM节点
        },

        parseHTML: function (data, context) {
            if (!data || typeof data !== 'string') {
                return null;
            }
            // 通过正则过滤掉<a>的<>
            var parse = rejectExp.exec(data);
            console.log(parse);
            // 创建一个DOM节点放进数组里面返回出去
            return [context.createElement(parse[1])]; // createElement：通过指定名称创建一个元素
        }
    });
    root.$ = root.jQuery = jQuery; // 要创建一个$实例
})(this); // window
