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
