import {bindingPerformed, boundMethodArgs, boundMethods} from './symbols';

function getPerformed(instance: any, method: PropertyKey): boolean {
  return (instance[bindingPerformed] || (instance[bindingPerformed] = {}))[method];
}

export function performBinding(instance: any) {
  if (instance[boundMethods]) {
    let methodName: PropertyKey;
    for (let i = 0; i < instance[boundMethods].length; i++) {
      methodName = instance[boundMethods][i];
      if (!getPerformed(instance, methodName)) {
        instance[methodName] = (<Function>instance[methodName]).bind(instance, ...instance[boundMethodArgs][i]);
        instance[bindingPerformed][methodName] = true;
      }
    }
  }
}
