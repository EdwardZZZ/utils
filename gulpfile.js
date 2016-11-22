var path = require('path')

var gulp = require('gulp')
var sass = require('gulp-sass')
var watch = require('gulp-watch')
var autoprefixer = require('gulp-autoprefixer')
var sassGrapher = require('gulp-sass-grapher')
var debug = require('gulp-debug')
var rename = require('gulp-rename')
var plumber = require('gulp-plumber')
var base64 = require('gulp-css-base64')

var importWxss = require('./importWxss')

var sassSrc = 'sources/pages'
var cssDest = 'wechat-app/pages'

gulp.task('sass', function () {
    var loadPaths = path.resolve(sassSrc);
    sassGrapher.init(sassSrc, { loadPaths: loadPaths });
    return watch('sources/pages/*/*.scss')
        .pipe(plumber())
        // .pipe(sassGrapher.ancestors())
        .pipe(sass({
            includePath: loadPaths
        }))
        .pipe(plumber.stop())
        .pipe(autoprefixer({
            browsers: ['Chrome > 0']
        }))
        .pipe(rename({
            extname: ".wxss"
        }))
        .pipe(debug({
            title: '编译:'
        }))
        .pipe(base64())
        .pipe(importWxss())
        .pipe(gulp.dest(cssDest))
});

gulp.task('default', ['sass']);