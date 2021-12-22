// monsterkodi/kode 0.181.0

var _k_ = {list: function (l) {return (l != null ? typeof l.length === 'number' ? l : [] : [])}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var error, expand, kstr, noon, parse

require('klor').kolor.globalize()
noon = require('noon')
kstr = require('kstr')

expand = function (l)
{
    var a, match

    var list = _k_.list(l)
    for (var _22_10_ = 0; _22_10_ < list.length; _22_10_++)
    {
        a = list[_22_10_]
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
    var addIgnored, addParam, addParamOrIgnore, arg, argv, cfg, df, expandedArgs, help, helpText, k, lng, lngHelp, long, long2key, maxHelp, maxLong, name, optionsText, org, param, paramList, result, short, short2key, sht, shtHelp, v, version, _206_19_, _207_21_, _209_21_, _212_28_, _213_23_, _232_23_

    if (typeof(config) === 'string')
    {
        config = noon.parse(config)
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
    cfg = config[name]
    cfg = (function (o) {
        var r = _k_.each_r(o)
        for (var k in o)
        {   
            var m = (function (k, v)
        {
            var cvt, o, s

            if (typeof(v) === 'string')
            {
                o = {}
                s = v.split(/\s\s+/)
                if (s.length > 1)
                {
                    o['?'] = s[0]
                    s = s.slice(1).join(' ')
                }
                else
                {
                    s = s[0]
                    if (!(_k_.in(s[0],'*=-')))
                    {
                        o['?'] = s
                        s = ''
                    }
                }
                s = s.split(' ')
                cvt = function (s)
                {
                    switch (s)
                    {
                        case 'true':
                        case 'yes':
                            return true

                        case 'false':
                        case 'no':
                            return false

                        default:
                            if ((function(o){return !isNaN(o) && !isNaN(parseFloat(o)) && isFinite(o)})(s))
                        {
                            return parseFloat(s)
                        }
                        else
                        {
                            return s
                        }
                    }

                }
                while (s.length)
                {
                    if (s[0] === '')
                    {
                        s.shift()
                    }
                    else if (s[0] === '**')
                    {
                        o['**'] = true
                        s.shift()
                    }
                    else if (s[0] === '*')
                    {
                        o['*'] = true
                        s.shift()
                    }
                    else if (s[0] === '=')
                    {
                        o['='] = cvt(s[1])
                        s.shift()
                        s.shift()
                    }
                    else if (s[0].startsWith('--'))
                    {
                        o['--'] = s[0].slice(2) || '-'
                        s.shift()
                    }
                    else if (s[0].startsWith('-'))
                    {
                        o['-'] = s[0].slice(1) || '-'
                        s.shift()
                    }
                    else
                    {
                        if ((o['='] != null))
                        {
                            o['='] += ' ' + s.shift()
                        }
                    }
                }
                return [k,o]
            }
            else
            {
                return [k,v]
            }
        })(k, o[k])
            if (m != null && m[0] != null)
            {
                r[m[0]] = m[1]
            }
        }
        return typeof o == 'string' ? r.join('') : r
    })(cfg)
    for (k in cfg)
    {
        v = cfg[k]
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
        lng = k
        if (v['-'])
        {
            sht = v['-']
        }
        if (v['--'])
        {
            lng = v['--']
        }
        if (_k_.in(sht,['-']))
        {
            sht = ''
        }
        if (_k_.in(lng,['-','--']))
        {
            lng = ''
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
                result[k] = []
            }
            else
            {
                short[k] = sht
                long[k] = lng
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
                result[k] = []
            }
            else
            {
                short[k] = sht
                long[k] = lng
                help[k] = v['?']
            }
        }
    }
    long2key = (function (o) {
        var r = _k_.each_r(o)
        for (var k in o)
        {   
            var m = (function (k, v)
        {
            return [v,k]
        })(k, o[k])
            if (m != null && m[0] != null)
            {
                r[m[0]] = m[1]
            }
        }
        return typeof o == 'string' ? r.join('') : r
    })(long)
    short2key = (function (o) {
        var r = _k_.each_r(o)
        for (var k in o)
        {   
            var m = (function (k, v)
        {
            return [v,k]
        })(k, o[k])
            if (m != null && m[0] != null)
            {
                r[m[0]] = m[1]
            }
        }
        return typeof o == 'string' ? r.join('') : r
    })(short)
    optionsText = ""
    maxLong = 0
    maxHelp = 0
    for (k in cfg)
    {
        v = cfg[k]
        if ((long[k] != null))
        {
            maxLong = Math.max(maxLong,long[k].length)
        }
        if ((help[k] != null))
        {
            maxHelp = Math.max(maxHelp,strip(help[k]).length)
        }
    }
    for (k in cfg)
    {
        v = cfg[k]
        sht = short[k]
        lng = long[k]
        if ((help[k] != null))
        {
            df = ((function ()
            {
                switch (result[k])
                {
                    case false:
                        return red(dim('✘'))

                    case true:
                        return green(bold('✔'))

                    default:
                        return result[k]
                }

            }).bind(this))()
            shtHelp = sht !== '' ? `${gray('-')}${sht}` : '  '
            lngHelp = lng !== '' ? `${gray('--')}${kstr.rpad(lng,maxLong)}` : '  ' + kstr.pad('',maxLong)
            optionsText += '\n'
            optionsText += `    ${shtHelp} ${lngHelp}`
            optionsText += gray(bold(`  ${kstr.rpad(help[k],maxHelp)}`))
            if ((df != null))
            {
                optionsText += magenta(`  ${df}`)
            }
        }
    }
    helpText = `\n${gray('usage:')}  ${bold(name)} `
    helpText += `${gray('[')}${bold(yellow(param))}${paramList && gray(' ... ]') || gray(']')}`
    helpText += '\n'
    if ((cfg[param] != null ? cfg[param]['?'] : undefined))
    {
        helpText += yellow(bold(`\n        ${param} ${gray(cfg[param]['?'])}`))
        if ((cfg[param]['='] != null) && !paramList)
        {
            helpText += magenta(`  ${kstr.pad('',Math.max(0,maxHelp - strip(cfg[param]['?']).length))} ${cfg[param]['=']}`)
        }
        helpText += '\n'
    }
    if (optionsText.length)
    {
        helpText += gray("\noptions:\n")
        helpText += optionsText
        helpText += '\n\n'
    }
    short2key['h'] = ((_206_19_=short2key['h']) != null ? _206_19_ : 'help')
    long2key['help'] = ((_207_21_=long2key['help']) != null ? _207_21_ : 'help')
    if ((config.version != null))
    {
        version = config.version
        delete config.version
        long2key['version'] = ((_212_28_=long2key['version']) != null ? _212_28_ : 'version')
        short2key['V'] = ((_213_23_=short2key['V']) != null ? _213_23_ : 'version')
    }
    delete config[name]
    if (Object.keys(config).length)
    {
        helpText += noon.stringify(config,{maxalign:16,colors:{key:gray,string:white}})
        helpText += '\n'
    }
    options.ignoreArgs = ((_232_23_=options.ignoreArgs) != null ? _232_23_ : 2)
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
        org = arg
        if (arg.substr(0,2) === '--')
        {
            if (!(arg = long2key[arg.substr(2)]))
            {
                addIgnored(org)
                continue
            }
        }
        else if (arg[0] === '-')
        {
            if (!(arg = short2key[arg.substr(1)]))
            {
                addIgnored(org)
                continue
            }
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
        else if ((function(o){return !isNaN(o) && !isNaN(parseFloat(o)) && isFinite(o)})(result[arg]))
        {
            result[arg] = parseFloat(expandedArgs.shift())
        }
        else if (_k_.in(arg,Object.keys(short2key)))
        {
            result[short2key[arg]] = expandedArgs.shift()
        }
        else if (_k_.in(arg,Object.keys(long2key)))
        {
            result[long2key[arg]] = expandedArgs.shift()
        }
        else
        {
            addParamOrIgnore(arg)
        }
    }
    return result
}
module.exports = parse