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
log    = console.log

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
00000000  00000000   00000000    0000000   00000000 
000       000   000  000   000  000   000  000   000
0000000   0000000    0000000    000   000  0000000  
000       000   000  000   000  000   000  000   000
00000000  000   000  000   000   0000000   000   000
###

error = (msg) ->
    s = "[".dim.red + "ERROR".bold.dim.red + "] ".dim.red 
    s += msg.trim().split('\n').join("\n        ").red
    log s

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
        
        if 0 <= k.indexOf ' '
            error """
            wrong karg setup: #{"keys can't contain spaces!".bold}
            broken key: #{k.bold.yellow}
            """
            process.exit 1
        
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
    h += "#{'['.gray}#{'options'.bold.gray}#{']'.gray} " if 1 < _.size short
    h += "#{'['.gray}#{p.bold.yellow}#{l and (' ... ]'.gray) or (']'.gray)}"
    h += '\n'
    if c[n][p]?['?']
        h += "\n#{_.padEnd '       '+p, 21} #{c[n][p]['?'].gray}".yellow.bold
        h += "  #{_.padEnd '', Math.max(0,30-c[n][p]['?'].strip.length)} #{c[n][p]['=']}".magenta if c[n][p]['=']? and not l
        h += '\n'
    oh = ""
    for s,k of short
        if help[s]?
            df = switch r[k]
                when false then '✘'.red.dim
                when true  then '✔'.green.bold
                else r[k]
            oh += '\n'
            oh += "  #{'-'.gray}#{s}#{', --'.gray}#{k}"
            oh += "  #{_.padEnd '', Math.max(0,12-s.length-k.length)} #{help[s]}".gray.bold
            oh += "  #{_.padEnd '', Math.max(0,30-help[s].strip.length)} #{df}".magenta if df?
    if oh.length
        h += "\noptions:\n".gray
        h += oh
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
            
        if k.substr(0,2) == '--'
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
            log h
            process.exit()
        else if k == 'version' and version?
            log version
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
