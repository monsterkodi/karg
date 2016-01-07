del  = require 'del'
path = require 'path'
gulp = require 'gulp'
p    = require('gulp-load-plugins') lazy:false
(eval "#{k} = p.#{k}" for k,v of p)
 
onError = (err) -> util.log err

gulp.task 'coffee', ->
    gulp.src ['coffee/*.coffee'], base: 'coffee'
        .pipe plumber()
        .pipe debug 'coffee'
        .pipe salt()
        .pipe gulp.dest 'coffee'
        .pipe pepper
            stringify: (info) -> 'chalk.blue("'+info.class + info.type + info.method + ' ► ")'
            paprika: 
                dbg: 'log'
            paprikaPrefix:  'chalk.gray("'
            paprikaPostfix: ':")'
        .pipe coffee(bare: true).on 'error', onError
        .pipe gulp.dest 'js'

gulp.task 'coffee_release', ->
    gulp.src ['coffee/*.coffee'], base: 'coffee'
        .pipe plumber()
        .pipe pepper
            stringify: -> '""'
            paprika: 
                dbg: 'log'
        .pipe coffee(bare: true).on 'error', onError
        .pipe gulp.dest 'js'
                    
gulp.task 'salt', ->
    gulp.src ['**/*.coffee'], base: '.'
        .pipe plumber()
        .pipe salt()
        .pipe gulp.dest '.'

gulp.task 'bump', ->
    gulp.src './package.json'
        .pipe bump()
        .pipe gulp.dest '.'

gulp.task 'clean', (cb) ->
    del.sync [ 'js' ]
    cb()
    
gulp.task 'release', ['clean', 'salt', 'coffee_release']

gulp.task 'default', ->
                
    gulp.watch 'coffee/*.coffee', ['coffee']
