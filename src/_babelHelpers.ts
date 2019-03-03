//tslint:disable

let _typeof: any = function (obj: any): any {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj: any): any {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj: any): any {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
    };
  }
  return _typeof(obj);
};

/** @internal */
export function _classCallCheck(instance: any, Constructor: any): any {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

/** @internal */
export function _possibleConstructorReturn(self: any, call: any): any {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

/** @internal */
export const _getPrototypeOf: any = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o: any): any {
  return o.__proto__ || Object.getPrototypeOf(o);
};
// export let _getPrototypeOf: any = function (o: any): any {
//   _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o: any): any {
//     return o.__proto__ || Object.getPrototypeOf(o);
//   };
//   return _getPrototypeOf(o);
// };

/** @internal */
export function _assertThisInitialized(self: any): any {
  if (self === void 0) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
  }
  return self;
}

/** @internal */
export function _inherits(subClass: any, superClass: any): any {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

let _setPrototypeOf = function (o: any, p: any): any {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o: any, p: any): any {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
};
