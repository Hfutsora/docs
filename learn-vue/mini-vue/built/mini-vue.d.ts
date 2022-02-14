interface VM {
}
interface CompilerOptions {
    el: string | HTMLElement;
    template: DocumentFragment;
    data: () => {
        [key: string | number]: any;
    };
    mounted?: () => void;
}
declare class Compiler {
    protected _init: boolean;
    protected _vm: VM;
    protected $options: CompilerOptions;
    protected $el: Element;
    constructor(vm: VM, options: CompilerOptions);
    $render(): void;
    $update(): void;
    $setupElement(options: CompilerOptions): Element;
    $createBinding(key: string | number): void;
    /**
     * Compile dom node in recursive
     */
    $compile(node: ChildNode, root?: boolean): void;
}
declare function toFragment(template: string): DocumentFragment;
declare function toFragment<T>(template: T): T;
declare function isWatchable(obj: unknown): obj is object;
declare function observe(value: unknown): Observer;
declare class Observer {
    data: any;
    constructor(data: any);
    walk(data: any): void;
    defineReactive(data: any, key: any, val: any): void;
}
declare class Dep {
    subs: any;
    static target: any;
    constructor();
    addSub(sub: any): void;
    notify(): void;
}
declare class Watcher {
    cb: any;
    vm: any;
    exp: any;
    value: any;
    constructor(vm: any, exp: any, cb: any);
    update(): void;
    run(): void;
    get(): any;
}
declare class MyVue {
    data: any;
    constructor(data: any, el: any, exp: any);
    proxyKeys(key: any): void;
}
