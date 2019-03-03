import {ProposalDescriptor} from './ProposalDescriptor';
import {bindingPerformed, boundMethodArgs, boundMethods} from './symbols';

const ERR_NOT_A_METHOD = '@BoundMethod can only decorate methods';

function ensureProperties(target: any): void {
  if (!target[boundMethods]) {
    Object.defineProperty(target, boundMethods, {value: []});
    Object.defineProperty(target, boundMethodArgs, {value: []});
    Object.defineProperty(target, bindingPerformed, {value: {}});
  }
}

function decorateLegacy(args: any[], target: any, method: PropertyKey, desc: PropertyDescriptor): void {
  /* istanbul ignore if */
  if (!desc) {
    desc = <any>Object.getOwnPropertyDescriptor(target, method);
    if (!desc) {
      throw new Error('@BoundMethod: unable to get property descriptor');
    }
  }

  if (typeof desc.value !== 'function') {
    throw new Error(ERR_NOT_A_METHOD);
  }

  ensureProperties(target);
  target[boundMethods].push(method);
  target[boundMethodArgs].push(args);
}

function decorateNew(args: any[], desc: ProposalDescriptor): ProposalDescriptor {
  if (desc.placement !== 'prototype') {
    throw new Error('Only instance methods may be decorated.');
  } else if (desc.kind !== 'method') {
    throw new Error(ERR_NOT_A_METHOD);
  }

  const descriptor: PropertyDescriptor = desc.descriptor || desc;
  const method = desc.method || descriptor.value;

  if (!method) {
    throw new Error('Unable to resolve method');
  }

  const extras: ProposalDescriptor['extras'] = (desc.extras = desc.extras ? desc.extras.slice(0) : []);

  function initialize(this: any): any {
    return method.bind(this, ...args);
  }

  extras.push({
    descriptor: <any>Object.assign(descriptor, {value: undefined}),
    initialize,
    initializer: initialize,
    key: desc.key,
    kind: 'field',
    placement: 'own'
  });

  return desc;
}

export function BoundMethod(...args: any[]): MethodDecorator {
  return (targetOrDescriptor: any, method: PropertyKey, desc: PropertyDescriptor): ProposalDescriptor | void => {
    if (method) {
      decorateLegacy(args, targetOrDescriptor, method, desc);
    } else {
      return decorateNew(args, targetOrDescriptor);
    }
  };
}
