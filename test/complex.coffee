
args = require('../') """

complex
    additional  . ? unnamed arguments . **
    emptyOption . ? has no default
    changedAbbr . ? has -C as abbr    . - C
    oneArg      . ? has one argument  . + 1
    twoArg      . ? has two arguments . + 2
    
version       1.0.0

"""

console.log require('noon').stringify args, colors:true
