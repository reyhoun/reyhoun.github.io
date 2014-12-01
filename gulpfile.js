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
var minifyCSS = require('gulp-minify-css');
var cp = require('child_process');
var browserSync = require('browser-sync');
var loadjekyll  = process.platform === "win32" ? "jekyll.bat" : "jekyll";

var messages = {
    jekyllBuild: '<span style="color: grey">Shadia3! it\'s Running:</span> $ jekyll build'
};

/*
 * Create List of JS,CSS and Export File
 */
var JsFileList = [
    './assets/vendor/bower-webfontloader/webfont.js',
    './assets/js/app.js'
];


/**
 * Gulp Tasks
 */
 
 
/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn(loadjekyll, ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'js', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('assets/scss/style.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
		//.pipe(minifyCSS())
        .pipe(gulp.dest('assets/css'));
});

/**
 * Copy font awesome file from assets/vendor to assets/fonts.
 */
gulp.task('font', function() {
  gulp.src('assets/vendor/fontawesome/fonts/fontawesome-webfont.woff')
    .pipe(gulp.dest('assets/font'))
});

/**
 * concatenate and minify JS files and save it to assets/js folder.
 */
gulp.task('js', function() {
  gulp.src(JsFileList)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('./assets/scss/**/*.scss', ['sass', 'jekyll-rebuild']);
    gulp.watch(['index.html', '_layouts/*.html', '_posts/*', 'blog/index.html', 'about/*.md'], ['jekyll-rebuild']);
    gulp.watch('assets/js/app.js', ['js', 'jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);