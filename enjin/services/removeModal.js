const clean    = require('gulp-clean');


module.exports = function(name) {
    gulp.src([
        cssSrcDir+'modal/'+name+'.scss',
        htmlSrcDir+'modal/'+name+'.jade',
        htmlDir+'modal/'+name+'.html'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
};