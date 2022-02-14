class Compiler {
    _init;
    _vm;
    $options;
    $el;
    constructor(vm, options) {
        this._init = false;
        this._vm = vm;
        this.$options = options || Object.create(null);
        this.$render();
    }
    $render() {
        this._init = true;
        this.$options.template = toFragment(this.$options.template);
        for (const key in this.$options.data()) {
            this.$createBinding(key);
        }
        this.$update();
        this._init = false;
        this.$options.mounted?.call(this);
    }
    $update() {
        this.$el = this.$setupElement(this.$options);
        this.$compile(this.$el, true);
    }
    $setupElement(options) {
        // create the node first
        const el = (this.$el =
            typeof options.el === 'string'
                ? document.querySelector(options.el)
                : options.el || document.createElement('div'));
        const template = options.template;
        if (template) {
            el.innerHTML = '';
            el.appendChild(template.cloneNode(true));
        }
        return el;
    }
    $createBinding(key) {
        observe(this);
    }
    /**
     * Compile dom node in recursive
     */
    $compile(node, root = false) {
        const parse = (text) => {
            const BINDING_RE = /\{\{(.+?)\}\}/;
            if (!BINDING_RE.test(text))
                return null;
            let m;
            let i;
            let tokens = [];
            while ((m = text.match(BINDING_RE))) {
                i = m.index;
                if (i > 0)
                    tokens.push(text.slice(0, i));
                tokens.push({ key: m[1].trim() });
                text = text.slice(i + m[0].length);
            }
            if (text.length)
                tokens.push(text);
            return tokens
                .map(token => typeof token === 'string' ? token : this[token.key])
                .join('');
        };
        if (node.nodeType === 1) {
            if (node.childNodes?.length) {
                for (let i = 0; i < node.childNodes?.length; i++) {
                    this.$compile(node.childNodes[i]);
                }
            }
        }
        else if (node.nodeType === 3) {
            // text node
            node.nodeValue = parse(node.nodeValue);
        }
    }
}
function toFragment(template) {
    if (typeof template !== 'string') {
        return template;
    }
    if (template.charAt(0) === '#') {
        const templateNode = document.getElementById(template.slice(1));
        if (!templateNode)
            return;
        template = templateNode.innerHTML;
    }
    const node = document.createElement('div');
    const frag = document.createDocumentFragment();
    let child;
    node.innerHTML = template.trim();
    while ((child = node.firstChild)) {
        frag.appendChild(child);
    }
    return frag;
}
function isWatchable(obj) {
    return typeof obj === 'object';
}
function observe(value) {
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
