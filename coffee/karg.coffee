###
000   000   0000000   00000000    0000000 
000  000   000   000  000   000  000      
0000000    000000000  0000000    000  0000
000  000   000   000  000   000  000   000
000   000  000   000  000   000   0000000 
###

require('klor').kolor.globalize()
    
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
    s = dim red "[" + bold("ERROR") + "] "
    s += red msg.trim().split('\n').join("\n        ")
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
    
    pad = (s, l) ->
        s = String s
        while s.length < l then s += ' '
        s
    
    if typeof(config) == 'string'
        noon_parse = require 'noon/js/parse'
        config = noon_parse config
    else
        config = Object.assign {}, config
            
    name   = Object.keys(config)[0] # the application/script name
    result = {} # the object created from the provided arguments and the configuration
    help   = {} # maps shortcut keys to help texts
    short  = {} # maps shortcut keys to long key names
    param  = '' # name of non-option parameters
    paramList = false
    
    for k,v of config[name]
        
        if 0 <= k.indexOf ' '
            error """
            wrong karg setup: #{bold "keys can't contain spaces!"}
            broken key: #{bold yellow k}
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
            maxHelpLength = Math.max(maxHelpLength, strip(help[sht]).length)
            
    for sht,lng of short
        if help[sht]?
            df = switch result[lng]
                when false then red dim '✘'
                when true  then green bold '✔'
                else result[lng]
            optionsText += '\n'
            optionsText += "    #{gray '-'}#{sht}#{gray ', --'}#{lng}"
            optionsText += gray bold "    #{pad '', Math.max(0,maxArgLength-sht.length-lng.length)} #{help[sht]}"
            optionsText += magenta "    #{pad '', Math.max(0,maxHelpLength-strip(help[sht]).length)} #{df}" if df?

    ###
    000   000  00000000  000      00000000 
    000   000  000       000      000   000
    000000000  0000000   000      00000000 
    000   000  000       000      000      
    000   000  00000000  0000000  000      
    ###
    
    helpText  = "\n#{gray 'usage:'}  #{bold name} "
    helpText += "#{gray '['}#{bold gray 'options'}#{gray ']'} " if 1 < Object.keys(short)
    helpText += "#{gray '['}#{bold yellow param}#{paramList and gray(' ... ]') or gray(']')}"
    helpText += '\n'
    if config[name][param]?['?']
        helpText += yellow bold "\n#{pad '        '+param, maxArgLength+9} #{gray config[name][param]['?']}"
        helpText += magenta("  #{pad '', Math.max(0,maxHelpLength-strip(config[name][param]['?']).length)} #{config[name][param]['=']}") if config[name][param]['=']? and not paramList
        helpText += '\n'
            
    if optionsText.length
        helpText += gray "\noptions:\n"
        helpText += optionsText
        helpText += '\n\n'
    
    short['h'] ?= 'help'
    
    if config.version?
        version = config.version
        delete config.version
        short['V'] ?= 'version'
        
    delete config[name]
    if Object.keys(config).length 
        noon_stringify = require 'noon/js/stringify'
        helpText += noon_stringify config, 
            maxalign: 16
            colors: 
                key:     gray
                string:  white
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
        else if not isNaN Number result[arg]
            result[arg] = parseFloat expandedArgs.shift()
        else if arg in Object.keys(short).map((k) -> short[k])
            result[arg] = expandedArgs.shift()
        else
            addParamOrIgnore arg
    result

module.exports = parse
