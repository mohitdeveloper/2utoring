/// <binding ProjectOpened='default' />
var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var compass = require('gulp-compass');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js = require('gulp-ng-html2js');
var htmlmin = require('gulp-htmlmin');
var angularFileSort = require('gulp-angular-filesort');
var gzip = require('gulp-gzip');
var order = require('gulp-order');
const autoprefixer = require('gulp-autoprefixer');

// Emails
var plugins = require('gulp-load-plugins');
var panini = require('panini');
var lazypipe = require('lazypipe');
var inky = require('inky');
var fs = require('fs');
var siphon = require('siphon-media-query');
var $ = plugins();

function emailPages() {
    return gulp.src(['StandingOut/Emails/pages/**/*.html'])
        .pipe(panini({
            layouts: 'StandingOut/Emails/Layouts',
            root: 'StandingOut/Emails/Pages'
        }))
        .pipe(inky())
        .pipe(gulp.dest('StandingOut/Emails/dist'));
}

function emailSass() {
    return gulp.src('StandingOut/Emails/assets/scss/email.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: ['node_modules/foundation-emails/scss']
        }).on('error', $.sass.logError))
        .pipe($.uncss(
            {
                html: ['StandingOut/Emails/dist/**/*.html']
            }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('StandingOut/Emails/dist/css'));
}

function emailInline() {
    return gulp.src('StandingOut/Emails/dist/**/*.html')
        .pipe(emailInliner('StandingOut/Emails/dist/css/email.css'))
        .pipe(gulp.dest('StandingOut/Emails/dist'));
}

function emailInliner(css) {
    var css = fs.readFileSync(css).toString();
    var mqCss = siphon(css);

    var pipe = lazypipe()
        .pipe($.inlineCss, {
            applyStyleTags: false,
            removeStyleTags: true,
            preserveMediaQueries: true,
            removeLinkTags: false
        })
        .pipe($.replace, '<!-- <style> -->', `<style>${mqCss}</style>`)
        .pipe($.replace, '<link rel="stylesheet" type="text/css" href="css/email.css">', '')
        .pipe($.htmlmin, {
            collapseWhitespace: true,
            minifyCSS: true
        });

    return pipe();
}

gulp.task('email-build', gulp.series(emailPages, emailSass, emailInline));

// Website
var paths = {
    styles: 'StandingOut/scss/**/*.scss',
    styleIncludes: ['StandingOut/wwwroot/lib/foundation-sites/scss'],
    stylesOutput: 'StandingOut/wwwroot/css',
    scripts: 'StandingOut/wwwroot/app/**/*.js',
    scriptsOrder: [
        'StandingOut/wwwroot/app/app.services.js',
        'StandingOut/wwwroot/app/*.js',
        'StandingOut/wwwroot/app/**/*.js'
    ],
    scriptsOutput: 'StandingOut/wwwroot/js',
    partials: 'StandingOut/wwwroot/app/**/*.html',
    libsLocation: 'StandingOut/wwwroot/lib',
    nodeLocation: 'node_modules'
};

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
};

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

// Lint Task
gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(order(paths.scriptsOrder, { base: './' }))
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .on('error', handleError)
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .on('error', handleError)
        //.pipe(gzip())
        .pipe(gulp.dest(paths.scriptsOutput));
});

//// TEMP TEST TEMP TEST

var deps = {
    "jquery": {},
    "jquery-validation": {},
    "jquery-validation-unobtrusive": {},
    "angular": {},
    "moment": {},
    "underscore": {},
    "foundation-sites": {},
    "foundation-datepicker": {},
    "ng-file-upload": {},
    "angular-animate": {},
    "angular-cookies": {},
    "angular-messages": {},
    "angular-modal-service": {},
    "angular-resource": {},
    "angular-sanitize": {},
    "chartnew.js": {},
    "what-input": {},
    "toastr": {},
    "datatables.net-buttons-zf": {},
    "datatables.net-buttons": {},
    "datatables.net-colreorder-zf": {},
    "datatables.net-colreorder": {},
    "datatables.net-fixedcolumns-zf": {},
    "datatables.net-fixedcolumns": {},
    "datatables.net-fixedheader-zf": {},
    "datatables.net-fixedheader": {},
    "datatables.net-keytable-zf": {},
    "datatables.net-keytable": {},
    "datatables.net-responsive-zf": {},
    "datatables.net-responsive": {},
    "datatables.net-rowgroup-zf": {},
    "datatables.net-rowgroup": {},
    "datatables.net-rowreorder-zf": {},
    "datatables.net-rowreorder": {},
    "datatables.net-scroller-zf": {},
    "datatables.net-scroller": {},
    "datatables.net-select-zf": {},
    "datatables.net-select": {},
    "datatables.net-zf": {},
    "datatables.net": {},
    "ng-sortable": {},
    "html2canvas": {},
    '@aspnet/signalr': {},
    //"material_calculator": {}, //removed as it needs modification
    "twilio-video": {},
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
    gulp.watch(paths.styles, gulp.series('minStyles')).on('error', handleError);
    gulp.watch(paths.scripts, gulp.series('scripts')).on('error', handleError);
    gulp.watch(paths.nodeLocation, gulp.series('scriptMovement')).on('error', handleError);

    gulp.watch(['StandingOut/Emails/assets/scss/**/*.scss']).on('all', gulp.series(emailSass, emailInline));
});

// Default Task
//gulp.task('default', ['watch']);

gulp.task('default', gulp.series('watch', function (d) {
    // default task code here
}));

