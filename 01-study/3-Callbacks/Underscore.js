(function (root) {
  // 以单独的一个功能模块抽离出来，来看一下Callbacks是怎么实现的
  var optionsCache = {};
  var _ = {
    callbacks: function (options) { // options：接收参数
      // console.log('callbacks');
      options = typeof options === 'string' ? (optionsCache[options] || createOptions(options)) : {};
      // 队列，赋予很多的功能
      var list = [];
      // index:执行位置 testting:是否被执行过
      var index, length, testting, memory, start, starts;
      // 真正能够控制执行队列里的处理函数的方法
      var fire = function (data) {
        memory = options.memory && data;
        index = starts || 0;
        start = 0;
        testting = true;
        length = list.length;
        for (; index < length; index++) {
          if (list[index].apply(data[0], data[1]) === false && options.stopOnFalse) {
            break;
          }
        }
      }
      var self = {
        add: function () {
          var args = [...arguments]; // 把参数转化为真正的数组
          start = list.length;
          args.forEach(function (fn) {
            // 判断是否是函数，是函数则加进list列表中
            if (toString.call(fn) === '[object Function]') {
              list.push(fn);
            }
          })
          if (memory) {
            starts = start;
            fire(memory);
          }
        },
        // 上下文的绑定
        fireWith: function (context, arguments) {
          var args = [context, arguments];
          if (!options.once || !testting) {
            fire(args);
          }
        },
        // 这个fire并不是要依次执行队列里函数的函数，调用时需要往里面传参
        fire: function () {
          self.fireWith(this, arguments); // 控制参数的传递 this:self
        },
      }
      // 每次调用Callbacks，都返回一个队列，队列里面有add、fire这些操作
      return self;
    },
  }

  function createOptions(options) {
    var obj = optionsCache[options] = {};
    // 以空格(\s+)分割参数(支持传入多个参数，以空格分开)
    options.split(/\s+/).forEach(function (value) {
      // console.log(value);
      obj[value] = true;
    });
    // console.log(obj);
    return obj; // 获取到用户传来的参数，支持传入多个参数，并存储在optionsCache缓存对象中
  }
  root._ = _; // 给window扩展一个属性来拿到对象的引用
})(window);