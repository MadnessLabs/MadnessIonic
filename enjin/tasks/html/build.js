const jade = require('gulp-jade');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const rename = require('gulp-intercept');

module.exports = function(gulp, callback) {
    var ext = htmlSrcFile.split('.').pop();
    return gulp.src(htmlWatch)
        .pipe(gulpif(global.isWatching, plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        })))
        .pipe(jade({
            locals: configJSON,
            pretty: true
        }))        
        .pipe(rename(function(file){
            if(file.basename+'.'+ext === htmlSrcFile){
                file.basename = 'index';
                file.dirname = '../';
            }
        }))
        .pipe(gulp.dest(htmlDir));
};