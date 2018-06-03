###
000   000   0000000   00000000    0000000 
000  000   000   000  000   000  000      
0000000    000000000  0000000    000  0000
000  000   000   000  000   000  000   000
000   000  000   000  000   000   0000000 
###

log      = console.log
noon     = require 'noon'
colors   = require 'colors'
isEmpty  = require 'lodash.isempty'
padEnd   = require 'lodash.padend'
size     = require 'lodash.size'
values   = require 'lodash.values'
isString = require 'lodash.isstring'

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

# options: 
#     dontExit:    don't exit process on -V/--version or -h/--help  (returns undefined instead)

parse = (config, options={}) ->
    
    options.ignoreArgs ?= 2
    a = expand process.argv.slice options.ignoreArgs
    if isString config
        config = noon.parse config

    n = Object.keys(config)[0]
    r = {}
    p = ''
    l = false
    help = {}
    short = {} # maps shortcut keys to long key names
    
    for k,v of config[n]
        
        if 0 <= k.indexOf ' '
            error """
            wrong karg setup: #{"keys can't contain spaces!".bold}
            broken key: #{k.bold.yellow}
            """
            process.exit 1
        
        if v['=']? then r[k] = v['=']
        s = v['-']? and v['-'] or k[0]
        k = k.toLowerCase()
        if '*' in Object.keys v
            p = k
        else if '**' in Object.keys v
            p = k
            l = true
            r[p] = []
        else
            short[s] = k
            help[s] = v['?']

    ###
     0000000   00000000   000000000  000   0000000   000   000   0000000
    000   000  000   000     000     000  000   000  0000  000  000     
    000   000  00000000      000     000  000   000  000 0 000  0000000 
    000   000  000           000     000  000   000  000  0000       000
     0000000   000           000     000   0000000   000   000  0000000 
    ###
    
    oh = ""
    
    maxKeyLength = 0
    maxHelpLength = 0
    for s,k of short
        if help[s]?
            maxKeyLength = Math.max(maxKeyLength, s.length+k.length)
            maxHelpLength = Math.max(maxHelpLength, help[s].strip.length)
            
    for s,k of short
        if help[s]?
            df = switch r[k]
                when false then '✘'.red.dim
                when true  then '✔'.green.bold
                else r[k]
            oh += '\n'
            oh += "    #{'-'.gray}#{s}#{', --'.gray}#{k}"
            oh += "    #{padEnd '', Math.max(0,maxKeyLength-s.length-k.length)} #{help[s]}".gray.bold
            oh += "    #{padEnd '', Math.max(0,maxHelpLength-help[s].strip.length)} #{df}".magenta if df?

    ###
    000   000  00000000  000      00000000 
    000   000  000       000      000   000
    000000000  0000000   000      00000000 
    000   000  000       000      000      
    000   000  00000000  0000000  000      
    ###
    
    h = "\n#{'usage:'.gray}  #{n.bold} "
    h += "#{'['.gray}#{'options'.bold.gray}#{']'.gray} " if 1 < size short
    h += "#{'['.gray}#{p.bold.yellow}#{l and (' ... ]'.gray) or (']'.gray)}"
    h += '\n'
    if config[n][p]?['?']
        h += "\n#{padEnd '        '+p, maxKeyLength+9} #{config[n][p]['?'].gray}".yellow.bold
        h += "  #{padEnd '', Math.max(0,maxHelpLength-config[n][p]['?'].strip.length)} #{config[n][p]['=']}".magenta if config[n][p]['=']? and not l
        h += '\n'
            
    if oh.length
        h += "\noptions:\n".gray
        h += oh
        h += '\n\n'
    
    short['h'] = 'help'
    
    if config.version?
        version = config.version
        delete config.version
        short['V'] = 'version'
        
    delete config[n]
    if not isEmpty config
        h += noon.stringify config, 
            maxalign: 16
            colors: 
                key:     colors.gray
                string:  colors.white
        h += '\n'
        
    ###
    00000000   00000000   0000000  000   000  000      000000000
    000   000  000       000       000   000  000         000   
    0000000    0000000   0000000   000   000  000         000   
    000   000  000            000  000   000  000         000   
    000   000  00000000  0000000    0000000   0000000     000   
    ###
        
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
            return if options.dontExit
            process.exit()
        else if k == 'version' and version?
            log version
            return if options.dontExit
            process.exit()
            
        if r[k] == false or r[k] == true
            r[k] = not r[k]
        else if not isNaN parseInt r[k]
            r[k] = parseInt a.shift()
        else if k in values short
            r[k] = a.shift()
        else
            if l
                r[p].push k
            else
                r[p] = k
    r

module.exports = parse
