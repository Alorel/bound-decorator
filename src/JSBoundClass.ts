import {
  _assertThisInitialized,
  _classCallCheck,
  _getPrototypeOf,
  _inherits,
  _possibleConstructorReturn
} from './_babelHelpers';
import {performBinding} from './performBinding';

//tslint:disable

/** @internal */
export function JSBoundClass() {
  return function (construct: any): any {
    return (
      /*#__PURE__*/
      function (_construct: any): any {
        _inherits(ClassWithBindings, _construct);

        function ClassWithBindings(this: any): any {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, ClassWithBindings);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ClassWithBindings)).call.apply(_getPrototypeOf2, [this].concat(args)));
          //@ts-ignore
          (0, performBinding)(_assertThisInitialized(_this));
          return _this;
        }

        return ClassWithBindings;
      }(construct)
    );
  };
}

Object.defineProperty(JSBoundClass, 'perform', {
  configurable: false,
  enumerable: true,
  value: performBinding,
  writable: false
});

//# sourceMappingURL=tmp.js.map
