var gulp = require('gulp');
connect = require('gulp-connect');
imagemin = require('gulp-imagemin');
sass = require('gulp-ruby-sass');
plumber = require('gulp-plumber');
autoprefixer = require('gulp-autoprefixer');
browserify = require('browserify');
source = require('vinyl-source-stream');
del = require('del');
concatCss = require('gulp-concat-css');

gulp.task('connect', function () {
  connect.server({
    root: 'public',
    port: 8888,
    livereload: true
    });
  });

gulp.task('html', function () {
  gulp.src('app/html/*.html')
  .pipe(gulp.dest('./public/'))
  .pipe(connect.reload());
  });

gulp.task('images', function () {
  gulp.src('app/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('./public/img'))
  .pipe(connect.reload());
  });

// vendor css
gulp.task('css', function () {
  return gulp.src('app/css/*.css')
    .pipe(concatCss("vendor.css"))
    .pipe(gulp.dest('./public/css'))
  .pipe(connect.reload());
});

gulp.task('sass', function() {
  return sass('app/sass/style.scss')
  .pipe(plumber())
    .pipe(autoprefixer({
    browsers: ['last 2 versions','Firefox ESR', 'Opera 12.1'],
    cascade: true
    }))
  .pipe(gulp.dest('./public/css'))
  .pipe(connect.reload());
  });

gulp.task('browserify', function() {
  // Grabs the app.js file
  return browserify('./app/app.js')
      // bundles it and creates a file called main.js
      .bundle()
      .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
        });

gulp.task('watch', function() {
  gulp.watch('app/html/*.html', ['html']);
  gulp.watch('app/img/*', ['images']);
  gulp.watch('app/css/*.css', ['css']);
  gulp.watch('app/sass/*.scss', ['sass']);
  gulp.watch('app/**/*.js', ['browserify']);
  });

//delete public folder before build when needed
gulp.task('clean', function(cb) {
  del(['public/'
    ],cb)
  });

gulp.task('build', ['html','images','css','sass','browserify'], function (cb) {
  cb(null);
  });

gulp.task('default', ['build','connect','watch']);