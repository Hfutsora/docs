interface VM {}

interface CompilerOptions {
  el: string | HTMLElement;
  template: DocumentFragment;
  data: () => { [key: string | number]: any };
  mounted?: () => void;
}

class Compiler {
  protected _init: boolean;
  protected _vm: VM;
  protected $options: CompilerOptions;
  protected $el: Element;

  constructor(vm: VM, options: CompilerOptions) {
    this._init = false;
    this._vm = vm;
    this.$options = options || Object.create(null);

    this.$render();
  }

  $render() {
    this._init = true;

    this.$options.template = toFragment(this.$options.template);

    for(const key in this.$options.data()) {
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

  $setupElement(options: CompilerOptions) {
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

  $createBinding(key: string | number) {
    observe(this);
  }

  /**
   * Compile dom node in recursive
   */
  $compile(node: ChildNode, root = false) {
    const parse = (text: string): string => {
      const BINDING_RE = /\{\{(.+?)\}\}/;

      if (!BINDING_RE.test(text)) return null;
      let m: RegExpMatchArray;
      let i: number;
      let tokens: ({ key: string } | string)[] = [];
      while ((m = text.match(BINDING_RE))) {
        i = m.index;
        if (i > 0) tokens.push(text.slice(0, i));
        tokens.push({ key: m[1].trim() });
        text = text.slice(i + m[0].length);
      }
      if (text.length) tokens.push(text);

      return tokens
        .map(token =>
          typeof token === 'string' ? token : this[token.key]
        )
        .join('');
    };

    if (node.nodeType === 1) {
      if (node.childNodes?.length) {
        for (let i = 0; i < node.childNodes?.length; i++) {
          this.$compile(node.childNodes[i]);
        }
      }
    } else if (node.nodeType === 3) {
      // text node
      node.nodeValue = parse(node.nodeValue);
    }
  }
}

function toFragment(template: string): DocumentFragment;
function toFragment<T>(template: T): T;
function toFragment(template: string) {
  if (typeof template !== 'string') {
    return template;
  }
  if (template.charAt(0) === '#') {
    const templateNode = document.getElementById(template.slice(1));
    if (!templateNode) return;
    template = templateNode.innerHTML;
  }
  const node = document.createElement('div');
  const frag = document.createDocumentFragment();
  let child: ChildNode;

  node.innerHTML = template.trim();

  while ((child = node.firstChild)) {
    frag.appendChild(child);
  }

  return frag;
}
