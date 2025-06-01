const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const uglify = require('gulp-uglify');

gulp.task('scripts', function () {
    return browserify({
      entries: ['main/index.js'],
      debug: false
    })
      .transform(babelify.configure({
        presets: ['@babel/preset-env']
      }))
      .bundle()
      .pipe(source('rope.min.js'))  
      // .pipe(buffer())
      // .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
  });