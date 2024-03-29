interface Ctx<T, A extends any[], R> extends Omit<ClassMethodDecoratorContext<T, Fn<T, A, R>>, 'private'> {
  private: false;
}
type Fn<T, A extends any[], R> = (this: T, ...args: A) => R;
type Decorator<T, A extends any[], R> = (target: any, ctx: Ctx<T, A, R>) => void;

function nameFn<T extends {name: string}>(value: string, fn: T): T {
  Object.defineProperty(fn, 'name', {
    configurable: true,
    value,
    writable: true
  });

  return fn;
}

function BoundMethod<T, A extends any[], R>(): Decorator<T, A, R>;
function BoundMethod<T, A extends any[], R>(...args: Partial<A>): Decorator<T, A, R>;
function BoundMethod<T, A extends any[], R>(...args: Partial<A>): Decorator<T, A, R> {
  return function boundMethodDecorator(origFn: Function, {addInitializer, name}) {
    const sName = String(name);
    const boundName = `Bound(${sName})`;

    const performBind: (inst: T) => Fn<T, A, R> = nameFn(
      `BoundMethodBinder(${sName})`,
      args.length
        ? (inst => nameFn(boundName, origFn.bind(inst, ...args)))
        : (inst => nameFn(boundName, origFn.bind(inst)))
    );

    addInitializer(nameFn(`BoundMethodInitialiser(${sName})`, function (this: T) {
      this[name as keyof T] = performBind(this) as any;
    }));
  };
}

export {BoundMethod};
