var Compiler = /** @class */ (function () {
    function Compiler(vm, options) {
        this._init = false;
        this._vm = vm;
        this.$options = options || Object.create(null);
        this.$render();
    }
    Compiler.prototype.$render = function () {
        var _a;
        this._init = true;
        this.$options.template = toFragment(this.$options.template);
        for (var key in this.$options.data()) {
            this.$createBinding(key);
        }
        this.$update();
        this._init = false;
        (_a = this.$options.mounted) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    Compiler.prototype.$update = function () {
        this.$el = this.$setupElement(this.$options);
        this.$compile(this.$el, true);
    };
    Compiler.prototype.$setupElement = function (options) {
        // create the node first
        var el = (this.$el =
            typeof options.el === 'string'
                ? document.querySelector(options.el)
                : options.el || document.createElement('div'));
        var template = options.template;
        if (template) {
            el.innerHTML = '';
            el.appendChild(template.cloneNode(true));
        }
        return el;
    };
    Compiler.prototype.$createBinding = function (key) {
        var _this = this;
        var value = this.$options.data()[key];
        this[key] = value;
        Object.defineProperty(this, key, {
            enumerable: true,
            get: function () {
                return value;
            },
            set: function (newVal) {
                value = newVal;
                _this.$update();
            }
        });
    };
    /**
     * Compile dom node in recursive
     */
    Compiler.prototype.$compile = function (node, root) {
        var _this = this;
        var _a, _b;
        if (root === void 0) { root = false; }
        var parse = function (text) {
            var BINDING_RE = /\{\{(.+?)\}\}/;
            if (!BINDING_RE.test(text))
                return null;
            var m;
            var i;
            var tokens = [];
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
                .map(function (token) {
                return typeof token === 'string' ? token : _this[token.key];
            })
                .join('');
        };
        if (node.nodeType === 1) {
            if ((_a = node.childNodes) === null || _a === void 0 ? void 0 : _a.length) {
                for (var i = 0; i < ((_b = node.childNodes) === null || _b === void 0 ? void 0 : _b.length); i++) {
                    this.$compile(node.childNodes[i]);
                }
            }
        }
        else if (node.nodeType === 3) {
            // text node
            node.nodeValue = parse(node.nodeValue);
        }
    };
    return Compiler;
}());
function toFragment(template) {
    if (typeof template !== 'string') {
        return template;
    }
    if (template.charAt(0) === '#') {
        var templateNode = document.getElementById(template.slice(1));
        if (!templateNode)
            return;
        template = templateNode.innerHTML;
    }
    var node = document.createElement('div');
    var frag = document.createDocumentFragment();
    var child;
    node.innerHTML = template.trim();
    while ((child = node.firstChild)) {
        frag.appendChild(child);
    }
    return frag;
}
