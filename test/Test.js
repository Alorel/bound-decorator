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

  describe('Runtime test', () => {
    class BaseClass {
      constructor(num = 2) {
        this.INSTANCE_NUM = num;
      }

      @BoundMethod()
      mapper1(num) {
        return num * this.INSTANCE_NUM;
      }

      @BoundMethod(5)
      mapper2(num) {
        return num * this.INSTANCE_NUM;
      }

      @BoundMethod()
      mapper3(num) {
        return num * this.INSTANCE_NUM;
      }
    }

    if (isNew) {
      describe('Undecorated class', () => {
        let inst;

        before('Instantiate', () => {
          inst = new BaseClass();
        });

        it('mapper1 should return [2, 4]', () => {
          expect([1, 2].map(inst.mapper1)).to.deep.eq([2, 4]);
        });

        it('mapper2 should return [10, 10]', () => {
          expect([1, 2].map(inst.mapper2)).to.deep.eq([10, 10]);
        });

        describe('Should be able to map from inside constructor', () => {
          let res;

          before('Run', () => {
            class C2 extends BaseClass {
              constructor() {
                super();
                this.r1 = [1, 2].map(this.mapper1);
                this.r2 = [1, 2].map(this.mapper2);
              }
            }

            res = new C2();
          });

          it('mapper1 should return [2, 4]', () => {
            expect(res.r1).to.deep.eq([2, 4]);
          });

          it('mapper2 should return [10, 10]', () => {
            expect(res.r2).to.deep.eq([10, 10]);
          });
        });
      });
    }

    describe('Base instance', () => {
      let inst;

      before('Instantiate', () => {
        @BoundClass()
        class BoundBaseClass extends BaseClass {
        }

        inst = new BoundBaseClass();
      });

      it('mapper1 should return [2, 4]', () => {
        expect([1, 2].map(inst.mapper1)).to.deep.eq([2, 4]);
      });

      it('mapper2 should return [10, 10]', () => {
        expect([1, 2].map(inst.mapper2)).to.deep.eq([10, 10]);
      });
    });

    describe('Inherited instance', () => {
      let inst;

      before('Instantiate', () => {
        @BoundClass()
        class BoundInheritedClass extends BaseClass {
          constructor() {
            super(5);
          }

          @BoundMethod(10)
          mapper1(num) {
            return num * this.INSTANCE_NUM;
          }

          @BoundMethod()
          mapper2(num) {
            return num * this.INSTANCE_NUM;
          }

          @BoundMethod()
          mapper3(num) {
            return (num * this.INSTANCE_NUM) + 1000;
          }

          @BoundMethod()
          mapper4() {
            return this.INSTANCE_NUM;
          }
        }

        inst = new BoundInheritedClass();
      });

      it('mapper1 should return [50, 50]', () => {
        expect([1, 2].map(inst.mapper1)).to.deep.eq([50, 50]);
      });

      it('mapper2 should return [5, 10]', () => {
        expect([1, 2].map(inst.mapper2)).to.deep.eq([5, 10]);
      });

      it('mapper3 should return [1005, 1010]', () => {
        expect([1, 2].map(inst.mapper3)).to.deep.eq([1005, 1010]);
      });

      it('base mapper3 should return [4, 8]', () => {
        @BoundClass()
        class NewBase extends BaseClass {
          constructor() {
            super(4);
          }
        }

        const nb = new NewBase();
        expect([1, 2].map(nb.mapper3)).to.deep.eq([4, 8]);
      });

      it('mapper4 should return [5, 5]', () => {
        expect([1, 2].map(inst.mapper4)).to.deep.eq([5, 5]);
      });
    })
  });

  describe('Static method decorations', () => {
    class Clazz {
      static multiplier = 2;

      @BoundMethod()
      static multiply(inp) {
        return inp * this.multiplier;
      }
    }

    it('Should bind without @BoundClass', () => {
      expect(Clazz.multiply(2)).to.equal(4);
    });
  });
});
