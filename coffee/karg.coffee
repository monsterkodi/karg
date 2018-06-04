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
#     ignoreArgs:  number of leading process.argv items to ignore (default=2)
#     argv:        list of string arguments to use instead of process.argv
#     dontExit:    don't exit process on -V/--version or -h/--help  (returns undefined instead)
#     returnLog:   help/version output is returned instead of logged (implies dontExit)

parse = (config, options={}) ->
    
    if isString config
        config = noon.parse config
    else
        config = clone config

    name   = Object.keys(config)[0] # the application/script name
    result = {} # the object created from the provided arguments and the configuration
    help   = {} # maps shortcut keys to help texts
    short  = {} # maps shortcut keys to long key names
    param  = '' # name of non-option parameters
    paramList = false
    
    for k,v of config[name]
        
        if 0 <= k.indexOf ' '
            error """
            wrong karg setup: #{"keys can't contain spaces!".bold}
            broken key: #{k.bold.yellow}
            """
            process.exit 1
        
        if v['=']? then result[k] = v['=']
        
        sht = v['-']? and v['-'] or k[0]
        
        if Array.isArray v
            if '*' in v
                param = k
            else if '**' in v
                param = k
                paramList = true
                result[param] = []
            else
                short[sht] = k
        else
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
            optionsText += "    #{'-'.gray}#{sht}#{', --'.gray}#{lng}"
            optionsText += "    #{padEnd '', Math.max(0,maxArgLength-sht.length-lng.length)} #{help[sht]}".gray.bold
            optionsText += "    #{padEnd '', Math.max(0,maxHelpLength-help[sht].strip.length)} #{df}".magenta if df?

    ###
    000   000  00000000  000      00000000 
    000   000  000       000      000   000
    000000000  0000000   000      00000000 
    000   000  000       000      000      
    000   000  00000000  0000000  000      
    ###
    
    helpText  = "\n#{'usage:'.gray}  #{name.bold} "
    helpText += "#{'['.gray}#{'options'.bold.gray}#{']'.gray} " if 1 < size short
    helpText += "#{'['.gray}#{param.bold.yellow}#{paramList and (' ... ]'.gray) or (']'.gray)}"
    helpText += '\n'
    if config[name][param]?['?']
        helpText += "\n#{padEnd '        '+param, maxArgLength+9} #{config[name][param]['?'].gray}".yellow.bold
        helpText += "  #{padEnd '', Math.max(0,maxHelpLength-config[name][param]['?'].strip.length)} #{config[name][param]['=']}".magenta if config[name][param]['=']? and not paramList
        helpText += '\n'
            
    if optionsText.length
        helpText += "\noptions:\n".gray
        helpText += optionsText
        helpText += '\n\n'
    
    short['h'] ?= 'help'
    
    if config.version?
        version = config.version
        delete config.version
        short['V'] ?= 'version'
        
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
    
    if options.argv
        argv = options.argv
    else
        argv = process.argv.slice options.ignoreArgs
        
    expandedArgs = expand argv

    addParam = (arg) ->
        if paramList
            result[param].push arg
        else
            result[param] = arg
            
    addIgnored = (arg) ->
        if not result['__ignored'] then result['__ignored'] = []
        result['__ignored'].push arg
        
    addParamOrIgnore = (arg) ->
        if param
            addParam arg
        else
            addIgnored arg
    
    while arg = expandedArgs.shift()
            
        if arg.substr(0,2) == '--'
            arg = arg.substr 2
        else if arg[0] == '-'
            if not short[arg.substr 1]
                addIgnored arg
                continue
            arg = short[arg.substr 1]
        else 
            addParamOrIgnore arg
            continue
            
        if arg == 'help'
            if options.returnLog then return helpText
            log helpText
            return if options.dontExit
            process.exit()
        else if arg == 'version' and version?
            if options.returnLog then return version
            log version
            return if options.dontExit
            process.exit()
            
        if result[arg] == false or result[arg] == true
            result[arg] = not result[arg]
        else if not isNaN parseFloat result[arg]
            result[arg] = parseFloat expandedArgs.shift()
        else if arg in values short
            result[arg] = expandedArgs.shift()
        else
            addParamOrIgnore arg
    result

module.exports = parse
