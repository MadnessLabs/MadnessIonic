const clean    = require('gulp-clean');


module.exports = function(name) {
    gulp.src([
        cssSrcDir+'popover/'+name+'.scss',
        htmlSrcDir+'popover/'+name+'.jade',
        htmlDir+'popover/'+name+'.html'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
};