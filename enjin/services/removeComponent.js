const clean    = require('gulp-clean');


module.exports = function(gulp, name) {
    gulp.src([
        cssSrcDir+'directive/'+name+'.scss',
        jsSrcDir+'directive/'+name+'.ts',
        htmlSrcDir+'directive/'+name+'.jade',
        htmlDir+'directive/'+name+'.html'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
};