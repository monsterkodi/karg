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
clone    = require 'lodash.clone'

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
    
    if isString config
        config = noon.parse config
    else
        config = clone config

    name   = Object.keys(config)[0] # the application/script name
    result = {} # the object we are creating from the provided arguments and the configuration
    help   = {} # maps shortcut keys to help texts
    short  = {} # maps shortcut keys to long key names
    param  = ''
    paramList = false
    
    for k,v of clone config[name]
        
        if 0 <= k.indexOf ' '
            error """
            wrong karg setup: #{"keys can't contain spaces!".bold}
            broken key: #{k.bold.yellow}
            """
            process.exit 1
        
        if v['=']? then result[k] = v['=']
        
        sht = v['-']? and v['-'] or k[0]
        
        if k != k.toLowerCase()
            delete config[name][k]
            k = k.toLowerCase()
            config[name][k] = v
            
        if '*' in Object.keys v
            param = k
        else if '**' in Object.keys v
            param = k
            paramList = true
            result[param] = []
        else
            short[sht] = k
            help[sht] = v['?']

    ###
     0000000   00000000   000000000  000   0000000   000   000   0000000
    000   000  000   000     000     000  000   000  0000  000  000     
    000   000  00000000      000     000  000   000  000 0 000  0000000 
    000   000  000           000     000  000   000  000  0000       000
     0000000   000           000     000   0000000   000   000  0000000 
    ###
    
    optionsText = ""
    
    maxArgLength = 0
    maxHelpLength = 0
    for sht,lng of short
        if help[sht]?
            maxArgLength  = Math.max(maxArgLength, sht.length+lng.length)
            maxHelpLength = Math.max(maxHelpLength, help[sht].strip.length)
            
    for sht,lng of short
        if help[sht]?
            df = switch result[lng]
                when false then '✘'.red.dim
                when true  then '✔'.green.bold
                else result[lng]
            optionsText += '\n'
            optionsText += "    #{'-'.gray}#{s}#{', --'.gray}#{lng}"
            optionsText += "    #{padEnd '', Math.max(0,maxArgLength-sht.length-lng.length)} #{help[sht]}".gray.bold
            optionsText += "    #{padEnd '', Math.max(0,maxHelpLength-help[sht].strip.length)} #{df}".magenta if df?

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
        helpText += "\n#{padEnd '        '+p, maxArgLength+9} #{config[name][param]['?'].gray}".yellow.bold
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

    options.ignoreArgs ?= 2
    expandedArgs = expand process.argv.slice options.ignoreArgs
    
    while arg = expandedArgs.shift()
            
        if arg.substr(0,2) == '--'
            arg = arg.substr 2
        else if arg[0] == '-'
            arg = short[arg.substr 1]
        else 
            if paramList
                result[param].push arg
            else
                result[param] = arg
            continue
            
        if arg == 'help'
            log helpText
            return if options.dontExit
            process.exit()
        else if arg == 'version' and version?
            log version
            return if options.dontExit
            process.exit()
            
        if result[arg] == false or result[arg] == true
            result[arg] = not result[arg]
        else if not isNaN parseInt result[arg]
            result[arg] = parseInt a.shift()
        else if arg in values short
            result[arg] = a.shift()
        else
            if paramList
                result[param].push arg
            else
                result[param] = arg
    result

module.exports = parse
