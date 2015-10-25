'use strict';

var gulp = require( 'gulp' );
var pngquant = require( 'imagemin-pngquant' );
var filenamesToJson = require('gulp-filenames-to-json');
var replace = require('gulp-replace');

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

gulp.task( 'default', [ 'get_wapuus', 'create_json' ] );
