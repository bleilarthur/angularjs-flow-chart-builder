var gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    gulpSequence = require('gulp-sequence').use(gulp),
    plumber = require('gulp-plumber'),
    vendorPaths = [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-local-storage/dist/angular-local-storage.min.js',
        'src/js/vendor/ng-flowchart-custom/ngFlowchart.custom.js'
    ];

/* BROWSER */
gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: "src/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

/* IMAGES */
gulp.task('images', function (tmp) {
    gulp.src(['src/assets/img/**/*.png', 'src/assets/img/**/*.jpg', 'src/assets/img/**/*.jpeg'])
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('src/assets/img'));
});

gulp.task('images-dist', function () {
    gulp.src(['src/assets/img/**/*.png', 'src/assets/img/**/*.jpg', 'src/assets/img/**/*.jpeg'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/assets/img'));
});

/* JAVASCRIPT */
gulp.task('scripts', function () {
    return gulp.src(['src/js/*.js', 'src/js/factories/*.js', 'src/js/services/*.js',
        'src/js/controllers/*.js', 'src/js/components/*.js', '!src/js/**/*.spec.js', '!src/js/vendor/**/*'])
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .on('error', gutil.log)
        .pipe(gulp.dest('src'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts-dist', function () {
    return gulp.src(['src/js/*.js', 'src/js/factories/*.js', 'src/js/services/*.js',
        'src/js/controllers/*.js', 'src/js/components/*.js', '!src/js/**/*.spec.js', '!src/js/vendor/**/*'])
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('vendor', function () {
    return gulp.src(vendorPaths)
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .on('error', gutil.log)
        .pipe(gulp.dest('src'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('vendor-dist', function () {
    return gulp.src(vendorPaths)
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist'));
});

/* CSS */
gulp.task('styles', function () {
    return gulp.src(['src/assets/css/**/*.css', 'src/assets/css/*.css'])
        .pipe(plumber())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('src'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles-dist', function () {
    return gulp.src(['src/assets/css/**/*.css', 'src/assets/css/*.css'])
        .pipe(plumber())
        .pipe(concat('style.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(plumber())
        .pipe(browserSync.reload({ stream: true }))
        .on('error', gutil.log);
});

gulp.task('html-dist', function () {
    gulp.src('src/**/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

gulp.task('default', ['browserSync', 'scripts', 'vendor', 'styles'], function () {
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/js/vendor/**/*.js', ['vendor']);
    gulp.watch(['src/assets/css/**/**.css', 'src/assets/css/*'], ['styles']);
    gulp.watch('src/assets/img/**', ['images']);
    gulp.watch('src/**/*.html', ['html']);
});

gulp.task('dist', gulpSequence('clean', ['scripts-dist', 'vendor-dist', 'styles-dist', 'images-dist'], 'html-dist'));