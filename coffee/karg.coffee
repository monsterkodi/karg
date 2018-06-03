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

    name   = Object.keys(config)[0]
    result = {}
    help   = {}
    short  = {} # maps shortcut keys to long key names
    param  = ''
    paramList = false
    
    for k,v of config[name]
        
        if 0 <= k.indexOf ' '
            error """
            wrong karg setup: #{"keys can't contain spaces!".bold}
            broken key: #{k.bold.yellow}
            """
            process.exit 1
        
        if v['=']? then result[k] = v['=']
        s = v['-']? and v['-'] or k[0]
        k = k.toLowerCase()
        if '*' in Object.keys v
            param = k
        else if '**' in Object.keys v
            param = k
            paramList = true
            result[param] = []
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
    
    optionsText = ""
    
    maxKeyLength = 0
    maxHelpLength = 0
    for s,k of short
        if help[s]?
            maxKeyLength = Math.max(maxKeyLength, s.length+k.length)
            maxHelpLength = Math.max(maxHelpLength, help[s].strip.length)
            
    for s,k of short
        if help[s]?
            df = switch result[k]
                when false then '✘'.red.dim
                when true  then '✔'.green.bold
                else result[k]
            optionsText += '\n'
            optionsText += "    #{'-'.gray}#{s}#{', --'.gray}#{k}"
            optionsText += "    #{padEnd '', Math.max(0,maxKeyLength-s.length-k.length)} #{help[s]}".gray.bold
            optionsText += "    #{padEnd '', Math.max(0,maxHelpLength-help[s].strip.length)} #{df}".magenta if df?

    ###
    000   000  00000000  000      00000000 
    000   000  000       000      000   000
    000000000  0000000   000      00000000 
    000   000  000       000      000      
    000   000  00000000  0000000  000      
    ###
    
    helpText  = "\n#{'usage:'.gray}  #{n.bold} "
    helpText += "#{'['.gray}#{'options'.bold.gray}#{']'.gray} " if 1 < size short
    helpText += "#{'['.gray}#{p.bold.yellow}#{l and (' ... ]'.gray) or (']'.gray)}"
    helpText += '\n'
    if config[name][param]?['?']
        helpText += "\n#{padEnd '        '+p, maxKeyLength+9} #{config[name][param]['?'].gray}".yellow.bold
        helpText += "  #{padEnd '', Math.max(0,maxHelpLength-config[name][param]['?'].strip.length)} #{config[name][param]['=']}".magenta if config[name][param]['=']? and not l
        helpText += '\n'
            
    if optionsText.length
        helpText += "\noptions:\n".gray
        helpText += optionsText
        helpText += '\n\n'
    
    short['h'] = 'help'
    
    if config.version?
        version = config.version
        delete config.version
        short['V'] = 'version'
        
    delete config[name]
    if not isEmpty config
        helpText += noon.stringify config, 
            maxalign: 16
            colors: 
                key:     colors.gray
                string:  colors.white
        helpText += '\n'
        
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
            if paramList
                result[param].push k
            else
                result[param] = k
            continue
            
        if k == 'help'
            log helpText
            return if options.dontExit
            process.exit()
        else if k == 'version' and version?
            log version
            return if options.dontExit
            process.exit()
            
        if result[k] == false or result[k] == true
            result[k] = not result[k]
        else if not isNaN parseInt result[k]
            result[k] = parseInt a.shift()
        else if k in values short
            result[k] = a.shift()
        else
            if paramList
                result[param].push k
            else
                result[param] = k
    result

module.exports = parse
