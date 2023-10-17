# Bound decorator

An ES7 decorator for making class methods bound to the class instance (including statics).

[![MASTER CI status](https://github.com/Alorel/bound-decorator/actions/workflows/core.yml/badge.svg)](https://github.com/Alorel/bound-decorator/actions/workflows/core.yml?query=branch%3Amaster)
[![NPM badge](https://img.shields.io/npm/v/%40aloreljs/bound-decorator)](https://www.npmjs.com/package/%40aloreljs/bound-decorator)
[![dependencies badge](https://img.shields.io/librariesio/release/npm/%40aloreljs/bound-decorator)](https://libraries.io/npm/@aloreljs%2Fbound-decorator)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/bound-decorator/badge.svg)](https://coveralls.io/github/Alorel/bound-decorator)

-----

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Compatibility](#compatibility)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

```
npm install @aloreljs/bound-decorator
```

# Compatibility

The library's only goal is to be compatible with Typescript 5 decorators which, at the time of writing, use the [2022-03 stage 3 decorators proposal](https://2ality.com/2022/10/javascript-decorators.html).

# Usage

```javascript
import {BoundMethod} from '@aloreljs/bound-decorator';

class MyClass {
  
  @BoundMethod()
  method1() {
    // equivalent to
    // this.method1 = this.method1.bind(this);
  }
  
  @BoundMethod('a', 'b')
  method2(a, b, c) {
    // equivalent to
    // this.method2 = this.method2.bind(this, 'a', 'b');
  }

  @BoundMethod()
  static foo() {
    // Equivalent to
    // MyClass.foo = MyClass.foo.bind(MyClass);
  }
}
```
