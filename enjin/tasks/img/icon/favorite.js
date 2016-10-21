const favicons = require('gulp-favicons');


module.exports = function(gulp, callback) {
    /*gulp.src(htmlSrcDir+'favicon.jade', {read: false})
        .pipe(clean());*/
    gulp.src(appIcon).pipe(favicons({
        appName: appName,
        appDescription: appDesc,
        background: "#fff",
        url: appUrl,
        path: '/img/icon/',
        version: appVersion,
        logging: true,
        html: htmlSrcDir+'favicon.jade'
    }))
    .pipe(gulp.dest(imgIconDir));
};