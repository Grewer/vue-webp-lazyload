const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
  gulp.src('libs/**/*.js')
    .pipe(babel({
      presets: ['env'],
      plugins: ["transform-class-properties"]
    }))
    .pipe(gulp.dest('dist'))
);


gulp.task('watch', (path, stats) => {
    gulp.watch('libs/*.js', function (cb) {
      return gulp.src('libs/**/*.js')
        .pipe(babel({
          presets: ['env'],
          plugins: ["transform-class-properties"]
        }))
        .pipe(gulp.dest('dist'))
    });
  }
);



// exports.watch = build;
