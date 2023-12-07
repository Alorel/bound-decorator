import {expect} from 'chai';
import {BoundMethod} from './index';

/* eslint-disable @typescript-eslint/no-magic-numbers,no-empty-function */

const STATIC_MUL = 2;
const src: number[] = [-5, 0, 1, 5, 10];

describe('Static', () => {
  class Foo {
    public static readonly multiplier = 10;

    @BoundMethod()
    public static asIs(value: number): number {
      return value * this.multiplier;
    }

    @BoundMethod(STATIC_MUL)
    public static constant(value: number): number {
      return value * this.multiplier;
    }
  }


  it('as is', () => {
    expect(src.map(Foo.asIs)).to.deep.eq(src.map(v => v * Foo.multiplier));
  });

  it('constant', () => {
    expect(src.map(Foo.constant)).to.deep.eq(Array(src.length).fill(Foo.multiplier * STATIC_MUL));
  });
});

describe('Instance', () => {

  class Foo {
    public readonly multiplier = 10;

    @BoundMethod()
    public asIs(value: number): number {
      return value * this.multiplier;
    }

    @BoundMethod(STATIC_MUL)
    public constant(value: number): number {
      return value * this.multiplier;
    }
  }
  let inst: Foo;

  before(() => {
    inst = new Foo();
  });

  it('as is', () => {
    expect(src.map(inst.asIs)).to.deep.eq(src.map(v => v * inst.multiplier));
  });

  it('constant', () => {
    expect(src.map(inst.constant)).to.deep.eq(Array(src.length).fill(inst.multiplier * STATIC_MUL));
  });
});
