const {expect} = require('chai');
const {BoundClass, BoundMethod} = require('../dist');
const {boundMethods, bindingPerformed, boundMethodArgs} = require('../dist/symbols');
const _ = require('lodash');

const isNew = TEST_TYPE === 'new';

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

  if (!isNew) {
    describe('Bound class (internal)', () => {
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
    });
  }
});
