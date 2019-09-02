import {ProposalDescriptor} from './ProposalDescriptor';
import {boundMethodArgs, boundMethods} from './symbols';

const ERR_NOT_A_METHOD = '@BoundMethod can only decorate methods';

function decorateLegacy(args: any[], target: any, method: PropertyKey, desc: PropertyDescriptor): void {
  if (!desc) {
    desc = <any>Object.getOwnPropertyDescriptor(target, method);
    if (!desc) {
      throw new Error('@BoundMethod: unable to get property descriptor');
    }
  }

  if (typeof desc.value !== 'function') {
    throw new Error(ERR_NOT_A_METHOD);
  } else if (Object.getPrototypeOf(target) === Function.prototype) {
    target[method] = (<Function>target[method]).bind(target);

    return;
  }

  if (!target[boundMethods]) {
    Object.defineProperty(target, boundMethods, {value: []});
    Object.defineProperty(target, boundMethodArgs, {value: []});
  }
  // Override args in extending class
  const idx = target[boundMethods].indexOf(method);
  if (idx === -1) {
    target[boundMethods].push(method);
    target[boundMethodArgs].push(args);
  } else {
    target[boundMethodArgs][idx] = args;
  }
}

function decorateNew(args: any[], desc: ProposalDescriptor): ProposalDescriptor {
  if (desc.kind !== 'method') {
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

  if (desc.placement === 'static') {
    return {
      descriptor: <any>Object.assign({}, descriptor, {value: undefined}),
      initialize,
      initializer: initialize,
      key: desc.key,
      kind: 'field',
      placement: 'static'
    };
  } else {
    extras.push({
      descriptor: <any>Object.assign({}, descriptor, {value: undefined}),
      initialize,
      initializer: initialize,
      key: desc.key,
      kind: 'field',
      placement: 'own'
    });
  }

  return desc;
}

/**
 * Mark the method to be automatically bound to the class instance
 * @param args Optional arguments to pass to Function.prototype.bind
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
export function BoundMethod(...args: any[]): MethodDecorator {
  return (targetOrDescriptor: any, method: PropertyKey, desc: PropertyDescriptor): ProposalDescriptor | void => {
    if (method) {
      decorateLegacy(args, targetOrDescriptor, method, desc);
    } else {
      return decorateNew(args, targetOrDescriptor);
    }
  };
}
