function isWatchable(obj: unknown): obj is object {
  return typeof obj === 'object';
}

function observe(value: unknown) {
  if (isWatchable(value)) {
    return new Observer(value);
  }
}

// Observer
class Observer {
  data;

  constructor(data) {
    this.data = data;
    this.walk(data);
  }
  walk(data) {
    var self = this;
    Object.keys(data).forEach(function (key) {
      self.defineReactive(data, key, data[key]);
    });
  }

  defineReactive(data, key, val) {
    var dep = new Dep();
    observe(val);
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return val;
      },
      set: function (newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        dep.notify();
      }
    });
  }
}

// Dep
class Dep {
  subs;
  static target;

  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  }
}

// Watcher
class Watcher {
  cb;
  vm;
  exp;
  value;

  constructor(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get(); // 将自己添加到订阅器的操作
  }
  update() {
    this.run();
  }
  run() {
    var value = this.vm.data[this.exp];
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  }
  get() {
    Dep.target = this; // 缓存自己
    var value = this.vm.data[this.exp]; // 强制执行监听器里的get函数
    Dep.target = null; // 释放自己
    return value;
  }
}

class MyVue {
  data;

  constructor(data, el, exp) {
    var self = this;
    this.data = data;
    Object.keys(data).forEach(function (key) {
      self.proxyKeys(key);
    });
    observe(data);
    el.innerHTML = this.data[exp]; // 初始化模板数据的值
    new Watcher(this, exp, function (value) {
      el.innerHTML = value;
    });
    return this;
  }
  // 将this.data的key代理到this上
  proxyKeys(key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function proxyGetter() {
        return self.data[key];
      },
      set: function proxySetter(newVal) {
        self.data[key] = newVal;
      }
    });
  }
}
