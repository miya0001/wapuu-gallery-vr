'use strict';

var gulp = require( 'gulp' );
var pngquant = require( 'imagemin-pngquant' );
var filenamesToJson = require('gulp-filenames-to-json');
var replace = require('gulp-replace');
var download = require("gulp-download");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task( 'download', function () {
    return download( [
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/controls/VRControls.js',
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/effects/VREffect.js',
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/utils/FontUtils.js',
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/geometries/TextGeometry.js',
            'https://raw.githubusercontent.com/borismus/webvr-boilerplate/master/bower_components/webvr-polyfill/build/webvr-polyfill.js',
            'https://raw.githubusercontent.com/borismus/webvr-boilerplate/master/build/webvr-manager.js'
        ] )
        .pipe( concat( 'three-plugins.min.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( 'lib' ) );
});

gulp.task( 'get_wapuus', function () {
    return gulp.src( [
            'node_modules/wapuu/wapuu-archive/*.png',
            '!node_modules/wapuu/wapuu-archive/canvas-wapuu.png',
            '!node_modules/wapuu/wapuu-archive/wapuu-france-hd.png',
        ] )
        .pipe( pngquant( { quality: '65-80', speed: 4 } )() )
        .pipe( gulp.dest( 'wapuus' ) );
});

gulp.task( 'create_json', ['get_wapuus'], function () {
    return gulp.src( [
            'wapuus/*.png'
        ] )
        .pipe( filenamesToJson( { fileName: 'wapuu.json' } ) )
        .pipe( replace( /^/, 'var wapuus = ' ) )
        .pipe( replace( /$/, ';' ) )
        .pipe( gulp.dest( '.' ) );
});

gulp.task( 'default', [ 'download', 'get_wapuus', 'create_json' ], function () {
    return gulp.src( [
            'node_modules/three/three.min.js',
            'node_modules/tween.js/src/Tween.js',
        ] )
        .pipe( gulp.dest( 'lib' ) );
} );
