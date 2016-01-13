###
000   000   0000000   00000000    0000000 
000  000   000   000  000   000  000      
0000000    000000000  0000000    000  0000
000  000   000   000  000   000  000   000
000   000  000   000  000   000   0000000 
###

noon   = require 'noon'
colors = require 'colors'
_      = require 'lodash'

###
00000000  000   000  00000000    0000000   000   000  0000000  
000        000 000   000   000  000   000  0000  000  000   000
0000000     00000    00000000   000000000  000 0 000  000   000
000        000 000   000        000   000  000  0000  000   000
00000000  000   000  000        000   000  000   000  0000000  
###

expand = (l) ->
    for a in l 
        if match = /^\-(\w\w+)$/.exec a
            a = match[1].split('').map (i) -> '-'+i
            a.unshift l.indexOf(match.input), 1
            l.splice.apply l, a
            return expand l
    l

###
00000000    0000000   00000000    0000000  00000000
000   000  000   000  000   000  000       000     
00000000   000000000  0000000    0000000   0000000 
000        000   000  000   000       000  000     
000        000   000  000   000  0000000   00000000
###

parse = (config) ->
    
    a = expand process.argv.slice 2
    c = noon.parse config
    n = Object.keys(c)[0]
    r = {}
    p = ''
    l = false
    help = {}
    short = {}

    for k,v of c[n]
        if v['=']? then r[k] = v['=']
        s = v['-']? and v['-'] or k[0]
        if '*' in Object.keys v
            p = k
        else if '**' in Object.keys v
            p = k
            l = true
            r[p] = []
        else
            short[s] = k
            help[s] = v['?']

    h = "\n#{'usage:'.gray} #{n.bold} "
    h += "#{'['.gray}#{'options'.bold.gray}#{']'.gray} "
    h += "#{'['.gray}#{p.bold.yellow}#{l and (' ... ]'.gray) or (']'.gray)}"
    h += '\n'
    h += "\n#{_.padEnd '       '+p, 21} #{c[n][p]['?'].gray}".yellow.bold
    h += "  #{_.padEnd '', Math.max(0,30-c[n][p]['?'].length)} #{c[n][p]['=']}".magenta if c[n][p]['=']? and not l
    h += '\n'
    h += "\noptions:\n".gray
    
    for s,k of short
        if help[s]?
            h += '\n'
            h += "  #{'-'.gray}#{s}#{', --'.gray}#{k}"
            h += "  #{_.padEnd '', Math.max(0,12-s.length-k.length)} #{help[s]}".gray.bold
            h += "  #{_.padEnd '', Math.max(0,30-help[s].length)} #{r[k]}".magenta if r[k]?
    h += '\n\n'
    
    short['h'] = 'help'
    
    if c['version']?
        version = c['version']
        delete c['version']
        short['V'] = 'version'
        
    delete c[n]
    if not _.isEmpty c
        h += noon.stringify c, 
            maxalign: 21
            colors: 
                key:     colors.gray
                string:  colors.white
        h += '\n'
        
    while a.length
        k = a.shift()
            
        if k.startsWith '--'
            k = k.substr 2
        else if k[0] == '-'
            k = short[k.substr 1]
        else 
            if l
                r[p].push k
            else
                r[p] = k
            continue
            
        if k == 'help'
            console.log h
            process.exit()
        else if k == 'version' and version?
            console.log version
            process.exit()
            
        if r[k] == false or r[k] == true
            r[k] = not r[k]
        else if not isNaN parseInt r[k]
            r[k] = parseInt a.shift()
        else if k in _.values short
            r[k] = a.shift()
        else
            if l
                r[p].push k
            else
                r[p] = k
    r

module.exports = parse
