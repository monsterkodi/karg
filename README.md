### karg

is the german word for **meager, barren, sparse**

### karg

is also an option parser  
with **meager features**  
but **simple setup**  
and **pretty output**

### meager features

does just the bare minimum of what I need in my projects:

- short and long option names
- list of unnamed arguments
- boolean toggle
- dictionary output

### simple setup

the setup is done with a single noon string:

```coffee
args = require('kargs') """

scriptname
    anOption  . ? some description  . = default value
    boolean   . ? -b to turn it on  . = false
    switch    . ? -s to turn it off . = true
    invisible                       . = a 'hidden' option
    
additional help topic
    some help
    
version       1.0.0

"""
``` 

### pretty output

![karg](https://raw.githubusercontent.com/monsterkodi/karg/master/karg.png)
