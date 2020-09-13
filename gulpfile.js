'use strict';

/*var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');*/
const { parallel, src, dest, watch  } = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');


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

function appCss() {
    return src([
        './src/assets/sass/app.scss'
    ])
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('./docs/assets/css'));
}

function photoSwipeCss() {
    return src([
        './src/assets/sass/photoswipe/*.scss'
    ])
    .pipe(concat('photoswipe.scss'))
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('./docs/assets/css'));
}


function appScript() {
    return src([
        './src/assets/js/home/mapa.js',
        './src/assets/js/home/home.js',
        './src/assets/js/app.js'
    ])
    .pipe(concat('app.js'))
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

function images() {
    return src([
        './src/assets/img/*'
    ])
    .pipe(imagemin())
    .pipe(dest('./docs/assets/img'));
}

function galleryImages() {
    return src([
        './src/assets/img/*',
        './src/assets/img/fotos/*'
    ])
    .pipe(imagemin())
    .pipe(dest('./docs/assets/img'));
}


function galleryThumbnails() {
    return src([
        './src/assets/img/fotos/thumbnail/*'
    ])
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 35, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('./docs/assets/img/fotos/thumbnail/'));
}

exports.build = parallel(pages, fotosJson, appCss, photoSwipeCss, appScript, photoSwipeScript, images, galleryThumbnails);