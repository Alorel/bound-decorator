import {bindingPerformed, boundMethodArgs, boundMethods} from './symbols';

function getPerformed(instance: any, method: PropertyKey): boolean {
  if (!instance[bindingPerformed]) {
    Object.defineProperty(instance, bindingPerformed, {value: {}});
  }

  return instance[bindingPerformed][method];
}

/**
 * Manually bind methods decorated with @BoundMethod.
 * @param instance The class instance
 */
function performBinding(instance: any): void {
  if (instance[boundMethods]) {
    let methodName: PropertyKey;
    for (let i = 0; i < instance[boundMethods].length; i++) {
      methodName = instance[boundMethods][i];
      if (instance[methodName] && !getPerformed(instance, methodName)) {
        instance[methodName] = (<Function>instance[methodName]).bind(instance, ...instance[boundMethodArgs][i]);
        instance[bindingPerformed][methodName] = true;
      }
    }
  }
}

/**
 * Decorate the class, making all methods decorated with @BoundMethod bound to
 * class instances.
 */
export function BoundClass(): ClassDecorator {
  return (construct: any): any => {
    return class ClassWithBindings extends construct {
      public constructor(...args: any[]) {
        super(...args);
        performBinding(this);
      }
    };
  };
}

BoundClass.perform = performBinding; //for typings
//for immutability
Object.defineProperty(BoundClass, 'perform', {
  configurable: false,
  enumerable: true,
  value: performBinding,
  writable: false
});
