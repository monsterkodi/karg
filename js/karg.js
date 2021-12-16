// monsterkodi/kode 0.133.0

var _k_ = {list: function (l) {return (l != null ? typeof l.length === 'number' ? l : [] : [])}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var expand, error, parse

require('klor').kolor.globalize()

expand = function (l)
{
    var a, match

    var list = _k_.list(l)
    for (var _20_10_ = 0; _20_10_ < list.length; _20_10_++)
    {
        a = list[_20_10_]
        if (match = /^\-(\w\w+)$/.exec(a))
        {
            a = match[1].split('').map(function (i)
            {
                return '-' + i
            })
            a.unshift(l.indexOf(match.input),1)
            l.splice.apply(l,a)
            return expand(l)
        }
    }
    return l
}

error = function (msg)
{
    var s

    s = dim(red("[" + bold("ERROR") + "] "))
    s += red(msg.trim().split('\n').join("\n        "))
    console.log(s)
}

parse = function (config, options = {})
{
    var pad, noon_parse, name, result, help, short, long, param, paramList, k, v, sht, optionsText, maxArgLength, maxHelpLength, lng, df, shtHelp, helpText, _164_18_, _167_21_, version, _171_29_, noon_stringify, _192_23_, argv, expandedArgs, addParam, addIgnored, addParamOrIgnore, arg

    pad = function (s, l)
    {
        s = String(s)
        while (s.length < l)
        {
            s += ' '
        }
        return s
    }
    if (typeof(config) === 'string')
    {
        noon_parse = require('noon/js/parse')
        config = noon_parse(config)
    }
    else
    {
        config = Object.assign({},config)
    }
    name = Object.keys(config)[0]
    result = {}
    help = {}
    short = {}
    long = {}
    param = ''
    paramList = false
    for (k in config[name])
    {
        v = config[name][k]
        if (0 <= k.indexOf(' '))
        {
            console.error(`wrong karg setup: ${bold("keys can't contain spaces!")}
broken key: ${bold(yellow(k))}`)
            process.exit(1)
        }
        if ((v['='] != null))
        {
            result[k] = v['=']
        }
        sht = k[0]
        if (v['-'])
        {
            sht = v['-']
        }
        if (sht === '-')
        {
            sht = ''
        }
        if (Array.isArray(v))
        {
            if (_k_.in('*',v))
            {
                param = k
            }
            else if (_k_.in('**',v))
            {
                param = k
                paramList = true
                result[param] = []
            }
            else
            {
                short[k] = sht
                if (sht !== '')
                {
                    long[sht] = k
                }
            }
        }
        else
        {
            if (_k_.in('*',Object.keys(v)))
            {
                param = k
            }
            else if (_k_.in('**',Object.keys(v)))
            {
                param = k
                paramList = true
                result[param] = []
            }
            else
            {
                short[k] = sht
                if (sht !== '')
                {
                    long[sht] = k
                }
                help[k] = v['?']
            }
        }
    }
    optionsText = ""
    maxArgLength = 0
    maxHelpLength = 0
    for (lng in short)
    {
        sht = short[lng]
        if ((help[lng] != null))
        {
            maxArgLength = Math.max(maxArgLength,sht.length + lng.length)
            maxHelpLength = Math.max(maxHelpLength,strip(help[lng]).length)
        }
    }
    for (lng in short)
    {
        sht = short[lng]
        if ((help[lng] != null))
        {
            df = ((function ()
            {
                switch (result[lng])
                {
                    case false:
                        return red(dim('✘'))

                    case true:
                        return green(bold('✔'))

                    default:
                        return result[lng]
                }

            }).bind(this))()
            shtHelp = sht !== '' ? `${gray('-')}${sht}` : '  '
            optionsText += '\n'
            optionsText += `    ${shtHelp}${gray('  --')}${lng}`
            optionsText += gray(bold(`    ${pad('',Math.max(0,maxArgLength - sht.length - lng.length))} ${help[lng]}`))
            if ((df != null))
            {
                optionsText += magenta(`    ${pad('',Math.max(0,maxHelpLength - strip(help[lng]).length))} ${df}`)
            }
        }
    }
    helpText = `\n${gray('usage:')}  ${bold(name)} `
    helpText += `${gray('[')}${bold(yellow(param))}${paramList && gray(' ... ]') || gray(']')}`
    helpText += '\n'
    if ((config[name][param] != null ? config[name][param]['?'] : undefined))
    {
        helpText += yellow(bold(`\n${pad('        ' + param,maxArgLength + 9)} ${gray(config[name][param]['?'])}`))
        if ((config[name][param]['='] != null) && !paramList)
        {
            helpText += magenta(`  ${pad('',Math.max(0,maxHelpLength - strip(config[name][param]['?']).length))} ${config[name][param]['=']}`)
        }
        helpText += '\n'
    }
    if (optionsText.length)
    {
        helpText += gray("\noptions:\n")
        helpText += optionsText
        helpText += '\n\n'
    }
    short['help'] = ((_164_18_=short['help']) != null ? _164_18_ : 'h')
    long['h'] = 'help'
    if ((config.version != null))
    {
        version = config.version
        delete config.version
        if (!long['V'])
        {
            short['version'] = ((_171_29_=short['version']) != null ? _171_29_ : 'V')
            long['V'] = 'version'
        }
    }
    delete config[name]
    if (Object.keys(config).length)
    {
        noon_stringify = require('noon/js/stringify')
        helpText += noon_stringify(config,{maxalign:16,colors:{key:gray,string:white}})
        helpText += '\n'
    }
    options.ignoreArgs = ((_192_23_=options.ignoreArgs) != null ? _192_23_ : 2)
    if (options.argv)
    {
        argv = options.argv
    }
    else
    {
        argv = process.argv.slice(options.ignoreArgs)
    }
    expandedArgs = expand(argv)
    addParam = function (arg)
    {
        if (paramList)
        {
            return result[param].push(arg)
        }
        else
        {
            return result[param] = arg
        }
    }
    addIgnored = function (arg)
    {
        if (!result['__ignored'])
        {
            result['__ignored'] = []
        }
        return result['__ignored'].push(arg)
    }
    addParamOrIgnore = function (arg)
    {
        if (param)
        {
            return addParam(arg)
        }
        else
        {
            return addIgnored(arg)
        }
    }
    while (arg = expandedArgs.shift())
    {
        if (arg.substr(0,2) === '--')
        {
            arg = arg.substr(2)
        }
        else if (arg[0] === '-')
        {
            if (!long[arg.substr(1)])
            {
                addIgnored(arg)
                continue
            }
            arg = long[arg.substr(1)]
        }
        else
        {
            addParamOrIgnore(arg)
            continue
        }
        if (arg === 'help')
        {
            if (options.returnLog)
            {
                return helpText
            }
            console.log(helpText)
            if (options.dontExit)
            {
                return
            }
            process.exit()
        }
        else if (arg === 'version' && (version != null))
        {
            if (options.returnLog)
            {
                return version
            }
            console.log(version)
            if (options.dontExit)
            {
                return
            }
            process.exit()
        }
        if (result[arg] === false || result[arg] === true)
        {
            result[arg] = !result[arg]
        }
        else if (!isNaN(Number(result[arg])))
        {
            result[arg] = parseFloat(expandedArgs.shift())
        }
        else if (_k_.in(arg,Object.keys(short)))
        {
            result[arg] = expandedArgs.shift()
        }
        else
        {
            addParamOrIgnore(arg)
        }
    }
    return result
}
module.exports = parse