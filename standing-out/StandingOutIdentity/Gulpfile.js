/// <binding ProjectOpened='watch' />
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

var paths = {
    styles: 'scss/**/*.scss',
    styleIncludes: ['wwwroot/lib/bootstrap/scss'],
    stylesOutput: 'wwwroot/css',
};

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(sass({
            sourceComments: true,
            sourceMap: 'sass',
            outputStyle: 'expanded',
            includePaths: paths.styleIncludes
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 99 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(paths.stylesOutput));
});

gulp.task('minStyles', function () {
    return gulp.src(paths.styles)
        .pipe(sass({
            sourceComments: false,
            sourceMap: 'sass',
            outputStyle: 'compressed',
            includePaths: paths.styleIncludes
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 99 versions'],
            cascade: false
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(paths.stylesOutput));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(paths.styles, gulp.series('styles')).on('error', handleError);
    gulp.watch(paths.styles, gulp.series('minStyles')).on('error', handleError);
});