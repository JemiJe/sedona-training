var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var rename = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var runSequence = require('gulp-run-sequence');

var postCSS_plugins = [
  autoprefixer({browsers: [
    "last 1 version",
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Opera versions",
    "last 2 Edge versions"
  ]})
];
/* -------------------------------------- */

/* for Dev */
gulp.task('dev:sass', function () {
  return gulp.src('scss/style.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postCSS_plugins))
    .pipe(gulp.dest('css'));
});
/* -------------------------------------- */

/* for Build */
gulp.task('build:css', function () {

  return gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss(postCSS_plugins))
    /*.pipe(gulp.dest('build'))*/
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('build/css/'));
});
gulp.task('build:images', function () {
  return gulp.src("img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img/"));
});
gulp.task("build:copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "css/normalize.css",
    "js/**",
    "*.html"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});
gulp.task('build:clean', function () {
  return gulp.src('build/*', {read: false})
    .pipe(clean());
});
gulp.task("build", function(cb) {
  runSequence(
    "build:clean",
    "build:copy",
    "build:css",
    "build:images",
    cb
  );
});
/* -------------------------------------- */

// TASKS
gulp.task('server:dev', ['dev:sass'], function() {
    
    browserSync.init({
        server: "./",
        notify: false
    });

    gulp.watch("sass/**/*.scss", ['dev:sass']);
});

gulp.task('server:build', function() {
  
  browserSync.init({
      server: "build",
      port: 3333,
      notify: false
  });
});
// ---------------------------------------


// MAIN TASKS
gulp.task('run:dev', ['server:dev']);
gulp.task('build+server', function(cb){runSequence("build", "server:build", cb);});
// ---------------------------------------

