// Get Current Date and Time
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + "-" + hour + "-" + min + "-" + sec;

}

/*
 * Start Config Gulp 
 * Load Plugins
 */
var gulp   = require('gulp');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var zip = require('gulp-zip');

/*
 * Create List of JS,CSS and Export File
 */
var DocsJsFileList = [
    './assets/vendor/slick.js/slick/slick.js',
    './assets/vendor/bower-webfontloader/webfont.js',
    './assets/js/app.js'
];

var DocsCssFileList = [
    './assets/vendor/prism/plugins/line-numbers/prism-line-numbers.css',
    './assets/vendor/animate.css/animate.min.css'
];


var DocsExportFileList = [
    './docs.html',
    './developer.html'
];

/*
 * Gulp Tasks
 */
gulp.task('js', function() {
  gulp.src(DocsJsFileList)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./assets/js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js'))
});

gulp.task('css', function() {
  gulp.src(DocsCssFileList)
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('./assets/css'))
});

gulp.task('sass', function () {
    gulp.src('./assets/scss/**/*.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('watch', function() {
    gulp.watch('./assets/scss/**/*.scss', ['sass']);
});

gulp.task('backup', function() {
  gulp.src(DocsExportFileList, { base: '.' })
    .pipe(zip('archive-'+getDateTime()+'.zip'))
    .pipe(gulp.dest('backup'))
});

gulp.task('build', ['js', 'css', 'sass']);

gulp.task('export', ['build', 'backup']);