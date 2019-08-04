var gulp = require('gulp');
var concat = require("gulp-concat");
var rmlog = require("gulp-remove-logging");
var minifyCSS = require('gulp-minify-css');
var pipeline = require('readable-stream').pipeline;
let uglify = require('gulp-uglify-es').default;

gulp.task('felun-lib', function() {
  return gulp.src([
          'i18n.js',
          'api.js',
          './store/Authentication.js',
          './store/Preferences.js',
          './store/FelunStore.js',
          './components/LightIcon.js',
          './components/Indicator.js',
          './components/UserBar.js',
          './components/SpinBox.js',
          './components/LightGroup.js',
          './components/AirportMenu.js',
          './components/AirportBar.js',
          './components/SynopticBar.js',
          './components/HomeMenu.js',
           './views/LightsView.js',
           './views/UsersView.js',
           './views/PreferencesView.js',
           './views/ChartView.js',
           './views/SynopticView.js',
           './views/RealView.js',
           './views/GridView.js',
           './views/LoginView.js',
           './views/LogView.js',
           './views/ManualView.js',
            'app.js'])
    .pipe(
      rmlog({
        // Options (optional)
        // eg:
        // namespace: ['console', 'window.console']
      })
    )
    .pipe(uglify())
    .pipe(concat("felun.min.js"))
    .pipe(gulp.dest('./dist'))
});

gulp.task('felun-css', function() {
  return gulp.src([
          'css/felun-controls.css',
          'css/felun-layout.css',
          'css/felun-svg.css'
          ])
    .pipe(minifyCSS())
    .pipe(concat('felun.min.css'))
    .pipe(gulp.dest('./dist'))
});


gulp.task('static-files', function() {
  return gulp.src([
          './js/d3.v5.min.js',
          './js/vue.min.js',
          './js/vuex.min.js',
          './js/vue-i18n.min.js',
          './js/vue-router.min.js',
          './js/ulog.min.js',
          './js/tingle.min.js',
          './js/selectr.min.js',
          './js/canvasjs.min.js',
          './js/ag-grid-enterprise.min.js',
          './js/moment-with-locales.min.js',
          './js/reconnecting-websocket.min.js',
          './css/fontawesome.min.css',
          './css/solid.min.css',
          './css/regular.min.css',
          './css/font-open-sans.css',
          './css/tingle.min.css',
          './css/selectr.min.css',
          './css/ag-grid.css'
          ])
    .pipe(gulp.dest('./dist'))
});
