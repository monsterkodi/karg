###
000   000   0000000   00000000    0000000 
000  000   000   000  000   000  000      
0000000    000000000  0000000    000  0000
000  000   000   000  000   000  000   000
000   000  000   000  000   000   0000000 
###

noon  = require 'noon'
chalk = require 'chalk'
_     = require 'lodash'

###
00000000    0000000   00000000    0000000  00000000
000   000  000   000  000   000  000       000     
00000000   000000000  0000000    0000000   0000000 
000        000   000  000   000       000  000     
000        000   000  000   000  0000000   00000000
###

parse = (config) ->
    
    a = process.argv.slice 2
    c = noon.parse config
    n = Object.keys(c)[0]
    r = {}
    p = ''
    help = {}
    short =
        h: 'help'
        V: 'version'

    for k,v of c[n]
        if v['=']? then r[k] = v['=']
        s = v['-']? and v['-'] or k[0]
        short[s] = k
        if '*' in Object.keys v
            p = k
        else
            help[s] = v['?']

    h = "\n#{chalk.gray 'usage:'} #{chalk.bold n} "
    h += "#{chalk.gray '['}#{chalk.bold.gray 'options'}#{chalk.gray ']'} "
    h += "#{chalk.gray '['}#{chalk.bold.yellow p}#{chalk.gray ']'}\n"
    h += chalk.yellow.bold "\n#{_.padRight '       '+p, 21} #{chalk.gray c[n][p]['?']}\n"
    h += chalk.gray "\noptions:\n"
    
    for s,k of short
        if help[s]?
            h += '\n'
            h += "  #{chalk.gray '-'}#{s}, #{chalk.gray '--'}#{k}"
            h += chalk.gray.bold "  #{_.padRight '', Math.max(0,12-s.length-k.length)} #{help[s]}"
            h += chalk.magenta.bold "  #{_.padRight '', Math.max(0,30-help[s].length)} #{r[k]}"
    h += '\n'
    
    while a.length
        k = a.shift()
        
        if k.startsWith '--'
            k = k.substr 2
        else if k[0] == '-'
            k = short[k.substr 1]
            
        if k == 'help'
            console.log h
            process.exit()
        else if k == 'version'
            console.log c[n][k]['=']
            process.exit()
            
        if r[k] == false or r[k] == true
            r[k] = not r[k]
        else if not isNaN parseInt r[k]
            r[k] = parseInt a.shift()
        else if r[k]?
            r[k] = a.shift()
        else
            r[p] = k
    r

module.exports = parse
