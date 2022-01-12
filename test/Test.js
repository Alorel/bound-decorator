const {expect} = require('chai');
const {BoundMethod} = require('../dist');
const _ = require('lodash');

describe(_.startCase(TEST_TYPE), function () {
  describe('Trying to decorate a non-method', () => {
    const cases = [
      ['props', () => {
        class C {
          @BoundMethod()
          prop;
        }
      }],
      ['static props', () => {
        class C {
          @BoundMethod()
          static prop;
        }
      }],
      ['classes', () => {
        @BoundMethod()
        class C {
        }
      }],
      ['getters', () => {
        class C {
          @BoundMethod()
          get prop() {
          };
        }
      }],
      ['setters', () => {
        class C {
          @BoundMethod()
          set prop(_v) {
          };
        }
      }],
      ['static getters', () => {
        class C {
          @BoundMethod()
          static get prop() {
          };
        }
      }],
      ['static setters', () => {
        class C {
          @BoundMethod()
          static set prop(_v) {
          };
        }
      }]
    ];

    for (const [label, fn] of cases) {
      it(`Should fail on ${label}`, () => {
        expect(fn).to.throw('@BoundMethod can only decorate methods');
      })
    }
  });

  it('Should work on instance methods', () => {
    class C {
      constructor() {
        this.value = 2;
      }

      @BoundMethod()
      filter(v) {
        return v % this.value === 0;
      }
    }

    const result = [0, 1, 2, 3, 4, 5, 6].filter(new C().filter);
    expect(result).to.deep.eq([0, 2, 4, 6]);
  });

  it('Should work on static methods', () => {
    class C {
      static value = 3;

      @BoundMethod()
      static filter(v) {
        return v % this.value === 0;
      }
    }

    const result = [0, 1, 2, 3, 4, 5, 6].filter(C.filter);
    expect(result).to.deep.eq([0, 3, 6]);
  });
});
