
args = require('../../') """

complex
    additional    . ? unnamed arguments   . **
    empty         . ? has no default
    string        . ? has string default  . = string
    int           . ? has integer default . = 6
    float         . ? has float default   . = 1.23
    changed-abbr  . ? has -C as abbr      . - C . = cool
    no-abbr       . ? has no abbr         . - - . = uncool
    
help
    some topic  some text  
    another topix  more help
    
version       1.0.0

"""

console.log require('noon').stringify args, colors:true
