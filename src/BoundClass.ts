import {bindingPerformed, boundMethodArgs, boundMethods} from './symbols';

function perform(instance: any) {
  if (instance[boundMethods]) {
    let methodName: PropertyKey;
    for (let i = 0; i < instance[boundMethods].length; i++) {
      methodName = instance[boundMethods][i];
      if (!instance[bindingPerformed][methodName]) {
        instance[methodName] = (<Function>instance[methodName]).bind(instance, ...instance[boundMethodArgs][i]);
        instance[bindingPerformed][methodName] = true;
      }
    }
  } else {
    console.warn('No methods to bind on', Object.getPrototypeOf(instance));
  }
}

export function BoundClass(construct: any): any {
  return class ClassWithBindings extends construct {
    public constructor(...args: any[]) {
      super(...args);
      perform(this);
    }
  };
}

BoundClass.perform = perform; //for typings
Object.defineProperty(BoundClass, 'perform', { //for immutability
  configurable: false,
  enumerable: true,
  value: perform,
  writable: false
});
