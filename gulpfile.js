var gulp = require('gulp');

//requires 
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');




//compile sass

gulp.task('sass', function(){
  return gulp.src('./scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('./public/stylesheets/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//browser-sync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '/',
    },
    port: 3000
  });
});

//gulp watch 

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('./scss/**/*.scss', ['sass']); 
  // Other watchers
  gulp.watch('./views/**/*.ejs', browserSync.reload); 
  gulp.watch('./public/js/*.js', browserSync.reload); 
});


//default task
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})
