'use strict';

const { series, parallel, src, dest  } = require('gulp');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const fs = require("fs");
const glob = require("glob");
const path = require("path");
const sharp = require('sharp')


function copyIco() {
    return src('./src/*.ico')
    .pipe(dest('./docs/'));
}

function copyGifs() {
    return src('./src/assets/img/*.gif')
    .pipe(dest('./docs/assets/img'));
}

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
        //external
        './src/assets/js/jquery-3.2.1.js',
        './src/assets/js/bootstrap-3.3.7.js',

        //app
        './src/assets/js/home/mapa.js',
        './src/assets/js/home/home.js',
        './src/assets/js/app.js'
    ])
    .pipe(concat('app.min.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify({}))
    .pipe(dest('./docs/assets/js/'));
}

function photoSwipeScript() {
    return src([
        './src/assets/js/photoswipe.js',
        './src/assets/js/photoswipe-ui-default.js'
    ])
    .pipe(concat('photoswipe.min.js'))
    .pipe(uglify({}))
    .pipe(dest('./docs/assets/js/'));
}

function images(done) {
    //config
    const transforms = [
        {
            src: "./src/assets/img/*.{jpeg,jpg}",
            dist: "./docs/assets/img/",
            quality: 50,
            convertJpeg: true
        },
        {
            src: "./src/assets/img/*.{png}",
            dist: "./docs/assets/img/",
            quality: 50,
            convertJpeg: false
        },
        {
            src: "./src/assets/img/fotos/*.{jpeg,jpg,png}",
            dist: "./docs/assets/img/fotos",
            quality: 70,
            convertJpeg: true,
            updateFotosJson: true,
            resize: {
                width: 1000
            },
        },
        {
            src: "./src/assets/img/fotos/*.{jpeg,jpg,png}",
            dist: "./docs/assets/img/fotos/thumbnail",
            quality: 20,
            convertJpeg: true,
            resize: {
                width: 200
            }
        }
    ];

    // loop through configuration array of objects
    transforms.forEach(function (transform) {
        // if dist folder does not exist, create it with all parent folders
        if (!fs.existsSync(transform.dist)) {
            fs.mkdirSync(transform.dist, { recursive: true }, (err) => {
            if (err) throw err;
            });
        }

        // glob all files
        let files = glob.sync(transform.src);
        let fotos = {
            data: []
        };
  
        // for each file, apply transforms and save to file
        files.forEach(function (file) {
            const fileExtension = path.extname(file)
            const filename = path.basename(file, fileExtension);
            let sharpTask = sharp(file)

            if (transform.resize) {
                sharpTask = sharpTask.resize(transform.resize.width, transform.resize.height, {
                    withoutEnlargement: true
                });
            }

            let distFileName = null;
            if(transform.convertJpeg) {
                distFileName = `${filename}.jpeg`
                sharpTask
                    .jpeg({ quality: transform.quality })
                    .toFile(`${transform.dist}/${distFileName}`)
                        .then((info) => {
                            if (transform.updateFotosJson) {
                                updateFotosJson(fotos, distFileName, info)
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
            }else {
                distFileName = `${filename}${fileExtension}`;
                sharpTask
                    .toFile(`${transform.dist}/${distFileName}`)
                        .then((info) => {
                            if (transform.updateFotosJson) {
                                updateFotosJson(fotos, distFileName, info)
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
            }
        });
    });
    done();
}

function updateFotosJson(fotos, distFileName, info) {
    fotos.data.push({
        "nome": distFileName,
        "width": info.width,
        "height": info.height
    })
    fs.writeFileSync('./src/fotos.json', JSON.stringify(fotos));
}

exports.build = parallel(copyIco, 
    copyGifs, 
    series(images,pages), 
    fotosJson, 
    appCss, 
    photoSwipeCss, 
    appScript, 
    photoSwipeScript, 
    
);