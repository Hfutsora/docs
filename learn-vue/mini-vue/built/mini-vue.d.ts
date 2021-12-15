interface VM {
}
interface CompilerOptions {
    el: string | HTMLElement;
    template: DocumentFragment;
    data: () => {
        [key: string]: any;
    };
}
declare class Compiler {
    protected _init: boolean;
    protected vm: VM;
    protected options: CompilerOptions;
    protected el: Element;
    constructor(vm: VM, options: CompilerOptions);
    render(): void;
    setupElement(options: CompilerOptions): Element;
    /**
     * Compile dom node in recursive
     */
    compile(node: ChildNode, root?: boolean): void;
}
declare function toFragment(template: string): DocumentFragment;
declare function toFragment<T>(template: T): T;
