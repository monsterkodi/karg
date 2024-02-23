// monsterkodi/kode 0.250.0

var _k_

var args

args = require('../../')(`
minimal
    file  . * . ? arg help
    `)
console.log(require('noon').stringify(args,{colors:true}))