import {ProposalDescriptor} from './ProposalDescriptor';

const ERR_NOT_A_METHOD = '@BoundMethod can only decorate methods';

function decorateLegacy(
  args: any[],
  methodName: PropertyKey,
  desc: PropertyDescriptor
): PropertyDescriptor {
  if (!desc || typeof desc.value !== 'function') {
    throw new Error(ERR_NOT_A_METHOD);
  }

  const {configurable, enumerable, value: method} = desc;

  return {
    configurable,
    enumerable,
    get() {
      // tslint:disable-next-line:no-invalid-this
      const value = (method as Function).bind(this, ...args);
      // tslint:disable-next-line:no-invalid-this
      Object.defineProperty(this, methodName, {
        configurable,
        enumerable,
        value,
      });

      return value;
    }
  };
}

function decorateNew(args: any[], desc: ProposalDescriptor): ProposalDescriptor {
  if (desc.kind !== 'method') {
    throw new Error(ERR_NOT_A_METHOD);
  }

  const descriptor: PropertyDescriptor = desc.descriptor || desc;
  const method = desc.method || descriptor.value;

  if (!method) {
    throw new Error(ERR_NOT_A_METHOD);
  }

  const extras: ProposalDescriptor['extras'] = (desc.extras = desc.extras ? desc.extras.slice() : []);

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
  return function ApplyBoundMethod(
    targetOrDescriptor: any,
    method: PropertyKey,
    desc: PropertyDescriptor
  ): ProposalDescriptor | PropertyDescriptor {
    return method ? decorateLegacy(args, method, desc) : decorateNew(args, targetOrDescriptor);
  };
}
