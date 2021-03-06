/// <binding ProjectOpened='watch, buildAngular' />
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
var exec = require('child_process').exec;
var tslint = require('gulp-tslint');

// MJML Email templates
//const mjml = require('gulp-mjml'),
//    templates = 'Templates/Org/*.mjml',
//    ex = 'Templates/';

var paths = {
    styles: 'scss/**/*.scss',
    styleIncludes: ['wwwroot/lib/bootstrap/scss'],
    stylesOutput: 'wwwroot/css',
    scriptsOrder: [
        'wwwroot/app/app.services.js',
        'wwwroot/app/*.js',
        'wwwroot/app/**/*.js'
    ],
    scriptsOutput: 'wwwroot/js',
    partials: 'wwwroot/app/**/*.html',
    libsLocation: 'wwwroot/lib',
    nodeLocation: 'node_modules',
    angularLocation: 'AngularSource/**/*.{ts,scss,html}',
    componentStyles: 'scss/mvc-components/*.scss',
    componentStylesOutput: 'wwwroot/css/mvc-components',
    //typeScriptSource: 'AngularSource/',
    typeScriptSource: 'AngularSource/app/**/*.{ts}'
};

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

//gulp.task('emails', function () {
//    return gulp
//        .src(templates)
//        .pipe(mjml())
//        .pipe(gulp.dest(ex))
//});

gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(sass({
            sourceComments: true,
            sourceMap: 'sass',
            outputStyle: 'expanded',
            includePaths: paths.styleIncludes
        }).on('error', sass.logError))
        .pipe(autoprefixer())
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
        .pipe(autoprefixer())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(paths.stylesOutput));
});

gulp.task('componentStyles', function () {
    return gulp.src(paths.componentStyles)
        .pipe(sass({
            sourceComments: true,
            sourceMap: 'sass',
            outputStyle: 'expanded',
            includePaths: paths.styleIncludes
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.componentStylesOutput));
});

gulp.task('buildAngular', function (cb) {
    exec('ng build --no-delete-output-path --watch', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('buildAngularStaging', function (cb) {
    exec('ng build --configuration=staging --watch', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('buildAngularProduction', function (cb) {
    exec('ng build --configuration=production --watch', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('tslint', function () {
    return gulp.src(paths.typeScriptSource)
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report());
});

//// TEMP TEST TEMP TEST

var deps = {
    "popper.js": {},
    "jquery": {},
    "jquery-validation": {},
    "jquery-validation-unobtrusive": {},
    "what-input": {},
    "bootstrap": {}
    
};

gulp.task("scriptMovement", function (done) {

    //var streams = [];
    //for (var prop in deps) {
    //    console.log("Prepping Scripts for: " + prop);
    //    for (var itemProp in deps[prop]) {
    //        streams.push(gulp.src("node_modules/" + prop + "/" + itemProp)
    //            .pipe(gulp.dest(paths.libsLocation + "/" + prop + "/" + itemProp + "/" + deps[prop][itemProp])));
    //    }
    //}

    //return streams;
    //This version works but copies everything which isn't great, if we can the above one work correctly it would be better
    for (var prop in deps) {
        gulp.src(paths.nodeLocation + "/" + prop + "/**")
            .pipe(gulp.dest(paths.libsLocation + "/" + prop));
    }


    done();
});

//// TEMP TEST TEMP TEST


// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(paths.styles, gulp.series('styles')).on('error', handleError);
    gulp.watch(paths.styles, gulp.series('componentStyles')).on('error', handleError);
    gulp.watch(paths.styles, gulp.series('minStyles')).on('error', handleError);
});

// Default Task
//gulp.task('default', ['watch']);

//gulp.task('default', gulp.series('watch', function (d) {
//    // default task code here
//}));\