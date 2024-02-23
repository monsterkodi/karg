// monsterkodi/kode 0.250.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var kolor, krg, noon, process

noon = require('noon')
process = require('process')
process.argv = process.argv.concat(['--no-colors'])
kolor = require('klor').kolor

krg = require('../')
module.exports["karg"] = function ()
{
    section("number", function ()
    {
        compare(krg(`test
    float    . = 123.567`,{argv:[]}),{float:123.567})
        compare(krg(`test
    float    . = 0.0`,{argv:[]}),{float:0})
        compare(krg(`test
    float  . help text . = 123.567`,{argv:[]}),{float:123.567})
        compare(krg(`test
    float  . = 123.567`,{argv:'-f 666.7'.split(' ')}),{float:666.7})
        compare(krg(`test
    float  . = 123.5`,{argv:'--float 777.6'.split(' ')}),{float:777.6})
        compare(krg(`test
    int    . = 123`,{argv:[]}),{int:123})
        compare(krg(`test
    int    . = 0`,{argv:[]}),{int:0})
        compare(krg(`test
    int  . help text . = 123`,{argv:[]}),{int:123})
        compare(krg(`test
    int  . help text . = 123`,{argv:'-i 666.777'.split(' ')}),{int:666.777})
        compare(krg(`test
    int  . = 123`,{argv:'-i 666'.split(' ')}),{int:666})
        compare(krg(`test
    int  . = 123`,{argv:'--int 777'.split(' ')}),{int:777})
        compare(krg(`test
    int  . = 123m`,{argv:'--int 777'.split(' ')}),{int:'777'})
        compare(krg(`test
    int  . = 123`,{argv:'--int 777s'.split(' ')}),{int:777})
    })
    section("number short", function ()
    {
        compare(krg(`shrt
    float     = 123.567`,{argv:[]}),{float:123.567})
        compare(krg(`shrt
    float     = 0.0`,{argv:[]}),{float:0})
        compare(krg(`shrt
    float   help text  = 123.567`,{argv:[]}),{float:123.567})
        compare(krg(`shrt
    float  = 123.567`,{argv:'-f 666.7'.split(' ')}),{float:666.7})
        compare(krg(`shrt
    float  = 123.5`,{argv:'--float 777.6'.split(' ')}),{float:777.6})
        compare(krg(`shrt
    int    = 123`,{argv:[]}),{int:123})
        compare(krg(`shrt
    int    = 0`,{argv:[]}),{int:0})
        compare(krg(`shrt
    int    help text  = 123`,{argv:[]}),{int:123})
        compare(krg(`shrt
    int    help text  = 123`,{argv:'-i 666.777'.split(' ')}),{int:666.777})
        compare(krg(`shrt
    int   = 123`,{argv:'-i 666'.split(' ')}),{int:666})
        compare(krg(`shrt
    int   = 123`,{argv:'--int 777'.split(' ')}),{int:777})
        compare(krg(`shrt
    int   = 123m`,{argv:'--int 777'.split(' ')}),{int:'777'})
        compare(krg(`shrt
    int   = 123`,{argv:'--int 777s'.split(' ')}),{int:777})
    })
    section("bool", function ()
    {
        compare(krg(`test
    bool    . = true`,{argv:[]}),{bool:true})
        compare(krg(`test
    bool    . = false`,{argv:[]}),{bool:false})
        compare(krg(`test
    bool  . help text . = true`,{argv:[]}),{bool:true})
        compare(krg(`test
    bool  . = false`,{argv:['-b']}),{bool:true})
        compare(krg(`test
    bool  . = false`,{argv:['--bool']}),{bool:true})
    })
    section("bool short", function ()
    {
        compare(krg(`shrt
    bool    = true`,{argv:[]}),{bool:true})
        compare(krg(`shrt
    bool    = false`,{argv:[]}),{bool:false})
        compare(krg(`shrt
    bool   help text  = true`,{argv:[]}),{bool:true})
        compare(krg(`shrt
    bool  = false`,{argv:['-b']}),{bool:true})
        compare(krg(`shrt
    bool  = false`,{argv:['--bool']}),{bool:true})
    })
    section("no default", function ()
    {
        compare(krg(`test
    nodefault  . ? has no default`,{argv:[]}),{})
        compare(krg(`test
    lonelyarg`,{argv:[]}),{})
        compare(krg(`test
    nodefault   . ? has no default`,{argv:['--nodefault','test','-n','foo']}),{nodefault:'foo'})
        compare(krg(`test
    nodefault   . ? has no default  `,{argv:['-n','123']}),{nodefault:'123'})
        compare(krg(`test
    nodefault   . ? has no default  `,{argv:['-n','true']}),{nodefault:'true'})
    })
    section("no default short", function ()
    {
        compare(krg(`shrt
    nodefault   has no default`,{argv:[]}),{})
        compare(krg(`shrt
    nodefault   has no default`,{argv:['--nodefault','test','-n','foo']}),{nodefault:'foo'})
        compare(krg(`shrt
    nodefault   has no default  `,{argv:['-n','123']}),{nodefault:'123'})
        compare(krg(`shrt
    nodefault   has no default  `,{argv:['-n','true']}),{nodefault:'true'})
    })
    section("no short", function ()
    {
        compare(krg(`test
    noshort  . = false . - -`,{argv:['-n']}),function (a)
        {
            return a.noshort === false
        })
        compare(krg(`test
    noshort  . = false . - -`,{argv:['--noshort']}),function (a)
        {
            return a.noshort === true
        })
        compare(krg(`test
    noshort  . = true . - -`,{argv:['-n']}),function (a)
        {
            return a.noshort === true
        })
        compare(krg(`test
    noshort  . = true . - -`,{argv:['--noshort']}),function (a)
        {
            return a.noshort === false
        })
    })
    section("no short short", function ()
    {
        compare(krg(`shrt
    noshort   = true -`,{argv:['-n']}),{noshort:true,__ignored:['-n']})
        compare(krg(`shrt
    noshort   = false -`,{argv:['-n']}),{noshort:false,__ignored:['-n']})
        compare(krg(`shrt
    noshort   = no - --`,{argv:['-n','--noshort']}),{noshort:false,__ignored:['-n','--noshort']})
    })
    section("params", function ()
    {
        compare(krg(`test
    params  . **`,{argv:[]}),{params:[]})
        compare(krg(`test
    params  . **`,{argv:['a','b','3']}),{params:['a','b','3']})
        compare(krg(`test
    param  . *`,{argv:[]}),{})
        compare(krg(`test
    param  . *`,{argv:['x']}),{param:'x'})
        compare(krg(`test
    params  . ? multiple params . **`,{argv:['a','b','3']}),{params:['a','b','3']})
        compare(krg(`test
    param  . ? single param . *`,{argv:['a','b','3']}),{param:'3'})
        compare(krg(`test
    param  . *`,{argv:['a','b','3']}),{param:'3'})
    })
    section("params short", function ()
    {
        compare(krg(`shrt
    files    **`,{argv:['d','e','f']}),{files:['d','e','f']})
        compare(krg(`shrt
    files  some info about files  **`,{argv:['d','e','f']}),{files:['d','e','f']})
        compare(krg(`shrt
    param   single param  *`,{argv:['a','b','3']}),{param:'3'})
        compare(krg(`shrt
    param   *`,{argv:['a','b','3']}),{param:'3'})
    })
    section("case", function ()
    {
        compare(krg(`test
    Upper  . = false`,{argv:[]}),{Upper:false})
        compare(krg(`test
    Upper  . = false`,{argv:['-U']}),{Upper:true})
        compare(krg(`test
    upperCaseU  . = false . - U`,{argv:['-U']}),{upperCaseU:true})
        compare(krg(`test
    dev-tools  . = false . - D`,{argv:['-D']}),{'dev-tools':true})
    })
    section("version", function ()
    {
        compare(krg(`test
    arg  . = false
version  0.1.2`,{argv:['-V'],returnLog:true}),'0.1.2')
        compare(krg(`test
    arg  . = false`,{argv:['-V']}),{arg:false,__ignored:['-V']})
        compare(krg(`test
    Volt  . = should override -V for version
version  2.3.4`,{argv:['-V','0']}),{Volt:'0'})
    })
    section("help", function ()
    {
        compare(kolor.strip(krg(`test
    arg  . = false`,{argv:['-h'],returnLog:true})),function (a)
        {
            return _k_.in('usage:  test',a)
        })
        compare(kolor.strip(krg(`test
    arg  . = false`,{argv:['--help'],returnLog:true})),function (a)
        {
            return _k_.in('usage:  test',a)
        })
    })
    section("help short", function ()
    {
        compare(kolor.strip(krg(`shortconfig
    arg     info about arg  = false
    noInfo                  = true  
    noShort                 = true -
    noLong                  = true --
    newLong                 = true --long
    newShort                = true -s
    newLongShort            = true -S --LS`,{argv:['--help'],returnLog:true})),function (a)
        {
            return _k_.in('usage:  shortconfig',a)
        })
        compare(kolor.strip(krg(`short
    files  some info about files  **`,{argv:['--help'],returnLog:true})),function (a)
        {
            return _k_.in('usage:  short [files ... ]',a) && _k_.in('some info about files',a)
        })
        compare(kolor.strip(krg(`short
    files  some info about files  **
    other  some info about other`,{argv:['--help'],returnLog:true})),function (a)
        {
            _k_.in('usage:  short [files ... ]',a) && _k_.in('some info about files',a)
            return _k_.in('some info about other',a)
        })
    })
}
module.exports["karg"]._section_ = true
module.exports._test_ = true
module.exports
