const clean    = require('gulp-clean');


module.exports = function(gulp, name) {
    gulp.src([
        jsSrcDir+'filter/'+name+'.ts'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
};