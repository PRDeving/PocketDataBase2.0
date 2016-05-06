var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var pump = require('pump');

var SRC_PATH = 'src/';
var BUILD_PATH = 'build';

gulp.task('build', [], function() {
  pump([
    gulp.src(SRC_PATH + 'pdb.js'),
    minify(),
    gulp.dest(BUILD_PATH)
  ]);
});

gulp.task('default',['build'])
