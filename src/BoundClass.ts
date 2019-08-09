import {bindingPerformed, boundMethodArgs, boundMethods} from './symbols';

/**
 * Manually bind methods decorated with @BoundMethod.
 * @param instance The class instance
 */
function performBinding(instance: any): void {
  if (instance[boundMethods]) {
    let methodName: PropertyKey;
    if (!instance[bindingPerformed]) {
      Object.defineProperty(instance, bindingPerformed, {value: {}});
    }

    for (let i = 0; i < instance[boundMethods].length; i++) {
      methodName = instance[boundMethods][i];
      if (instance[methodName] && !instance[bindingPerformed][methodName]) {
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
function BoundClass(): ClassDecorator {
  return (construct: any): any => {
    return class ClassWithBindings extends construct {
      public constructor(...args: any[]) {
        super(...args);
        performBinding(this);
      }
    };
  };
}

BoundClass.perform = performBinding; // lgtm [js/useless-assignment-to-property]

// Define this twice. The assignment above generates the typings while the assignment below makes sure it's immutable

Object.defineProperty(BoundClass, 'perform', {
  configurable: false,
  enumerable: true,
  value: performBinding,
  writable: false
});

export {BoundClass};
