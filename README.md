# Bound decorator

[![Build Status](https://travis-ci.com/Alorel/bound-decorator.svg?branch=1.1.0)](https://travis-ci.com/Alorel/bound-decorator)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/bound-decorator/badge.svg?branch=1.1.0)](https://coveralls.io/github/Alorel/bound-decorator?branch=1.1.0)

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
