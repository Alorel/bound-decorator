# Bound decorator

[![Build Status](https://travis-ci.com/Alorel/bound-decorator.svg?branch=1.0.1)](https://travis-ci.com/Alorel/bound-decorator)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/bound-decorator/badge.svg?branch=1.0.1)](https://coveralls.io/github/Alorel/bound-decorator?branch=1.0.1)
[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/bound-decorator.svg)](https://greenkeeper.io/)

-----

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Compatibility](#compatibility)
- [Polyfills](#polyfills)
- [Usage](#usage)
  - [TypeScript and Legacy Babel Decorators](#typescript-and-legacy-babel-decorators)
  - [Babel Decorators - Current Proposal](#babel-decorators---current-proposal)
  - [General usage note (Typescript and Babel Legacy only)](#general-usage-note-typescript-and-babel-legacy-only)
  - [Note for Angular developers (Typescript and Babel Legacy-only)](#note-for-angular-developers-typescript-and-babel-legacy-only)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

```
npm install @aloreljs/bound-decorator
```

Both Babel and Typescript currently struggle when mixing transpiled ES5 and non-transpiled ES6 classes together.
You need to make sure to configure your build environment to import the correct version of the decorator.
Below is a table of the decorator's main fields and their compatibility:

|          Field         	| ES5 	| ES6 	|
|-----------------------:	|:---:	|:---:	|
| main (node.js default) 	|     	|  x  	|
|         module         	|  x  	|     	|
|         browser        	|  x  	|     	|
|          esm5          	|  x  	|     	|
|         esm2015        	|     	|  x  	|
|          fesm5         	|  x  	|     	|
|        fesm2015        	|     	|  x  	|

Frontend bundlers typically use the `browser` or `module` field by default.

# Compatibility

- Typescript - full
- Spec-compliant decorator proposal - full
- Babel (current proposal) - full
- Babel (legacy) - full

# Polyfills

While no polyfills should be required for Node, you should ensure that the following
are available in the browser:

- Symbol constructor
- Object.defineProperty

# Usage

Usage depends on whether you're using Babel with the current decorators proposal or Typescript/Babel with the legacy decorator proposal.

## TypeScript and Legacy Babel Decorators

```javascript
import {BoundClass, BoundMethod} from '@aloreljs/bound-decorator';

@BoundClass()
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
}
```

## Babel Decorators - Current Proposal

The api remains the same, but `@BoundClass()` is not needed:

```javascript
import {BoundMethod} from '@aloreljs/bound-decorator';

class MyClass {
  @BoundMethod()
  method() {}
}
```

## General usage note (Typescript and Babel Legacy only)

Note that the methods get bound **after** the constructor is executed, therefore
they will not be bound yet if called from inside the constructor.

This will work:

```javascript
@BoundClass()
class MyClass {
  constructor() {
    this.multiplier = 5;
  }
  
  @BoundMethod()
  method(num) {
    return num * this.multiplier;
  }
}

const instance = new MyClass();
const arr = [1, 2, 3].map(instance.method);
```

This will not:

```javascript
@BoundClass()
class MyClass {
  constructor() {
    this.multiplier = 5;
    const arr = [1, 2, 3].map(this.method);
  }
  
  @BoundMethod()
  method(num) {
    return num * this.multiplier;
  }
}
```

Should you absolutely need to perform bound operations inside the constructor,
you can refactor the above class as follows:

```javascript
// @BoundClass() is no longer needed
class MyClass {
  constructor() {
    BoundClass.perform(this); // As it was moved here
    this.multiplier = 5;
    const arr = [1, 2, 3].map(this.method);
  }
  
  @BoundMethod() // @BoundMethod() is still required
  method(num) {
    return num * this.multiplier;
  }
}
```

## Note for Angular developers (Typescript and Babel Legacy-only)

`@BoundClass()` will break injected properties. You need to use the `BoundClass.perform(this);` syntax.
