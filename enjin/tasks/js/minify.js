const plumber   = require('gulp-plumber');
const rename    = require('gulp-rename');
const uglify    = require('gulp-uglify');


module.exports = function(gulp, callback) {
    return gulp.src(jsDestDir+jsDestFile)
        .pipe(plumber({
            errorHandler: function(error) {
                global.bs.notify(error.message, errorTimeout);
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(jsDestDir));
};