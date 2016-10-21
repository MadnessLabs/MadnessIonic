const jade = require('gulp-jade');
const rename = require('gulp-rename');

module.exports = function(gulp, callback) {
    return gulp.src(htmlSrcDir+htmlSrcFile)
        .pipe(jade({
            locals: configJSON,
            pretty: true
        }))        
        .pipe(rename('index.html'))
        .pipe(gulp.dest(appDir))
        .on('end', function(){
            if(global.isWatching){ browserSync.reload(); }
        });
};