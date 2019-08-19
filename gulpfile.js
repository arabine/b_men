var gulp = require('gulp');
var concat = require("gulp-concat");
var rmlog = require("gulp-remove-logging");
var minifyCSS = require('gulp-minify-css');
var pipeline = require('readable-stream').pipeline;
let uglify = require('gulp-uglify-es').default;

gulp.task('bmen-lib', function() {
  return gulp.src([
          'i18n.js',
          'api.js',
          'store.js',
          './components/Card.js',
          './components/MenuItem.js',
          './components/PlayerIcon.js',
		  './components/Trash.js',
           './views/GameView.js',
           './views/MenuView.js',
            'app.js'])
    .pipe(
      rmlog({
        // Options (optional)
        // eg:
        // namespace: ['console', 'window.console']
      })
    )
    .pipe(uglify())
    .pipe(concat("bmen.min.js"))
    .pipe(gulp.dest('./dist'))
});

gulp.task('bmen-css', function() {
  return gulp.src([
          'style.css',
          ])
    .pipe(minifyCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./dist'))
});

