
![icon](./img/icon.png)

### karg

is the german word for **meager**, **barren**, **sparse**

### karg

is also an option parser with **meager features** but **simple setup** and **pretty output**

### meager features

does just the bare minimum:

- automatic help generation
- short and long option names
- unnamed arguments
- boolean toggle
- dictionary output

### simple setup

```coffee
args = require('karg') """

simple
    additional   unnamed arguments   **
    an-option    some description    = default
    boolean      -b to turn it on    = false
    switch       -s to turn it off   = true
    invisible                        = hidden
    
help
    some help
    
version       1.0.0

"""
``` 

### pretty help output

![karg](./img/karg.png)


[![npm package][npm-image]][npm-url] 
[![downloads][downloads-image]][downloads-url] 

[npm-image]:https://img.shields.io/npm/v/karg.svg
[npm-url]:http://npmjs.org/package/karg
[downloads-image]:https://img.shields.io/npm/dm/karg.svg
[downloads-url]:https://www.npmtrends.com/karg
