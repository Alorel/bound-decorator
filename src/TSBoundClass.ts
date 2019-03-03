import {performBinding} from './performBinding';

export function TSBoundClass(): ClassDecorator {
  return (construct: any): any => {
    return class ClassWithBindings extends construct {
      public constructor(...args: any[]) {
        super(...args);
        performBinding(this);
      }
    };
  };
}

TSBoundClass.perform = performBinding; //for typings
Object.defineProperty(TSBoundClass, 'perform', { //for immutability
  configurable: false,
  enumerable: true,
  value: performBinding,
  writable: false
});
