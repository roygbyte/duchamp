var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');

gulp.task('scripts', function() {
  return gulp.src('public/javascripts/*.js')
    .pipe(livereload());
});

gulp.task('ejs',function() {
  return gulp.src('views/*.ejs')
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('public/javascripts/*.js',['scripts']);
  gulp.watch('views/*.ejs',['ejs']);
});

gulp.task('server',function() {
  nodemon({
    'script': 'app.js',
    'ignore':'public/javascripts/*.js'
  })
});

gulp.task('serve',['server', 'watch']);