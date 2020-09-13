'use strict';

/*var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');*/
const { parallel, src, dest } = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');


function pages() {
    return src(['./src/*.html'])
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    .pipe(dest('./docs'));
}

function fotosJson() {
    return src(['./src/fotos.json'])
        .pipe(dest('./docs'));
}

function css() {
    return src([
        './src/assets/sass/app.scss'
    ])
    .pipe(sass())
    .pipe(dest('./docs/assets/css'));
}

function appScript() {
    return src([
        './src/assets/js/app.js'
    ])
    .pipe(dest('./docs/assets/js/'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify({}))
    .pipe(rename('app.min.js'))
    .pipe(dest('./docs/assets/js/'));
}

function photoSwipeScript() {
    return src([
        './src/assets/js/photoswipe-ui-default.js',
        './src/assets/js/photoswipe.js'
    ])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('photoswipe.min.js'))
    .pipe(uglify({}))
    .pipe(dest('./docs/assets/js/'));
}

exports.build = parallel(pages, fotosJson, css, appScript, photoSwipeScript);