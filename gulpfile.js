var gulp = require('gulp');

var jsFiles = {
  vendor: [
      'node_modules/jquery/dist/jquery.min.js'
  ]
};
gulp.task('copy-js', function(){
  return gulp.src(jsFiles.vendor)
  .pipe(gulp.dest('src/js'));
});

gulp.task('default', ['copy-js']);
