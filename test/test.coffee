        
assert = require 'assert'
chai   = require 'chai'
expect = chai.expect
log    = console.log
chai.should()

process.argv = process.argv.concat ['--no-colors']
karg = require '../coffee/karg' 
require('klor').kolor.globalize()

describe 'config', ->

    # 000   000  000   000  00     00  0000000    00000000  00000000   
    # 0000  000  000   000  000   000  000   000  000       000   000  
    # 000 0 000  000   000  000000000  0000000    0000000   0000000    
    # 000  0000  000   000  000 0 000  000   000  000       000   000  
    # 000   000   0000000   000   000  0000000    00000000  000   000  
    
    it 'number', -> 
        
        expect karg """
            test
                float    . = 123.567
        """, argv:[]
        .to.eql float:123.567
        
        expect karg """
            test
                float    . = 0.0
        """, argv:[]
        .to.eql float:0

        expect karg """
            test
                float  . help text . = 123.567
        """, argv:[]
        .to.eql float:123.567

        expect karg """
            test
                float  . = 123.567
        """, argv:'-f 666.7'.split ' '
        .to.eql float:666.7
        
        expect karg """
            test
                float  . = 123.5
        """, argv:'--float 777.6'.split ' '
        .to.eql float:777.6
    
        expect karg """
            test
                int    . = 123
        """, argv:[]
        .to.eql int:123
        
        expect karg """
            test
                int    . = 0
        """, argv:[]
        .to.eql int:0

        expect karg """
            test
                int  . help text . = 123
        """, argv:[]
        .to.eql int:123

        expect karg """
            test
                int  . help text . = 123
        """, argv:'-i 666.777'.split ' '
        .to.eql int:666.777
        
        expect karg """
            test
                int  . = 123
        """, argv:'-i 666'.split ' '
        .to.eql int:666
        
        expect karg """
            test
                int  . = 123
        """, argv:'--int 777'.split ' '
        .to.eql int:777
            
    # 0000000     0000000    0000000   000      
    # 000   000  000   000  000   000  000      
    # 0000000    000   000  000   000  000      
    # 000   000  000   000  000   000  000      
    # 0000000     0000000    0000000   0000000  
    
    it 'bool', -> 
        
        expect karg """
            test
                bool    . = true
        """, argv:[]
        .to.eql bool:true
        
        expect karg """
            test
                bool    . = false
        """, argv:[]
        .to.eql bool:false

        expect karg """
            test
                bool  . help text . = true
        """, argv:[]
        .to.eql bool:true

        expect karg """
            test
                bool  . = false
        """, argv:['-b']
        .to.eql bool:true
        
        expect karg """
            test
                bool  . = false
        """, argv:['--bool']
        .to.eql bool:true
        
        
    # 000   000   0000000         0000000    00000000  00000000   0000000   000   000  000      000000000  
    # 0000  000  000   000        000   000  000       000       000   000  000   000  000         000     
    # 000 0 000  000   000        000   000  0000000   000000    000000000  000   000  000         000     
    # 000  0000  000   000        000   000  000       000       000   000  000   000  000         000     
    # 000   000   0000000         0000000    00000000  000       000   000   0000000   0000000     000     
    
    it 'no default', ->
        
        expect karg """
            test
                nodefault  . ? has no default
        """, argv:[]
        .to.eql {}
        
        expect karg """
            test
                nodefault
        """, argv:[]
        .to.eql {}

        expect karg """
            test
                nodefault   . ? has no default
        """, argv:['--nodefault', 'test', '-n', 'foo']
        .to.eql nodefault:'foo'
        
        expect karg """
            test
                nodefault   . ? has no default  
        """, argv:['-n', '123']
        .to.eql nodefault:'123'

        expect karg """
            test
                nodefault   . ? has no default  
        """, argv:['-n', 'true']
        .to.eql nodefault:'true'

    # 00000000    0000000   00000000    0000000   00     00   0000000  
    # 000   000  000   000  000   000  000   000  000   000  000       
    # 00000000   000000000  0000000    000000000  000000000  0000000   
    # 000        000   000  000   000  000   000  000 0 000       000  
    # 000        000   000  000   000  000   000  000   000  0000000   
    
    it 'params', ->
        
        expect karg """
            test
                params  . **
        """, argv:[]
        .to.eql {params:[]}

        expect karg """
            test
                params  . **
        """, argv:['a', 'b', '3']
        .to.eql params: ['a', 'b', '3']
        
        expect karg """
            test
                param  . *
        """, argv:[]
        .to.eql {}

        expect karg """
            test
                param  . *
        """, argv:['x']
        .to.eql param:'x'
        
        expect karg """
            test
                params  . ? multiple params . **
        """, argv:['a', 'b', '3']
        .to.eql params: ['a', 'b', '3']

        expect karg """
            test
                param  . ? single param . *
        """, argv:['a', 'b', '3']
        .to.eql param: '3'

        expect karg """
            test
                param  . *
        """, argv:['a', 'b', '3']
        .to.eql param: '3'
                
    #  0000000   0000000    0000000  00000000  
    # 000       000   000  000       000       
    # 000       000000000  0000000   0000000   
    # 000       000   000       000  000       
    #  0000000  000   000  0000000   00000000  
    
    it 'case', ->
        
        expect karg """
            test
                Upper  . = false
        """, argv:[]
        .to.eql Upper:false

        expect karg """
            test
                Upper  . = false
        """, argv:['-U']
        .to.eql Upper:true

        expect karg """
            test
                upperCaseU  . = false . - U
        """, argv:['-U']
        .to.eql upperCaseU:true

        expect karg """
            test
                dev-tools  . = false . - D
        """, argv:['-D']
        .to.eql 'dev-tools':true
        
    # 000   000  00000000  00000000    0000000  000   0000000   000   000  
    # 000   000  000       000   000  000       000  000   000  0000  000  
    #  000 000   0000000   0000000    0000000   000  000   000  000 0 000  
    #    000     000       000   000       000  000  000   000  000  0000  
    #     0      00000000  000   000  0000000   000   0000000   000   000  
    
    it 'version', ->
        
        expect karg """
            test
                arg  . = false
            version  0.1.2
        """, argv:['-V'], returnLog:true
        .to.eql '0.1.2'

        expect karg """
            test
                arg  . = false
        """, argv:['-V']
        .to.eql arg:false, __ignored:['-V']
        
        expect karg """
            test
                Volt  . = should override -V for version
            version  0.1.2
        """, argv:['-V', '0'], returnLog:true
        .to.eql Volt:'0'
        
    # 000   000  00000000  000      00000000   
    # 000   000  000       000      000   000  
    # 000000000  0000000   000      00000000   
    # 000   000  000       000      000        
    # 000   000  00000000  0000000  000        
    
    it 'help', ->
        
        expect strip karg """
            test
                arg  . = false
        """, argv:['-h'], returnLog:true
        .to.include 'usage:  test'
                            
        expect strip karg """
            test
                arg  . = false
        """, argv:['--help'], returnLog:true
        .to.include 'usage:  test'
        
        