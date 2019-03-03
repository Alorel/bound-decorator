const {expect} = require('chai');
const {TSBoundClass, JSBoundClass, BoundMethod} = require('../dist');
const {boundMethods, bindingPerformed, boundMethodArgs} = require('../dist/symbols');
const _ = require('lodash');

const isNew = TEST_TYPE === 'new';

// const BoundClass = TEST_TYPE === 'typescript' ? TSBoundClass : JSBoundClass;
const BoundClass = TSBoundClass;

describe(_.startCase(TEST_TYPE), function () {
  describe('.perform() descriptor', () => {
    let desc;
    before(() => {
      desc = Object.getOwnPropertyDescriptor(BoundClass, 'perform');
    });

    it('Should be non-configurable', () => {
      expect(desc.configurable).to.eq(false);
    });

    it('Should be enumerable', () => {
      expect(desc.enumerable).to.eq(true);
    });

    it('Should be non-writable', () => {
      expect(desc.writable).to.eq(false);
    });

    it('Should be a function', () => {
      expect(typeof desc.value).to.eq('function');
    });
  });

  describe('BoundMethod (internal)', () => {
    it('Should fail when decorating statics', () => {
      expect(() => {
        class C {
          @BoundMethod()
          static method() {
          }
        }
      }).to.throw('@BoundMethod can only decorate instance methods')
    });

    it('Should fail when decorating non-methods', () => {
      expect(() => {
        class C {
          @BoundMethod()
          prop;
        }
      }).to.throw();
    });

    if (!isNew) {
      describe('Internal symbols', () => {
        let Clazz;

        before(() => {
          class Class {
            @BoundMethod()
            noArgMethod() {
            }

            @BoundMethod('foo', 'bar')
            argMethod() {

            }
          }

          Clazz = Class;
        });

        it('boundMethods should contain both methods', () => {
          expect(Clazz.prototype[boundMethods]).to.deep.eq(['noArgMethod', 'argMethod']);
        });

        it('boundMethodArgs should contain args', () => {
          expect(Clazz.prototype[boundMethodArgs]).to.deep
            .eq([[], ['foo', 'bar']]);
        });

        it('bindingPerformed object should not be defined', () => {
          expect(Clazz.prototype[bindingPerformed]).to.be.undefined;
        });
      });
    }
  });

  describe.only('Bound class (internal)', () => {
    if (isNew) {
      it.skip('Should throw if the class is decorated', () => {
        expect(() => {
          @BoundClass()
          class Class {
            @BoundMethod()
            boundMethod() {
            }
          }

          new Class();
        }).to.throw();
      })
    } else {
      let Clazz, inst;

      before('Init class', () => {
        @BoundClass()
        class TestClass {
          @BoundMethod()
          boundMethod() {
          }
        }

        Clazz = TestClass;
        inst = new TestClass();
      });

      it('bindingPerformed should not exist on the prototype', () => {
        expect(Clazz.prototype[bindingPerformed]).to.be.undefined;
      });

      it('bindingPerformed should exist on instance', () => {
        expect(inst[bindingPerformed]).to.deep.eq({boundMethod: true});
      });
    }
  })
});
